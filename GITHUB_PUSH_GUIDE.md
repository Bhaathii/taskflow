# Push TaskFlow to GitHub - Complete Guide

## Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Sign in to your account (create one if you don't have it)
3. Click the **+** icon in the top right corner
4. Select **New repository**
5. Fill in the details:
   - **Repository name**: `taskflow`
   - **Description**: `A modern task management application with Google OAuth, built with React and Node.js`
   - **Public or Private**: Choose based on your preference
   - **Initialize with**: Leave unchecked (we'll push existing code)
6. Click **Create repository**

You'll see a page with commands to push existing code.

---

## Step 2: Initialize Git Locally (If Not Already Done)

Open PowerShell in your project root directory:

```powershell
cd c:\Users\ASUS\Desktop\taskflow
git init
```

---

## Step 3: Add All Files to Git

```powershell
git add .
```

This stages all files in your project for commit.

---

## Step 4: Create Initial Commit

```powershell
git commit -m "Initial commit: TaskFlow application with Google OAuth authentication"
```

---

## Step 5: Add Remote Repository

Replace `YOUR_USERNAME` with your actual GitHub username:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/taskflow.git
```

---

## Step 6: Rename Branch to Main (If Needed)

```powershell
git branch -M main
```

---

## Step 7: Push to GitHub

```powershell
git push -u origin main
```

If prompted for credentials:
- Use your GitHub username
- Use a **Personal Access Token** (not your password)
  - Go to GitHub Settings → Developer Settings → Personal Access Tokens
  - Generate a token with `repo` scope
  - Use this token as your password

---

## Complete Commands (Copy & Paste)

If you want to run all commands at once:

```powershell
cd c:\Users\ASUS\Desktop\taskflow
git init
git add .
git commit -m "Initial commit: TaskFlow application with Google OAuth authentication"
git remote add origin https://github.com/YOUR_USERNAME/taskflow.git
git branch -M main
git push -u origin main
```

---

## Step 8: Verify on GitHub

1. Go to `https://github.com/YOUR_USERNAME/taskflow`
2. You should see all your files uploaded ✅

---

## Important: Create .gitignore (Already Done)

Your `.gitignore` file should exclude:
```
node_modules/
.env
.env.local
build/
dist/
.DS_Store
```

Make sure these are in both:
- `frontend/.gitignore`
- `backend/.gitignore`

---

## What NOT to Push

❌ **Do NOT commit/push:**
- `node_modules/` folders (use npm install to restore)
- `.env` files (contains sensitive data)
- Build artifacts
- `package-lock.json` (optional, but often excluded)

✅ **Do commit:**
- Source code files
- `package.json` (so others can install dependencies)
- Configuration files (except .env)
- `README.md` and documentation

---

## Future Updates

After your first push, to update your repository:

```powershell
git add .
git commit -m "Description of changes"
git push
```

---

## Troubleshooting

**Error: "fatal: not a git repository"**
- Make sure you ran `git init` in the correct directory

**Error: "failed to push some refs"**
- Make sure you have the correct remote URL
- Check: `git remote -v`

**Error: "Authentication failed"**
- Use Personal Access Token instead of GitHub password
- Generate at: GitHub Settings → Developer Settings → Personal Access Tokens

**Error: "node_modules uploaded"**
- You forgot to add .gitignore before committing
- To fix:
  ```powershell
  git rm -r --cached node_modules
  git commit -m "Remove node_modules from tracking"
  git push
  ```

---

## Viewing Your Repository

Once pushed successfully, you can:
1. Share the URL: `https://github.com/YOUR_USERNAME/taskflow`
2. Clone it elsewhere: `git clone https://github.com/YOUR_USERNAME/taskflow.git`
3. Collaborate with others by inviting them as collaborators

