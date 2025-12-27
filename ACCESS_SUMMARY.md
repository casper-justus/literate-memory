# 🔐 Complete Access Information

## Summary

Your LocalTunnel password (IP Endpoint) is: **`10.16.40.107`**

---

## 🌐 Public URL Access

### URL
```
https://floppy-aliens-battle.loca.lt
```

(Note: If tunnel needs to be restarted, the URL will change. Check `localtunnel.log` for the new URL)

### Password/IP Endpoint
```
10.16.40.107
```

---

## 📋 When You Need the Password

| Scenario | Password Needed? | Instructions |
|----------|------------------|--------------|
| **Web Browser (First Time)** | ✅ YES | Enter: `10.16.40.107` |
| **cURL / API Requests** | ❌ NO | Just use the URL |
| **React Native App** | ❌ NO | Just enter the URL |
| **Postman / API Testing** | ❌ NO | No password required |
| **Browser (After First Visit)** | ❌ NO | Browser remembers it |

---

## 🌐 Browser Access

### Step 1: Open URL
```
https://floppy-aliens-battle.loca.lt
```

### Step 2: Enter Password
When you see the LocalTunnel landing page asking for "IP Endpoint":
```
Enter: 10.16.40.107
```

### Step 3: Click Continue
You'll then see your API documentation.

**Note**: Your browser will remember this, so you only need to do it once!

---

## 📱 React Native App Configuration

**Good news**: Your app doesn't need the password!

### Configuration Steps:

1. Start your app: `npm start`
2. Open Settings tab (⚙️)
3. Enable "Use Backend API (yt-dlp)"
4. Enter Backend URL:
   ```
   https://floppy-aliens-battle.loca.lt/api/music
   ```
5. Check status shows "Online" (green)
6. Go to Search and play music!

---

## 🧪 Testing Without Password

All these work without any password:

```bash
# Health check
curl https://floppy-aliens-battle.loca.lt/api/music/health

# Search
curl "https://floppy-aliens-battle.loca.lt/api/music/search?query=music&limit=5"

# Video info
curl https://floppy-aliens-battle.loca.lt/api/music/video/jfKfPfyJRdk
```

---

## 🔧 Manage LocalTunnel

### Check if Tunnel is Running
```bash
ps aux | grep "lt --port"
```

### View Current URL
```bash
cat /home/engine/project/localtunnel.log
```

### Restart Tunnel (if needed)
```bash
pkill -f "lt --port 3000"
cd /home/engine/project
lt --port 3000 > localtunnel.log 2>&1 &
sleep 3
cat localtunnel.log
```

**Note**: After restart, you'll get a NEW URL. Update your app with the new URL.

---

## 📊 Complete Setup Status

### Backend Server
- ✅ Running on port 3000
- ✅ Accessible locally at `http://localhost:3000`

### Tunnel
- ⚠️ May need restart (connectivity issues)
- Current URL: `https://floppy-aliens-battle.loca.lt`
- Password: `10.16.40.107`

### Configuration
- IP Endpoint: `10.16.40.107`
- Local Port: `3000`
- Protocol: HTTPS

---

## 🎯 Quick Reference

**URL**: `https://floppy-aliens-battle.loca.lt`

**Password**: `10.16.40.107`

**When needed**: Only for web browser on first visit

**For React Native app**: Just use the URL, no password setup needed

---

## 🆘 Troubleshooting

### "Can't access in browser"
1. Open: https://floppy-aliens-battle.loca.lt
2. Enter IP: `10.16.40.107`
3. Click Continue

### "App can't connect"
1. Check tunnel is running: `ps aux | grep "lt --port"`
2. If not running, restart it
3. Get new URL from `localtunnel.log`
4. Update app settings with new URL

### "Get HTML instead of JSON"
You're probably hitting the landing page. Try:
```bash
curl -H "Bypass-Tunnel-Reminder: true" https://floppy-aliens-battle.loca.lt/api/music/health
```

---

## 🌟 Important Notes

1. **Password is only for browser**: Your React Native app doesn't need it
2. **URL can change**: If you restart the tunnel, you'll get a new URL
3. **First visit only**: Browser remembers the password after first time
4. **API requests work directly**: No password prompt for API calls

---

## 📚 Related Documentation

- `TUNNEL_PASSWORD.txt` - Quick reference card
- `TUNNEL_ACCESS_INFO.md` - Detailed access guide
- `PUBLIC_URL_INFO.md` - Public URL documentation
- `QUICK_START.md` - Quick start guide

---

**You're all set! Use password `10.16.40.107` for browser access only.** 🎉
