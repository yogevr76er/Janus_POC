# 📱 Janus User App

Progressive Web App for biometric authentication

---

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# App runs at: http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repo
4. Deploy!

**Environment Variables (Optional):**
- None needed - API URL is hardcoded for now

---

## 📱 Features

✅ **Onboarding Flow**
- User registration
- WebAuthn biometric setup
- Beautiful step-by-step UI

✅ **Dashboard**
- User status
- Waiting for auth requests
- Logout

✅ **Authentication**
- Real-time auth request notifications
- Approve/Reject with biometric
- Transaction details display

✅ **PWA Ready**
- Can be installed on home screen
- Works offline (coming soon)
- Fast and responsive

---

## 🎨 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool (super fast!)
- **Tailwind CSS** - Styling
- **WebAuthn API** - Biometric authentication

---

## 📁 Structure

```
src/
├── components/
│   ├── Onboarding.jsx    - User registration
│   ├── Dashboard.jsx     - Main screen
│   └── AuthRequest.jsx   - Auth approval
├── App.jsx               - Main app logic
├── main.jsx              - Entry point
└── index.css             - Tailwind styles
```

---

## 🔧 Configuration

### Change API URL

In `src/App.jsx`, line 6:
```javascript
const API_URL = 'https://your-server.onrender.com/api'
```

---

## 🧪 How to Test

1. **Register a new user:**
   - Enter name + email
   - Setup biometric (Face ID / Fingerprint)

2. **Trigger an auth request:**
   - Use Postman or curl:
   ```bash
   curl -X POST https://your-server.onrender.com/api/auth/request \
     -H "Content-Type: application/json" \
     -d '{"userId":"[your-user-id]","transactionType":"payment","amount":100,"description":"Test payment"}'
   ```

3. **Approve in the app:**
   - App will show the request
   - Click Approve
   - Done!

---

## 🌟 Next Steps

- [ ] Offline support (Service Worker)
- [ ] Push notifications
- [ ] Multiple device support
- [ ] Better error handling
- [ ] Accessibility improvements

---

**Built with ❤️ for the Janus POC**
