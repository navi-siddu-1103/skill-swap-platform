# Skill Swap Platform

<div align="center">

![Skill Swap Platform](https://img.shields.io/badge/Skill%20Swap-Platform-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=20232A)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-25-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

**Connect, learn, and grow—one skill at a time.**

A full-stack peer-to-peer platform for discovering people, exchanging skills, managing swap requests, and communicating through real-time chat.

[Features](#features) · [Technology stack](#technology-stack) · [Local development](#local-development) · [API overview](#api-overview) · [Deployment](#deployment)

</div>

## Features

- **Account management:** Register and sign in with BCrypt-protected passwords.
- **Skill profiles:** Add skills as either skills to teach or skills to learn.
- **Partner discovery:** Search for users by skill and skill type.
- **Skill swap requests:** Send, review, and update swap requests.
- **Real-time chat:** Exchange messages through STOMP over WebSocket with SockJS fallback.
- **Conversation management:** View chat history, contacts, conversations, and unread-message counts.
- **Responsive interface:** React-based pages for authentication, dashboards, profiles, search, swaps, and chat.

## Technology stack

### Frontend

| Technology | Version | Role |
| --- | --- | --- |
| React | 19.1 | User interface |
| React DOM | 19.1 | Browser rendering |
| React Router DOM | 7.7 | Client-side routing |
| Create React App | 5.0 | Development and production build tooling |
| Axios | 1.11 | REST API communication |
| `@stomp/stompjs` | 7.3 | STOMP client for real-time messaging |
| SockJS Client | 1.6 | WebSocket transport fallback |
| Tailwind CSS | 3.4 | Utility-first styling |
| Testing Library | 16.x | React component testing |

### Backend

| Technology | Version | Role |
| --- | --- | --- |
| Java | 25 | Application language |
| Spring Boot | 3.5.14 | Backend framework |
| Spring Web | 3.5.14 | REST API |
| Spring Data JPA | 3.5.14 | Persistence and repository abstraction |
| Hibernate | Managed by Spring Boot | ORM implementation |
| Spring Security | 3.5.14 | Security configuration and password encoding |
| Spring WebSocket | 3.5.14 | STOMP-based real-time messaging |
| MySQL Connector/J | Managed by Spring Boot | MySQL connectivity |
| PostgreSQL Driver | Managed by Spring Boot | Cloud database compatibility |
| H2 Database | Managed by Spring Boot | Development and fallback runtime database |
| Lombok | 1.18.32 | Boilerplate reduction |
| Maven Wrapper | Included | Reproducible backend builds |

## Project structure

```text
skill-swap-platform/
├── skill-swap-frontend/       # React single-page application
│   ├── public/
│   └── src/
│       ├── api/               # Axios API client
│       ├── components/        # Shared UI and chat components
│       ├── context/           # Authentication context
│       └── pages/             # Application pages
├── skill-swap-backend/        # Spring Boot application
│   ├── src/main/java/         # Config, controllers, models, repositories, services
│   ├── src/main/resources/    # Application and profile configuration
│   └── pom.xml
├── render.yaml                # Render deployment configuration
└── README.md
```

## Local development

### Prerequisites

- Java 25
- Node.js and npm
- MySQL 8 for local development

### 1. Clone the repository

```bash
git clone https://github.com/navi-siddu-1103/skill-swap-platform.git
cd skill-swap-platform
```

### 2. Create the local database

```sql
CREATE DATABASE skill_swap_db;
```

The backend defaults to:

```text
jdbc:mysql://localhost:3306/skill_swap_db
username: root
port: 9091
```

Set the database password in `skill-swap-backend/src/main/resources/application.properties` or provide it through the `SPRING_DATASOURCE_PASSWORD` environment variable. Do not commit credentials.

### 3. Start the backend

```bash
cd skill-swap-backend
./mvnw spring-boot:run       # Linux/macOS
.\mvnw.cmd spring-boot:run   # Windows
```

The API is available at `http://localhost:9091`.

### 4. Start the frontend

In a second terminal:

```bash
cd skill-swap-frontend
npm install
npm start
```

The frontend is available at `http://localhost:3000`.

For a deployed backend, copy `.env.example` to `.env` and set:

```env
REACT_APP_API_URL=https://your-backend.example.com/api
REACT_APP_WS_URL=https://your-backend.example.com/ws
```

## API overview

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Sign in |

### Users and skills

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/users/{id}` | Get a user profile |
| `GET` | `/api/skills/user/{userId}` | List a user's skills |
| `POST` | `/api/skills/add` | Add a teach or learn skill |
| `GET` | `/api/search` | Search users by skill and type |

### Skill swaps

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/swaps/request` | Create a swap request |
| `GET` | `/api/swaps/pending/{userId}` | List incoming requests |
| `GET` | `/api/swaps/sent/{userId}` | List outgoing requests |
| `PATCH` | `/api/swaps/status/{swapId}?status={status}` | Update request status |

### Chat

| Protocol | Endpoint | Description |
| --- | --- | --- |
| `WS` | `/ws` | SockJS/STOMP connection endpoint |
| `STOMP` | `/app/chat.send` | Send a chat message |
| `STOMP` | `/user/queue/messages` | Receive user messages |
| `GET` | `/api/chat/history/{userId1}/{userId2}` | Get conversation history |
| `GET` | `/api/chat/contacts/{userId}` | List chat contacts |
| `GET` | `/api/chat/conversations/{userId}` | List conversations |
| `GET` | `/api/chat/unread/count/{userId}` | Get unread-message count |
| `POST` | `/api/chat/read/{senderId}/{receiverId}` | Mark messages as read |

## Deployment

The repository includes a `render.yaml` configuration for deploying the Spring Boot backend to [Render](https://render.com). The production profile supports:

- A dynamic `PORT` supplied by the hosting platform.
- A configured external database through `SPRING_DATASOURCE_URL`.
- H2 as a fallback database when no external database is configured.
- CORS configuration through the `FRONTEND_URL` environment variable.

For a production deployment:

1. Deploy the backend using the repository's `render.yaml` configuration.
2. Set `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` for a persistent database.
3. Set `FRONTEND_URL` to the deployed frontend origin.
4. Configure `REACT_APP_API_URL` and `REACT_APP_WS_URL` in the frontend hosting provider.
5. Use `SPRING_JPA_HIBERNATE_DDL_AUTO=validate` after the production schema is established.

## Roadmap

- Community profile discovery
- Session scheduling
- Video calls using WebRTC or Jitsi
- Stronger production authentication and authorization

## Author

**Naveen** — [@navi-siddu-1103](https://github.com/navi-siddu-1103)

<div align="center">
  <strong>Connect · Learn · Grow</strong>
</div>
