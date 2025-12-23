# TaskFlow AI Chatbot - Setup Guide

## 🤖 OpenAI GPT-4 Integration

Your TaskFlow app now includes an advanced AI-powered chatbot that uses OpenAI's GPT-4 model!

### 📋 Prerequisites

1. **OpenAI API Key**
   - Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Sign up or log in
   - Create a new API key
   - Copy your API key

### ⚙️ Setup Instructions

#### Backend Setup

1. **Install Required Package** (if not already installed)
   ```bash
   cd backend
   npm install openai
   ```

2. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

3. **Add Your OpenAI API Key**
   
   Edit `backend/.env`:
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   MONGODB_URI=your-mongodb-uri
   PORT=5000
   ```

4. **Start the Backend Server**
   ```bash
   npm run dev
   ```

#### Frontend Setup

The frontend is already configured! Just make sure your `REACT_APP_API_URL` environment variable points to your backend:

```bash
cd frontend
# Create .env file if it doesn't exist
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
npm start
```

### 🎯 How to Use

1. **Click the Chat Bubble** - Open the floating chat bubble in the bottom-right corner
2. **Chat Naturally** - Type your requests:
   - "Add a task to buy groceries"
   - "Help me organize my day"
   - "What's my productivity looking like?"
   - "Show me my pending tasks"
   - "I need to do laundry tomorrow"

3. **Get Instant Responses** - GPT-4 will:
   - Understand natural language requests
   - Automatically create tasks when appropriate
   - Provide productivity tips
   - Answer questions about your tasks

### 💡 Advanced Features

#### Fallback Mode
If OpenAI API is unavailable or not configured:
- The chatbot automatically falls back to simple pattern matching
- All basic commands still work perfectly
- No interruption to your workflow

#### Task Context
The AI understands your current tasks:
- It knows what tasks you have pending
- It won't create duplicate tasks
- It provides context-aware suggestions

### 🔒 Security

- **API Key Protection**: Your OpenAI API key is kept on the backend only
- **No Client-Side Exposure**: The frontend never sees your API key
- **CORS Protected**: Requests are validated on the backend

### 💰 Pricing

OpenAI uses a pay-per-use model:
- **GPT-4 Turbo**: ~$0.01-0.03 per 1K tokens
- Typical chatbot messages: 50-500 tokens
- Consider setting usage limits in OpenAI dashboard

### 🚀 Deployment

When deploying to production:

1. **Update API URL** in frontend `.env`:
   ```
   REACT_APP_API_URL=https://your-api-domain.com/api
   ```

2. **Set Backend Environment Variables**:
   ```
   OPENAI_API_KEY=your-key
   MONGODB_URI=your-uri
   NODE_ENV=production
   ```

3. **Keep API Keys Secure**:
   - Use environment secrets in your hosting platform
   - Never commit `.env` files to version control
   - Rotate keys regularly

### 📊 Available Chat Commands

- **Create Tasks**: "Add a task to...", "I need to...", "Remind me to..."
- **View Tasks**: "Show my tasks", "What's pending?", "List my todos"
- **Statistics**: "How many tasks?", "What's my progress?", "Show stats"
- **Help**: "Help", "What can you do?", "Commands"
- **Productivity**: "Help me prioritize", "Suggest improvements", "Tips for today"

### 🐛 Troubleshooting

**"OpenAI API key not configured"**
- Check your backend `.env` file
- Ensure `OPENAI_API_KEY` is set correctly
- Restart the backend server

**"Failed to get AI response"**
- Check OpenAI API status: https://status.openai.com
- Verify your API key has credits
- Check backend console for error details

**Chat bubble not appearing**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check console for JavaScript errors

**Slow responses**
- Normal for first request (cold start)
- Check your internet connection
- Verify OpenAI API status

### 📚 Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [GPT-4 Model Info](https://openai.com/gpt-4)
- [API Key Management](https://platform.openai.com/account/api-keys)

### 🎉 You're All Set!

Your TaskFlow app now has powerful AI capabilities! Enjoy enhanced task management with GPT-4.

---

**Questions?** Check the troubleshooting section or refer to OpenAI documentation.
