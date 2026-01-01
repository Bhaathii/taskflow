const axios = require('axios');

const testMultiStepTask = async () => {
  console.log('🧪 Testing Multi-Step Task Creation\n');
  
  try {
    // Step 1: User says "add task"
    console.log('Step 1️⃣: User says "add task"');
    let response = await axios.post('http://localhost:5000/api/chat', {
      message: 'add task',
      tasks: [],
      userId: 'test'
    }, { timeout: 5000 });
    
    console.log('Bot:', response.data.response);
    console.log('Action:', response.data.action);
    console.log('Needs Details:', response.data.needsDetails);
    
    // Step 2: User provides task name
    console.log('\nStep 2️⃣: User provides task name "buy groceries"');
    response = await axios.post('http://localhost:5000/api/chat', {
      message: 'buy groceries',
      tasks: [],
      userId: 'test'
    }, { timeout: 5000 });
    
    console.log('Bot:', response.data.response);
    
    // Step 3: User provides date
    console.log('\nStep 3️⃣: User provides date "tomorrow"');
    response = await axios.post('http://localhost:5000/api/chat', {
      message: 'tomorrow',
      tasks: [],
      userId: 'test'
    }, { timeout: 5000 });
    
    console.log('Bot:', response.data.response);
    
    // Step 4: User provides time
    console.log('\nStep 4️⃣: User provides time "3pm"');
    response = await axios.post('http://localhost:5000/api/chat', {
      message: '3pm',
      tasks: [],
      userId: 'test'
    }, { timeout: 5000 });
    
    console.log('Bot:', response.data.response);
    console.log('\n✅ Multi-step task creation test complete!');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
};

testMultiStepTask();
