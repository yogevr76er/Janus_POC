// ========================================
// Janus POC - Backend Server
// ========================================
// זה השרת שמנהל את כל האימותים
// 
// מה השרת עושה:
// 1. מנהל משתמשים (רישום, מחיקה)
// 2. מנהל בקשות אימות
// 3. שומר הכל ב-database
// ========================================

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

// ========================================
// 1. הגדרות בסיסיות
// ========================================

const app = express();
const PORT = 3001;

// Database
const db = new sqlite3.Database('./janus.db', (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Database connected');
  }
});

// Middleware (חלק טכני שמאפשר לשרת לעבוד)
app.use(cors()); // מאפשר גישה מדפדפן
app.use(bodyParser.json()); // מאפשר לקבל JSON
app.use(express.json());

// ========================================
// 2. יצירת טבלאות ב-Database
// ========================================

// טבלת משתמשים
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    credential_id TEXT,
    public_key TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('❌ Error creating users table:', err);
  } else {
    console.log('✅ Users table ready');
  }
});

// טבלת בקשות אימות
db.run(`
  CREATE TABLE IF NOT EXISTS auth_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    transaction_type TEXT,
    amount REAL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`, (err) => {
  if (err) {
    console.error('❌ Error creating auth_requests table:', err);
  } else {
    console.log('✅ Auth requests table ready');
  }
});

// ========================================
// 3. API Endpoints (נקודות הקצה)
// ========================================

// בדיקה שהשרת עובד
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Janus POC Server is running!',
    status: 'OK',
    version: '1.0.0'
  });
});

// רישום משתמש חדש
app.post('/api/users/register', (req, res) => {
  const { name, email, credentialId, publicKey } = req.body;
  
  // בדיקות קלט
  if (!name || !email) {
    return res.status(400).json({ 
      error: 'Name and email are required' 
    });
  }
  
  const userId = uuidv4();
  
  db.run(
    `INSERT INTO users (id, name, email, credential_id, public_key) 
     VALUES (?, ?, ?, ?, ?)`,
    [userId, name, email, credentialId || null, publicKey || null],
    function(err) {
      if (err) {
        console.error('❌ Registration error:', err);
        return res.status(500).json({ 
          error: 'Email already exists or database error' 
        });
      }
      
      console.log(`✅ User registered: ${name} (${email})`);
      res.json({ 
        userId, 
        success: true,
        message: 'User registered successfully'
      });
    }
  );
});

// קבלת כל המשתמשים (לadmin panel)
app.get('/api/users', (req, res) => {
  db.all(
    'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC',
    [],
    (err, rows) => {
      if (err) {
        console.error('❌ Error fetching users:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// קבלת משתמש ספציפי
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  
  db.get(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [userId],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(row);
    }
  );
});

// בקשת אימות חדשה
app.post('/api/auth/request', (req, res) => {
  const { userId, transactionType, amount, description } = req.body;
  
  if (!userId) {
    return res.status(400).json({ 
      error: 'userId is required' 
    });
  }
  
  const requestId = uuidv4();
  
  db.run(
    `INSERT INTO auth_requests 
     (id, user_id, transaction_type, amount, description, status) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [requestId, userId, transactionType, amount, description, 'pending'],
    function(err) {
      if (err) {
        console.error('❌ Auth request error:', err);
        return res.status(500).json({ error: err.message });
      }
      
      console.log(`📋 Auth request created: ${requestId} for user ${userId}`);
      res.json({ 
        requestId, 
        status: 'pending',
        message: 'Authentication request created'
      });
    }
  );
});

// אישור אימות
app.post('/api/auth/approve/:requestId', (req, res) => {
  const { requestId } = req.params;
  
  db.run(
    `UPDATE auth_requests 
     SET status = 'approved', approved_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [requestId],
    function(err) {
      if (err) {
        console.error('❌ Approval error:', err);
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Request not found' });
      }
      
      console.log(`✅ Auth approved: ${requestId}`);
      res.json({ 
        success: true, 
        status: 'approved',
        message: 'Authentication approved'
      });
    }
  );
});

// דחיית אימות
app.post('/api/auth/reject/:requestId', (req, res) => {
  const { requestId } = req.params;
  
  db.run(
    `UPDATE auth_requests 
     SET status = 'rejected', approved_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [requestId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Request not found' });
      }
      
      console.log(`❌ Auth rejected: ${requestId}`);
      res.json({ 
        success: true, 
        status: 'rejected',
        message: 'Authentication rejected'
      });
    }
  );
});

// בדיקת סטטוס אימות
app.get('/api/auth/:requestId/status', (req, res) => {
  const { requestId } = req.params;
  
  db.get(
    'SELECT * FROM auth_requests WHERE id = ?',
    [requestId],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Request not found' });
      }
      res.json(row);
    }
  );
});

// קבלת בקשות ממתינות למשתמש
app.get('/api/auth/pending/:userId', (req, res) => {
  const { userId } = req.params;
  
  db.get(
    `SELECT * FROM auth_requests 
     WHERE user_id = ? AND status = 'pending' 
     ORDER BY created_at DESC LIMIT 1`,
    [userId],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row || { message: 'No pending requests' });
    }
  );
});

// קבלת כל הלוגים (לadmin panel)
app.get('/api/admin/logs', (req, res) => {
  db.all(
    `SELECT ar.*, u.name as user_name, u.email as user_email
     FROM auth_requests ar
     LEFT JOIN users u ON ar.user_id = u.id
     ORDER BY ar.created_at DESC
     LIMIT 100`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// סטטיסטיקות (לadmin panel)
app.get('/api/admin/stats', (req, res) => {
  const stats = {};
  
  // ספירת משתמשים
  db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.totalUsers = row.count;
    
    // ספירת אימותים
    db.get('SELECT COUNT(*) as count FROM auth_requests', [], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.totalAuths = row.count;
      
      // ספירת אימותים מאושרים
      db.get(
        "SELECT COUNT(*) as count FROM auth_requests WHERE status = 'approved'",
        [],
        (err, row) => {
          if (err) return res.status(500).json({ error: err.message });
          stats.approvedAuths = row.count;
          
          // חישוב אחוז הצלחה
          if (stats.totalAuths > 0) {
            stats.successRate = ((stats.approvedAuths / stats.totalAuths) * 100).toFixed(1);
          } else {
            stats.successRate = 0;
          }
          
          res.json(stats);
        }
      );
    });
  });
});

// ========================================
// 4. הפעלת השרת
// ========================================

app.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log('🚀 Janus POC Server');
  console.log('========================================');
  console.log(`📍 Running on: http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/`);
  console.log('========================================');
  console.log('');
});

// ========================================
// 5. טיפול בשגיאות
// ========================================

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err);
    } else {
      console.log('✅ Database closed');
    }
    process.exit(0);
  });
});
