# GitHub Pages Deployment Guide

This guide will help you deploy your Taekwondo Quiz app to GitHub Pages.

## Prerequisites

1. GitHub account
2. Git repository created on GitHub
3. Local repository connected to GitHub remote

---

## Step 1: Create GitHub Repository

If you haven't already:

1. Go to https://github.com/new
2. Create a new repository (name it whatever you like, e.g., "Teori")
3. **Important**: Note your repository name - you'll need it!

---

## Step 2: Configure Base Path (if needed)

If your repository name is **NOT** "Teori", update `vite.config.js`:

```js
// Change this line:
base: process.env.NODE_ENV === 'production' ? '/Teori/' : '/',

// To match your repo name (with slashes):
base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
```

---

## Step 3: Connect Local Repository to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push your code
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to GitHub Pages

Simply run:

```bash
npm run deploy
```

This will:
1. Build your app (`npm run build`)
2. Create a `gh-pages` branch
3. Push the built files to GitHub Pages

---

## Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. Click **Pages** (in the left sidebar)
4. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click **Save**

---

## Step 6: Access Your Site

After a few minutes, your app will be live at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

For example:
```
https://johndoe.github.io/Teori/
```

---

## Updating Your Site

Whenever you make changes:

```bash
# 1. Commit your changes
git add .
git commit -m "your message"
git push

# 2. Deploy to GitHub Pages
npm run deploy
```

---

## Using a Custom Domain (Optional)

If you want to use your own domain (e.g., `taekwondo-quiz.com`):

1. Update `vite.config.js`:
   ```js
   base: '/', // Change back to root
   ```

2. In your GitHub repository:
   - Settings → Pages → Custom domain
   - Enter your domain
   - Follow GitHub's DNS configuration instructions

3. Redeploy:
   ```bash
   npm run deploy
   ```

---

## Troubleshooting

### Issue: Page shows 404
- Check that `gh-pages` branch exists
- Verify GitHub Pages is enabled in Settings
- Wait a few minutes for deployment to complete

### Issue: Assets not loading (blank page)
- Check the base path in `vite.config.js` matches your repo name
- Check browser console for errors

### Issue: Changes not appearing
- Make sure you ran `npm run deploy` (not just `git push`)
- Clear browser cache or open in incognito mode

---

## Commands Reference

```bash
npm run dev        # Run development server
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run deploy     # Deploy to GitHub Pages
```

---

**Need help?** Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
