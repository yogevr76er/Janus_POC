# 🔐 Janus POC - Authentication Platform

**Device-bound biometric authentication** replacing SMS OTP

---

## 🎯 What is this?

Janus is a proof-of-concept authentication platform that uses **WebAuthn** (biometric authentication) instead of SMS codes.

**Key Features:**
- ✅ 2-second authentication (vs 30-60 seconds for SMS)
- ✅ Device-bound cryptographic keys
- ✅ Impossible to phish or SIM-swap
- ✅ Works offline
- ✅ No SMS costs

---

## 📁 Project Structure

```
janus-poc-full/
├── server/          Backend API (Node.js + Express + SQLite)
├── user-app/        User authentication app (React - Coming soon)
├── admin-panel/     Admin dashboard (React - Coming soon)
└── docs/           Documentation
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org))
- npm (comes with Node.js)

### Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/[your-username]/janus-poc.git
cd janus-poc

# 2. Install server dependencies
cd server
npm install

# 3. Start the server
npm start

# Server runs at: http://localhost:3001
```

---

## 🌐 Deploy to Production

### Backend (Render/Railway)
1. Push to GitHub
2. Connect Render.com to your repo
3. Deploy automatically!

### Frontend (Vercel)
1. Push to GitHub
2. Connect Vercel to your repo
3. Deploy automatically!

---

## 📊 Current Status

- ✅ **Server**: Fully functional API
- 🚧 **User App**: In development
- 🚧 **Admin Panel**: In development

---

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- SQLite (development) → PostgreSQL (production)
- WebAuthn API

**Frontend:**
- React
- Tailwind CSS
- WebAuthn Client

---

## 📖 API Endpoints

### Health Check
```
GET /
```

### User Management
```
POST /api/users/register    - Register new user
GET  /api/users             - List all users
GET  /api/users/:id         - Get user details
```

### Authentication
```
POST /api/auth/request      - Request authentication
POST /api/auth/approve/:id  - Approve request
POST /api/auth/reject/:id   - Reject request
GET  /api/auth/:id/status   - Check status
```

### Admin
```
GET /api/admin/stats        - System statistics
GET /api/admin/logs         - Authentication logs
```

---

## 📝 License

MIT

---

## 👥 Team

Built by Yogev with ❤️

---

## 🔗 Links

- [Documentation](./docs)
- [Live Demo](https://janus-demo.vercel.app) (Coming soon)
- [API Docs](./docs/api.md) (Coming soon)

---

**Status:** 🚧 POC in Development
**Last Updated:** December 31, 2025
