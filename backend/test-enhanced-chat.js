const axios = require('axios');

const testChatAPI = async () => {
  const sampleTasks = [
    { title: 'Buy groceries', completed: false },
    { title: 'Finish project', completed: true },
    { title: 'Call dentist', completed: false }
  ];

  const tests = [
    { msg: 'help', desc: 'Help request' },
    { msg: 'add task to do exercise', desc: 'Add task' },
    { msg: 'show my tasks', desc: 'List tasks' },
    { msg: 'show completed', desc: 'Show completed tasks' },
    { msg: 'show pending', desc: 'Show pending tasks' },
    { msg: 'how many tasks', desc: 'Statistics' },
    { msg: 'how delete task', desc: 'Delete help' },
    { msg: 'random message', desc: 'Unknown message' }
  ];

  for (const test of tests) {
    try {
      console.log(`\n📝 Test: ${test.desc}`);
      console.log(`   Message: "${test.msg}"`);
      
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: test.msg,
        tasks: sampleTasks,
        userId: 'test'
      }, { timeout: 5000 });
      
      console.log(`   ✅ Response:`);
      console.log(`   ${response.data.response.split('\n').join('\n   ')}`);
      if (response.data.action) {
        console.log(`   Action: ${response.data.action} - "${response.data.taskTitle}"`);
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
    }
  }
};

testChatAPI();
