# 📮 Feedback Collector App

A clean and user-friendly feedback collection system built using **React**, **TailwindCSS**, **MockAPI**, **Recharts**, and **Framer Motion**.

---

## 🚀 Features

### 📝 Feedback Submission
- Name, Email, Message, Rating  
- Categories: Bug, Feature, Complaint, Praise  
- Validations  
- Toast notifications  
- Real-time updates  

### 📊 Analytics & Insights
- Category-wise charts  
- Quick stats: total feedback, average rating  
- Search, sort, date filters  
- Download feedback as CSV  

### 🎨 UI & UX
- Beautiful modern design  
- Smooth animations  
- Skeleton loading states  
- Fully responsive 

---

## 📁 Folder Structure

```

src/
components/
  AnalyticsCharts.jsx
  FeedbackCard.jsx
  FeedbackForm.jsx
  FeedbackGrid.jsx
  FilterBar.jsx
  QuickInsights.jsx
  StarRating.jsx
  services/
    feedbackService.js
App.jsx
main.jsx
index.css

````

---

## 🛠️ Tech Stack

- **React + Vite**
- **TailwindCSS**
- **Framer Motion**
- **React Hot Toast**
- **Recharts**
- **MockAPI.io**
- **Vercel Deployment**

---

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies
```bash
npm install
````

### 2️⃣ Start Dev Server

```bash
npm run dev
```

### 3️⃣ Configure Environment Variable

Create `.env`:

```
VITE_API_URL=https://your-mockapi-url/feedbacks
```

---

## 📡 API Endpoints (MockAPI)

* `GET /feedbacks`
* `POST /feedbacks`
* `DELETE /feedbacks/:id`

Your mock schema should include:

```json
{
  "name": "John",
  "email": "john@example.com",
  "message": "Great work!",
  "rating": 5,
  "category": "feature",
  "createdAt": "2025-01-01T10:00:00Z"
}
```

---

## 📦 Build for Production

```bash
npm run build
```

---

## 🚀 Deployment (Vercel)

1. Push project to GitHub
2. Import into Vercel
3. Add environment variable:

```
VITE_API_URL=https://your-mockapi-url/feedbacks
```

4. Deploy 🎉

---

## 👨‍💻 Author

**Sujal Matolia**
Built for interview assignment — clean, modular, and scalable.

---
