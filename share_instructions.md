# How to Share Your Hospital Application

## Option 1: Local Network Sharing (Same WiFi)

1. **Find your IP address:**
   ```cmd
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. **Start servers:**
   ```bash
   python hospital_system.py
   set PORT=3001 && npm start
   ```

3. **Share these links:**
   - Frontend: `http://YOUR_IP:3001` (e.g., http://192.168.1.100:3001)
   - API: `http://YOUR_IP:5000` (e.g., http://192.168.1.100:5000)

## Option 2: Online Deployment (Free)

### Deploy to Netlify (Frontend):
1. Build: `npm run build`
2. Upload `build` folder to netlify.com
3. Get link like: `https://your-app.netlify.app`

### Deploy to Railway/Render (Backend):
1. Push code to GitHub
2. Connect to railway.app or render.com
3. Get API link like: `https://your-api.railway.app`

## Option 3: Tunneling (Instant)

### Using ngrok:
1. Download ngrok.com
2. Run: `ngrok http 3001`
3. Get public URL: `https://abc123.ngrok.io`

## Quick Demo Link

Create a simple demo page that others can access immediately:
- Upload to GitHub Pages
- Use CodePen/JSFiddle for frontend demo
- Mock API data for demonstration

## Security Note
- Local network sharing is safe for demos
- For production, use proper authentication
- Don't expose real patient data