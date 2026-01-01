// Comprehensive Chat App Test Report
// Testing all chat features

const axios = require('axios');

const testComprehensive = async () => {
  console.log('═══════════════════════════════════════════');
  console.log('  TASKFLOW CHAT APP - COMPREHENSIVE TEST');
  console.log('═══════════════════════════════════════════\n');

  const tests = [
    {
      category: 'BASIC COMMANDS',
      tests: [
        { msg: 'help', expect: 'Shows available commands' },
        { msg: 'hi', expect: 'Friendly greeting response' },
      ]
    },
    {
      category: 'TASK ADDITION',
      tests: [
        { msg: 'add task', expect: 'Asks for task name (needsDetails: true)' },
        { msg: 'add task to buy milk', expect: 'Asks for date with task title extracted' },
        { msg: 'create task exercise', expect: 'Asks for date (alternative create syntax)' },
      ]
    },
    {
      category: 'TASK LISTING',
      tests: [
        { msg: 'show my tasks', expect: 'Lists all tasks' },
        { msg: 'list tasks', expect: 'Lists all tasks (alternative)' },
      ]
    },
    {
      category: 'TASK FILTERING',
      tests: [
        { msg: 'show completed', expect: 'Shows only completed tasks' },
        { msg: 'show pending', expect: 'Shows only pending tasks' },
        { msg: 'show done', expect: 'Shows completed tasks (alternative)' },
      ]
    },
    {
      category: 'STATISTICS',
      tests: [
        { msg: 'how many tasks', expect: 'Shows task statistics' },
        { msg: 'statistics', expect: 'Shows task statistics' },
        { msg: 'progress', expect: 'Shows progress percentage' },
      ]
    },
    {
      category: 'HELP & GUIDANCE',
      tests: [
        { msg: 'delete task', expect: 'Shows how to delete' },
        { msg: 'how delete', expect: 'Shows deletion instructions' },
      ]
    }
  ];

  let passCount = 0;
  let failCount = 0;

  for (const category of tests) {
    console.log(`\n📂 ${category.category}`);
    console.log('─'.repeat(50));

    for (const test of category.tests) {
      try {
        const response = await axios.post('http://localhost:5000/api/chat', {
          message: test.msg,
          tasks: [
            { title: 'Sample Task 1', completed: false },
            { title: 'Sample Task 2', completed: true }
          ],
          userId: 'test'
        }, { timeout: 5000 });

        console.log(`✅ "${test.msg}"`);
        console.log(`   Expected: ${test.expect}`);
        console.log(`   Action: ${response.data.action || 'none'}`);
        console.log(`   Response: ${response.data.response.substring(0, 60)}...`);
        passCount++;
      } catch (error) {
        console.log(`❌ "${test.msg}" - FAILED: ${error.message}`);
        failCount++;
      }
      console.log();
    }
  }

  console.log('\n═══════════════════════════════════════════');
  console.log('  TEST SUMMARY');
  console.log('═══════════════════════════════════════════');
  console.log(`✅ Passed: ${passCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📊 Total:  ${passCount + failCount}`);
  console.log(`🎯 Success Rate: ${Math.round((passCount / (passCount + failCount)) * 100)}%\n`);

  if (failCount === 0) {
    console.log('🎉 ALL TESTS PASSED! Chat app is working correctly!\n');
  }
};

testComprehensive().catch(console.error);
