const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Middleware to check if userId is provided
const checkUserId = (req, res, next) => {
  const userId = req.headers['x-user-id'] || req.body.userId;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  req.userId = userId;
  next();
};

// Apply userId check to all routes
router.use(checkUserId);

// Get all tasks for the logged-in user
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single task by ID (must belong to user)
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    // Check if task belongs to the user
    if (task.userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new task for the logged-in user
router.post('/', async (req, res) => {
  const task = new Task({
    userId: req.userId,
    title: req.body.title,
    description: req.body.description || '',
    completed: req.body.completed || false,
    dueDate: req.body.dueDate || null,
    reminder: req.body.reminder || false
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a task (must belong to user)
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    // Check if task belongs to the user
    if (task.userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    if (req.body.title) task.title = req.body.title;
    if (req.body.description !== undefined) task.description = req.body.description;
    if (req.body.completed !== undefined) task.completed = req.body.completed;
    if (req.body.dueDate !== undefined) task.dueDate = req.body.dueDate;
    if (req.body.reminder !== undefined) task.reminder = req.body.reminder;
    
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task (must belong to user)
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    // Check if task belongs to the user
    if (task.userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
