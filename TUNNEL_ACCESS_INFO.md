# LocalTunnel Access Information

## 🔐 Tunnel Password & Access Details

### Your LocalTunnel URL
```
https://floppy-aliens-battle.loca.lt
```

### Password Information

When accessing the URL in a **web browser**, LocalTunnel may show a landing page asking for an "IP Endpoint". This is the password.

**Your Tunnel Password (IP Endpoint):**
```
10.16.40.107
```

---

## 🌐 How to Access

### Option 1: Browser Access (First Time)

1. Open your browser
2. Go to: `https://floppy-aliens-battle.loca.lt`
3. You'll see a LocalTunnel landing page
4. Enter the IP endpoint: `10.16.40.107`
5. Click "Continue" or "Submit"
6. You'll then see your API documentation page

**After the first time**, the browser should remember this and not ask again.

### Option 2: Direct API Access (No Password Needed)

For **API requests** (from your React Native app, curl, Postman), you **don't need a password**. Just use the URL directly:

```bash
# This works without password
curl https://floppy-aliens-battle.loca.lt/api/music/health
```

### Option 3: Bypass Landing Page

Add a header to bypass the landing page:

```bash
curl -H "Bypass-Tunnel-Reminder: true" https://floppy-aliens-battle.loca.lt/api/music/health
```

---

## 📱 For React Native App

**Good News**: Your React Native app **does NOT need** the password!

Just set the backend URL in your app's Settings to:
```
https://floppy-aliens-battle.loca.lt/api/music
```

The app will make API requests directly and won't encounter the landing page.

---

## 🧪 Testing

### Test 1: Browser
1. Open: https://floppy-aliens-battle.loca.lt
2. Enter password: `10.16.40.107`
3. You should see the API documentation

### Test 2: cURL (No Password)
```bash
curl https://floppy-aliens-battle.loca.lt/api/music/health
```

### Test 3: Health Check
```bash
curl -s https://floppy-aliens-battle.loca.lt/api/music/health | python3 -m json.tool
```

Expected response:
```json
{
  "status": "ok",
  "ytdlp": {
    "installed": false,
    "version": null
  },
  "timestamp": "2025-12-13T..."
}
```

---

## 🔑 Quick Reference

| Access Method | Password Needed? | Password/IP |
|---------------|------------------|-------------|
| Web Browser (First Time) | ✅ Yes | `10.16.40.107` |
| API Requests (curl, app) | ❌ No | Not needed |
| React Native App | ❌ No | Not needed |
| After First Browser Visit | ❌ No | Remembered |

---

## 📋 Configuration Summary

### Backend Server
- **Local URL**: http://localhost:3000
- **Public URL**: https://floppy-aliens-battle.loca.lt
- **Status**: Running

### Tunnel Information
- **Type**: LocalTunnel
- **IP Endpoint**: 10.16.40.107
- **Port**: 3000
- **Protocol**: HTTPS

---

## 🎯 For Your React Native App

### Step-by-Step Configuration

1. **Start your React Native app**:
   ```bash
   npm start
   ```

2. **Open the app** on your device/emulator

3. **Go to Settings** tab (⚙️ icon)

4. **Enable Backend API**:
   - Toggle "Use Backend API (yt-dlp)" to ON

5. **Set Backend URL** (no password needed):
   ```
   https://floppy-aliens-battle.loca.lt/api/music
   ```

6. **Verify Connection**:
   - Check that status shows "Online" (green badge)
   - If it shows offline, check tunnel is running

7. **Start Using**:
   - Go to Search tab
   - Search for music
   - Play and enjoy!

---

## 🔧 Troubleshooting

### Issue: Browser keeps asking for password

**Solution**: 
- Clear browser cookies/cache
- Try incognito/private mode
- Or just enter `10.16.40.107` each time

### Issue: API requests get HTML instead of JSON

**Cause**: You're hitting the landing page

**Solution**:
```bash
# Add bypass header
curl -H "Bypass-Tunnel-Reminder: true" https://floppy-aliens-battle.loca.lt/api/music/health
```

Or update your app to add this header (usually not needed).

### Issue: "Invalid IP endpoint"

**Solution**:
- Make sure you're entering: `10.16.40.107`
- No spaces, no http://, just the IP

### Issue: Can't access at all

**Check tunnel is running**:
```bash
ps aux | grep "lt --port"
```

**Restart tunnel if needed**:
```bash
pkill -f "lt --port 3000"
lt --port 3000 > localtunnel.log 2>&1 &
sleep 3
cat localtunnel.log
```

---

## 🌟 Pro Tips

### Tip 1: Skip Landing Page in Browser
Add this to your browser's address bar after the first visit:
```
https://floppy-aliens-battle.loca.lt/api/music/health
```

### Tip 2: Use API Testing Tools
Tools like Postman, Insomnia don't need the password - they work directly.

### Tip 3: Mobile App Development
Your React Native app bypasses the landing page automatically when making HTTP requests.

### Tip 4: Remember the Password
Bookmark this page or save:
- URL: `https://floppy-aliens-battle.loca.lt`
- Password: `10.16.40.107`

---

## 📱 Mobile Device Configuration

### For Android Device (Physical)
```
Backend URL: https://floppy-aliens-battle.loca.lt/api/music
```
✅ Works from anywhere with internet
✅ No password configuration needed in app
✅ Just enter the URL

### For Android Emulator
```
Backend URL: https://floppy-aliens-battle.loca.lt/api/music
```
✅ Same URL works

### For iOS Simulator/Device
```
Backend URL: https://floppy-aliens-battle.loca.lt/api/music
```
✅ Same URL works everywhere

---

## 🎉 Summary

**Tunnel Password (IP Endpoint)**: `10.16.40.107`

**When You Need It**:
- ✅ First time accessing in web browser
- ❌ NOT needed for API requests
- ❌ NOT needed in React Native app
- ❌ NOT needed after first browser visit

**Your Public API URL**:
```
https://floppy-aliens-battle.loca.lt/api/music
```

Just use this URL in your app settings - no password configuration needed!

---

## 📚 Related Documentation

- `PUBLIC_URL_INFO.md` - Complete public URL guide
- `QUICK_START.md` - Quick start guide
- `NGROK_SETUP.md` - Setup details

---

**You're all set! Use the password `10.16.40.107` if prompted in browser, but your app doesn't need it!** 🎵
