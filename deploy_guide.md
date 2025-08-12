# Deploy Hospital System to Web

## Option 1: Netlify (Frontend Only - Easiest)

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to netlify.com
   - Drag & drop the `build` folder
   - Get instant URL: `https://your-app.netlify.app`

## Option 2: Vercel (Full Stack)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   - Follow prompts
   - Get URL: `https://your-app.vercel.app`

## Option 3: Heroku (Backend + Frontend)

1. **Create files:**
   - `Procfile`: `web: python hospital_system.py`
   - `runtime.txt`: `python-3.11.0`

2. **Deploy:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   heroku create your-hospital-app
   git push heroku main
   ```

## Option 4: Railway (Recommended)

1. **Go to railway.app**
2. **Connect GitHub repo**
3. **Auto-deploy both frontend & backend**
4. **Get URL: `https://your-app.railway.app`**

## Quick Demo (No Backend)

The app works with mock data even without backend!
Just deploy the frontend to Netlify for instant demo.

## Live Demo URLs

After deployment, you'll get:
- **Frontend**: `https://hospital-system.netlify.app`
- **API**: `https://hospital-api.railway.app`
- **Full App**: `https://hospital-app.vercel.app`

## Next Steps

1. Choose deployment option
2. Update API_BASE URL in App.js
3. Share the live link!