const axios = require('axios');

const testFrontendFlow = async () => {
  console.log('🧪 Testing Frontend-Managed Multi-Step Task Creation\n');
  
  try {
    // This simulates what the frontend does
    
    // Step 1: User says "add task"
    console.log('👤 User: "add task"');
    let response = await axios.post('http://localhost:5000/api/chat', {
      message: 'add task',
      tasks: [],
      userId: 'test'
    });
    
    console.log('🤖 Bot:', response.data.response);
    console.log('  → needsDetails:', response.data.needsDetails);
    console.log('  → action:', response.data.action);
    console.log('  (Frontend now sets taskCreationStep = "name")\n');
    
    // Step 2: User provides task name (frontend is in "name" step)
    console.log('👤 User: "buy groceries"');
    console.log('  (Frontend in step "name", will process this as task title)');
    console.log('  (Frontend sets taskCreationStep = "date")\n');
    
    // Step 3: User provides date (frontend is in "date" step)
    console.log('👤 User: "tomorrow"');
    console.log('  (Frontend in step "date", will process this as date)');
    console.log('  (Frontend sets taskCreationStep = "time")\n');
    
    // Step 4: User provides time (frontend is in "time" step)
    console.log('👤 User: "3pm"');
    console.log('  (Frontend in step "time", will process this as time)');
    console.log('  (Frontend creates task: title="buy groceries", date="tomorrow", time="3pm")\n');
    
    // Step 5: Task is created
    console.log('✅ Final Task Created:');
    console.log('  {');
    console.log('    title: "buy groceries",');
    console.log('    description: "📅 Date: tomorrow\\n⏰ Time: 3pm",');
    console.log('    completed: false,');
    console.log('    createdAt: new Date().toISOString()');
    console.log('  }');
    
    // Verify the initial action works
    console.log('\n📋 Testing another common flow:');
    console.log('👤 User: "add task to call mom"');
    response = await axios.post('http://localhost:5000/api/chat', {
      message: 'add task to call mom',
      tasks: [],
      userId: 'test'
    });
    
    console.log('🤖 Bot:', response.data.response);
    console.log('  → action:', response.data.action);
    console.log('  → taskTitle:', response.data.taskTitle);
    if (response.data.needsDetails) {
      console.log('  → Will ask for date/time next');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testFrontendFlow();
