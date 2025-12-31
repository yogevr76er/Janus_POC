# 🚀 מדריך פריסה - GitHub → Vercel/Render

## מה נעשה:
1. נעלה את הקוד ל-GitHub (גיבוי + שיתוף)
2. נפרוס את השרת ל-Render (חינם!)
3. נפרוס את הFrontend ל-Vercel (חינם!)

---

## 📋 חלק 1: העלאה ל-GitHub

### צעד 1: צור חשבון GitHub (אם אין לך)

1. לך ל: https://github.com
2. לחץ "Sign up"
3. מלא פרטים
4. אמת דוא"ל
5. בחר Free plan

---

### צעד 2: צור Repository חדש

1. לחץ על "+" בפינה ימינית עליונה
2. בחר "New repository"
3. **שם:** `janus-poc`
4. **תיאור:** "Janus Authentication POC - WebAuthn demo"
5. **Public** או **Private** (בחר Private אם לא רוצה שאחרים יראו)
6. **לא** לסמן "Initialize with README" (יש לנו כבר!)
7. לחץ "Create repository"

---

### צעד 3: העלה את הקוד (במחשב שלך)

**פתח Terminal בתיקיית הפרויקט שלך:**

```bash
# 1. אתחל Git (פעם אחת)
git init

# 2. הוסף את כל הקבצים
git add .

# 3. צור commit ראשון
git commit -m "Initial commit - Janus POC server"

# 4. חבר ל-GitHub (החלף [username] בשם המשתמש שלך!)
git remote add origin https://github.com/[username]/janus-poc.git

# 5. העלה!
git push -u origin main
```

**אם Git שואל שם משתמש וסיסמה:**
- Username: השם משתמש שלך ב-GitHub
- Password: **לא הסיסמה שלך!** צריך Personal Access Token

**איך ליצור Token:**
1. GitHub → Settings (בפינה ימנית) → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. בחר: `repo` (full control)
5. Generate token
6. **העתק את הטוקן!** (תראה אותו פעם אחת בלבד!)
7. השתמש בטוקן במקום סיסמה

---

### צעד 4: בדוק שעבד

1. לך ל: https://github.com/[username]/janus-poc
2. אמור לראות את כל הקבצים!

**מזל טוב! הקוד שלך ב-GitHub! 🎉**

---

## 🌐 חלק 2: פריסת השרת (Render.com)

### צעד 1: צור חשבון Render

1. לך ל: https://render.com
2. לחץ "Get Started"
3. התחבר עם GitHub (מומלץ)
4. אשר גישה

---

### צעד 2: צור Web Service חדש

1. Dashboard → "New +" → "Web Service"
2. חבר את הGitHub repo שלך: `janus-poc`
3. אשר גישה
4. Render יראה את הrepo שלך

---

### צעד 3: הגדר את השרת

**הגדרות:**

- **Name:** `janus-poc-server`
- **Region:** Oregon (או הכי קרוב אליך)
- **Branch:** `main`
- **Root Directory:** `server` (חשוב!)
- **Runtime:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Instance Type:** Free

**Environment Variables:**
(לעכשיו אין, נוסיף בהמשך)

לחץ **"Create Web Service"**

---

### צעד 4: המתן לפריסה

Render יתחיל לבנות:
1. Clone מGitHub
2. Install dependencies
3. Start server

**זה לוקח 2-3 דקות.**

אתה תראה לוגים בזמן אמת.

---

### צעד 5: בדוק שעובד!

כש-Deploy מסתיים, תקבל URL:
```
https://janus-poc-server.onrender.com
```

לך לURL → אמור לראות:
```json
{
  "message": "🚀 Janus POC Server is running!",
  "status": "OK"
}
```

**אם רואה את זה - השרת שלך באינטרנט! 🌍🎉**

---

## ⚠️ דבר חשוב על Render Free Tier

**Render Free מכבה את השרת אחרי 15 דקות של חוסר שימוש.**

כשמישהו ניגש אליו - הוא מתעורר (cold start) - לוקח 30-60 שניות.

**פתרונות:**
1. זה OK ל-demo/POC
2. אם רוצה שיהיה תמיד ער → צריך לשלם ($7/חודש)
3. או: להשתמש ב-Railway/Fly.io (חלופות)

---

## 🎨 חלק 3: פריסת Frontend (Vercel) - בהמשך

**כשנבנה את הUser App, נעשה:**

1. Push ל-GitHub
2. Vercel → New Project
3. Import מGitHub
4. Deploy!

**Vercel זה מהיר וחינם לחלוטין.**

---

## 🔄 עדכונים אוטומטיים

**הקסם של GitHub + Render/Vercel:**

```
אתה משנה קוד
    ↓
git add .
git commit -m "הוספתי feature X"
git push
    ↓
GitHub מעדכן
    ↓
Render/Vercel רואים את השינוי
    ↓
Deploy אוטומטי!
    ↓
הקוד החדש באינטרנט תוך 2-3 דקות
```

**לא צריך לעשות כלום ידנית!**

---

## 📊 מה יש לנו עכשיו:

✅ **Local:** Server רץ על המחשב שלך  
✅ **GitHub:** Backup + version control  
✅ **Render:** Server חי באינטרנט  

**הצעד הבא:**
נבנה את הUser App ואת הAdmin Panel!

---

## 💡 טיפים

### איך לעדכן את השרת:

```bash
# 1. עשה שינויים בקוד
# 2. שמור (Ctrl+S)
# 3. העלה ל-GitHub:

git add .
git commit -m "תיאור השינוי"
git push

# 4. Render יעדכן אוטומטית!
```

### איך לראות לוגים:

Render Dashboard → janus-poc-server → Logs

שם תראה את כל הפעילות.

### איך לשנות הגדרות:

Render Dashboard → janus-poc-server → Settings

---

## ❓ שאלות נפוצות

**ש: כמה זה עולה?**
ת: Render Free = $0, Vercel Free = $0

**ש: מה קורה אם עוברים את המכסה החינמית?**
ת: Render: 750 שעות/חודש (מספיק ל-POC)
   Vercel: unlimited (לפרויקטים קטנים)

**ש: האם הנתונים נשמרים?**
ת: ב-Render Free, ה-database נמחק כשהשרת מתעדכן.
   בהמשך נעבור ל-PostgreSQL external.

**ש: מה אם אני רוצה שהשרת יהיה תמיד ער?**
ת: שלם $7/חודש ל-Render, או השתמש בRailway.

---

**מוכן לעשות את זה?** 🚀
