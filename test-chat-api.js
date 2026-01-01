const axios = require('axios');

const testAPI = async () => {
  try {
    console.log('Testing Chat API...');
    const response = await axios.post('http://localhost:5000/api/chat', {
      message: 'Add a task to buy groceries',
      tasks: [],
      userId: 'test'
    });
    
    console.log('✅ API Response:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ API Error:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.message);
    console.error('Data:', error.response?.data);
  }
};

testAPI();
