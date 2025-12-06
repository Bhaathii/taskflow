# Quick Start: Push to GitHub

## Before You Start

1. Create a GitHub account at https://github.com (if you don't have one)
2. Create a new repository named "taskflow" (don't initialize with any files)

---

## Step-by-Step Commands

Copy and paste these commands one by one into PowerShell:

### 1. Navigate to your project
```powershell
cd c:\Users\ASUS\Desktop\taskflow
```

### 2. Initialize Git
```powershell
git init
```

### 3. Add all files
```powershell
git add .
```

### 4. Create initial commit
```powershell
git commit -m "Initial commit: TaskFlow task management app with Google OAuth"
```

### 5. Add remote repository (Replace YOUR_USERNAME with your GitHub username)
```powershell
git remote add origin https://github.com/YOUR_USERNAME/taskflow.git
```

### 6. Rename branch to main
```powershell
git branch -M main
```

### 7. Push to GitHub
```powershell
git push -u origin main
```

---

## If Git is Not Installed

If you get an error "git is not recognized", you need to install Git:
1. Download from https://git-scm.com/download/win
2. Install with default settings
3. Restart PowerShell
4. Try again

---

## Authentication

When pushing, you might be prompted for credentials:

**Option 1: GitHub CLI (Recommended)**
- Install: https://cli.github.com/
- Run: `gh auth login`
- Choose HTTPS and authenticate in browser
- Then use git commands

**Option 2: Personal Access Token**
- Go to GitHub Settings → Developer Settings → Personal Access Tokens
- Click "Generate new token (classic)"
- Check "repo" scope
- Click "Generate token"
- Copy the token
- When prompted for password, paste the token instead

**Option 3: SSH (Advanced)**
- Generate SSH key: `ssh-keygen -t rsa -b 4096`
- Add to GitHub account
- Use: `git remote add origin git@github.com:YOUR_USERNAME/taskflow.git`

---

## Verify Success

1. Go to https://github.com/YOUR_USERNAME/taskflow
2. You should see all your files
3. Done! ✅

---

## Common Issues & Solutions

### "fatal: not a git repository"
- Make sure you're in the correct directory
- Run: `git init`

### "fatal: The current branch main has no upstream branch"
- Run: `git push -u origin main`

### "error: pathspec 'test-api.js' did not match any files"
- The .gitignore is excluding test-api.js (this is okay)
- Continue with the push

### "Everything up-to-date"
- This is fine - all files are already pushed

### "Please tell me who you are"
```powershell
git config --global user.email "your.email@example.com"
git config --global user.name "Your Name"
```
Then run the commit command again.

---

## View Your Project on GitHub

Once pushed successfully:
- URL: `https://github.com/YOUR_USERNAME/taskflow`
- Share this link with others
- Others can clone it: `git clone https://github.com/YOUR_USERNAME/taskflow.git`

