const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const taskRoutes = require('./routes/taskRoutes');
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/tasks', taskRoutes);
app.use('/api/chat', chatRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('TaskFlow API is running');
});

// MongoDB Connection
const connectDB = async () => {
  let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow';

  try {
    await mongoose.connect(uri);
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.log('Local MongoDB failed, trying in-memory fallback...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log('MongoDB Connected Successfully (In-Memory)');
    } catch (fallbackErr) {
      console.log('MongoDB Connection Error:', err);
      console.log('Fallback Error:', fallbackErr);
    }
  }
};

// Only start server if run directly
if (require.main === module) {
  connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}

module.exports = app;
