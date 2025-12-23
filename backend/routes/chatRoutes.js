const express = require('express');
const axios = require('axios');
const router = express.Router();

// OpenAI Chat Endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, tasks } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Prepare task context for the AI
    const taskContext = tasks.length > 0
      ? `Current tasks: ${tasks.map(t => `${t.title} (${t.completed ? 'completed' : 'pending'})`).join(', ')}`
      : 'User has no tasks yet';

    const systemPrompt = `You are TaskFlow Assistant, a helpful AI assistant for a task management app. 
You help users manage their tasks, create new ones, and provide productivity advice.
${taskContext}

When users ask to add tasks, respond with:
{"action": "addTask", "taskTitle": "task name here"}

Be concise, friendly, and use relevant emojis. Provide task management advice when helpful.`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiMessage = response.data.choices[0].message.content;

    // Check if AI wants to add a task
    let action = null;
    let taskTitle = null;

    if (aiMessage.includes('{"action": "addTask"')) {
      try {
        const actionMatch = aiMessage.match(/\{"action":\s*"addTask",\s*"taskTitle":\s*"([^"]+)"\}/);
        if (actionMatch) {
          action = 'addTask';
          taskTitle = actionMatch[1];
        }
      } catch (e) {
        console.log('Could not parse action from AI response');
      }
    }

    // Extract clean message (remove JSON action if present)
    const cleanMessage = aiMessage
      .replace(/\{"action":\s*"addTask",\s*"taskTitle":\s*"[^"]+"\}/, '')
      .trim();

    res.json({
      response: cleanMessage || aiMessage,
      action,
      taskTitle
    });
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

module.exports = router;
