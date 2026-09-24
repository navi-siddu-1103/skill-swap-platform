# 🔄 Skill Swap Platform

<div align="center">

![Skill Swap](https://img.shields.io/badge/Skill_Swap-Platform-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=springboot)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-green?style=for-the-badge)

**Connect, learn, and grow — one skill at a time.**  
A full-stack peer-to-peer skill exchange platform where users teach what they know and learn what they don't.

[🚀 Live Demo](#deployment) · [📋 Features](#-features) · [🛠️ Setup](#-local-setup) · [📡 API Docs](#-api-endpoints)

</div>

---

## ✨ Features

| Feature | Status | Description |
|---------|--------|-------------|
| 🔐 Auth (Register / Login) | ✅ Live | BCrypt password hashing, localStorage session |
| 👤 Profile & Skill Management | ✅ Live | Add/remove skills tagged as Teach or Learn |
| 🔍 Find Partners | ✅ Live | Search users by skill and type |
| 🤝 Swap Requests | ✅ Live | Send, accept, reject skill exchange proposals |
| 💬 Live Chat | ✅ Live | Real-time STOMP/WebSocket messaging with inbox |
| 🔍 Discover Community | 🔜 Planned | Browse rich community profile cards |
| 📅 Schedule Sessions | 🔜 Planned | Calendar-based session scheduling |
| 🎥 Secure Video Calls | 🔜 Planned | WebRTC / Jitsi video exchanges |

---

## 🏗️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| React Router | v7 | Client-side routing |
| Axios | 1.x | HTTP API client |
| @stomp/stompjs | latest | WebSocket STOMP client |
| SockJS-client | latest | WebSocket transport fallback |
| Tailwind CSS | 3.x | Utility-first styling |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 25 | Language |
| Spring Boot | 3.5 | Application framework |
| Spring WebSocket | 3.5 | Real-time STOMP messaging |
| Spring Security | 3.5 | Auth & password encoding |
| Spring Data JPA | 3.5 | ORM / database access |
| Hibernate | 6.x | JPA implementation |
| MySQL | 8.0 | Primary database |
| Lombok | 1.18 | Boilerplate reduction |

---

## 📁 Project Structure

```
skill-swap-platform/
├── skill-swap-frontend/          # React application
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── axios.js          # Axios base config → localhost:9091
│       ├── components/
│       │   └── ChatWindow.js     # Floating real-time chat component
│       ├── context/
│       │   └── AuthContext.js    # Global auth state
│       ├── pages/
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── Dashboard.js
│       │   ├── Profile.js
│       │   ├── SkillSearch.js    # Find Partners + Chat button
│       │   ├── MySwaps.js
│       │   └── UserProfile.js
│       └── App.js                # Routes + Navbar + Inbox popup
│
├── skill-swap-backend/           # Spring Boot application
│   └── src/main/java/com/example/skillswap/
│       ├── config/
│       │   ├── SecurityConfig.java
│       │   ├── WebConfig.java    # CORS config
│       │   └── WebSocketConfig.java  # STOMP + SockJS setup
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── ChatController.java   # WebSocket + chat REST APIs
│       │   ├── SearchController.java
│       │   ├── SkillController.java
│       │   └── SkillSwapController.java
│       ├── model/
│       │   ├── User.java
│       │   ├── Skill.java
│       │   ├── SkillSwapRequest.java
│       │   ├── ChatMessage.java  # chat_messages table
│       │   └── UserPrincipal.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── SkillRepository.java
│       │   ├── SkillSwapRequestRepository.java
│       │   └── ChatMessageRepository.java
│       └── service/
│           ├── UserService.java
│           ├── SkillService.java
│           ├── SkillSwapService.java
│           └── ChatService.java  # Conversations, unread count, inbox
│
├── .gitignore
└── README.md
```

---

## 🛠️ Local Setup

### Prerequisites
- Java 17+ (project uses Java 25)
- Node.js 18+ and npm
- MySQL 8.0 running locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/navi-siddu-1103/skill-swap-platform.git
cd skill-swap-platform
```

### 2️⃣ Database Setup
```sql
-- Run in MySQL
CREATE DATABASE skill_swap_db;
```

### 3️⃣ Backend Setup
```bash
cd skill-swap-backend
```

Edit `src/main/resources/application.properties`:
```properties
server.port=9091
spring.datasource.url=jdbc:mysql://localhost:3306/skill_swap_db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jackson.serialization.write-dates-as-timestamps=false
```

Run the backend:
```bash
# Using Maven Wrapper (no Maven installation needed)
./mvnw spring-boot:run       # Linux / Mac
.\mvnw.cmd spring-boot:run   # Windows
```
> Backend starts at **http://localhost:9091**

### 4️⃣ Frontend Setup
```bash
cd skill-swap-frontend
npm install
npm start
```
> Frontend starts at **http://localhost:3000**

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns userId, username, role) |

### Skills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/skills/{userId}` | Get user's skills |
| POST | `/api/skills` | Add a skill |
| DELETE | `/api/skills/{id}` | Remove a skill |

### Search & Swaps
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?skill=X&type=teach` | Find matching users |
| POST | `/api/swaps/request` | Send swap request |
| GET | `/api/swaps/incoming/{userId}` | Get incoming requests |
| GET | `/api/swaps/outgoing/{userId}` | Get outgoing requests |
| PUT | `/api/swaps/{id}/accept` | Accept a swap |
| PUT | `/api/swaps/{id}/reject` | Reject a swap |

### Chat (REST + WebSocket)
| Method | Endpoint | Description |
|--------|----------|-------------|
| WS | `ws://localhost:9091/ws` | STOMP WebSocket endpoint |
| STOMP | `/app/chat.send` | Send a message |
| STOMP | `/user/queue/messages` | Subscribe to incoming messages |
| GET | `/api/chat/history/{userId1}/{userId2}` | Conversation history |
| GET | `/api/chat/conversations/{userId}` | Inbox with unread counts |
| GET | `/api/chat/unread/count/{userId}` | Unread message count |
| POST | `/api/chat/read/{senderId}/{receiverId}` | Mark messages as read |

---

## 🚀 Deployment

### ⚡ Recommended Stack (Free Tier)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   FRONTEND      │────▶│    BACKEND      │────▶│   DATABASE      │
│                 │     │                 │     │                 │
│   Vercel        │     │   Railway       │     │   Railway       │
│   (React SPA)   │     │  (Spring Boot)  │     │   (MySQL 8)     │
│   FREE ✅       │     │   FREE ✅       │     │   FREE ✅       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

### 🌐 Frontend → Vercel (Best Choice ✅)

Vercel is **perfect** for React SPAs — zero configuration, auto-deploy on push.

1. Go to [vercel.com](https://vercel.com) → Import your GitHub repo
2. Set **Root Directory** to `skill-swap-frontend`
3. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-railway-backend.up.railway.app/api
   ```
4. Deploy → get a `https://skill-swap-xxx.vercel.app` URL

Update `src/api/axios.js` before deploying:
```js
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:9091/api',
});
```

> ⚠️ **Why NOT Vercel for backend?** Vercel runs **serverless functions only** — no persistent JVM, no long-running processes, and **no WebSocket support**. Spring Boot needs a real server.

---

### ☁️ Backend → Railway (Best Choice ✅)

[Railway](https://railway.app) supports Java Spring Boot natively with WebSocket — **free \$5 credit/month**.

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select `skill-swap-backend` as the root
3. Add a **MySQL** database plugin in Railway
4. Set environment variables:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://your-railway-mysql-host:port/railway
   SPRING_DATASOURCE_USERNAME=root
   SPRING_DATASOURCE_PASSWORD=<railway-generated>
   SERVER_PORT=8080
   ```
5. Railway auto-detects `pom.xml` and builds with Maven

---

### 🔁 Alternative Deployment Options

| Service | Frontend | Backend | Database | Free Tier |
|---------|----------|---------|----------|-----------|
| **Vercel** | ✅ Best | ❌ No Java/WS | ❌ | ✅ |
| **Railway** | ✅ Good | ✅ Best | ✅ MySQL | ✅ \$5/mo |
| **Render** | ✅ Good | ✅ Good | ✅ PostgreSQL | ✅ (sleeps) |
| **Fly.io** | ✅ | ✅ | ✅ | ✅ 3 VMs |
| **AWS (EB + RDS)** | ✅ S3+CF | ✅ | ✅ | ⚠️ 12 months |
| **DigitalOcean** | ✅ | ✅ | ✅ | ❌ Paid |

---

### 🔧 Production Checklist Before Deploying

- [ ] Move `spring.datasource.password` to environment variables (never hardcode)
- [ ] Update `WebConfig.java` CORS `allowedOrigins` to your Vercel frontend URL
- [ ] Update `src/api/axios.js` baseURL to your Railway backend URL
- [ ] Update `ChatWindow.js` SockJS URL to your Railway backend URL
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate` (not `update`) in production
- [ ] Enable Spring Security properly (currently `permitAll` for development)

---

## 🗺️ Feature Roadmap

```
✅ Feature 1 — Live Chat (WebSocket/STOMP)
🔜 Feature 2 — Community Profiles (browse all users with profile cards)
🔜 Feature 3 — Schedule Sessions (calendar-based time picking)
🔜 Feature 4 — Secure Video Calls (WebRTC / Jitsi Meet)
```

---

## 👨‍💻 Author

**Naveen** — [@navi-siddu-1103](https://github.com/navi-siddu-1103)

---

<div align="center">
  <strong>Happy Swapping! 🔄</strong><br/>
  <em>Connect · Learn · Grow</em>
</div>
