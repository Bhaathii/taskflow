const axios = require('axios');

const testChatAPI = async () => {
  try {
    console.log('Testing Chat API with message: "Add a task to buy groceries"\n');
    console.log('Sending request to: http://localhost:5000/api/chat\n');
    
    const response = await axios.post('http://localhost:5000/api/chat', {
      message: 'Add a task to buy groceries',
      tasks: [],
      userId: 'test123'
    }, {
      timeout: 15000
    });
    
    console.log('✅ Chat API Response:');
    console.log('Status:', 200);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Chat API Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error Message:', error.response.data?.error || error.response.data);
      console.error('Details:', error.response.data?.details || error.response.data?.message);
    } else if (error.request) {
      console.error('No response received:', error.message);
      console.error('Request:', error.request);
    } else {
      console.error('Error:', error.message);
      console.error('Full Error:', error);
    }
  }
};

testChatAPI();
