# NewsMind - A RAG News Chatbot - Frontend

This repository contains the frontend implementation of the **RAG News Chatbot** using **React.js** and **CSS**.


## 🛠 Frontend Tech Stack

- **React.js** – UI library for building a responsive and interactive frontend.

- **CSS** – Styling for the chat interface and components.

- **Fetch API** – To communicate with the backend REST API endpoints.

- **LocalStorage** – Used to persist the `sessionId` across page reloads.  
  **Justification:** Since the assignment did not require authentication (signup/login), every new user is considered a new session. LocalStorage is a simple way to store the sessionId on the client side so that chat history can be retrieved upon page reload.  
  **Note:** In a production system, this is not ideal. A more robust approach would involve user authentication, server-side sessions, or secure cookies to manage session identifiers.

- **Typing Indicator** – Provides a better user experience by showing the bot is generating a response.  
  **Justification:** Enhances interactivity and makes the chatbot feel responsive, even if the backend is still fetching the answer from the RAG pipeline + Gemini.


## ⚡ Features

- Chat screen with user & bot messages
- Input box with Enter key support
- Send button to trigger queries
- Session persistence using sessionId
- Fetch previous chat history from Redis
- Clear session button to reset chat

## 📂 Project Structure

```bash
frontend/
├─ public/
│  └─ index.html
├─ src/
│  ├─ UI/
│  │  ├─ ChatWindow.js
│  │  └─ TypingIndicator.js
│  ├─ Utils/
│  │  └─ HelperMethods.js
│  ├─ App.js
│  ├─ index.js
│  └─ App.css
├─ .env
├─ .gitignore
└─ package.json
```

## 🚀 Setup

1. Clone the repository

```bash
git clone <frontend-repo-url>
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file

```env
REACT_APP_API_BASE_URL=<backend_api_base_url>
```
4. Start frontend

```bash
npm start
```

## 💬 Chat Flow

**On page load:**
- Check `localStorage` for `sessionId`.
- If exists → fetch chat history.
- If not → create a new session via `/api/users/session/create` and save `sessionId`.

**Sending a message:**
1. User types message & clicks **Send** / presses **Enter**.
2. `POST /api/users/chat` with `{ sessionId, query }`.
3. Backend returns answer.
4. UI appends user query & bot answer to chat window.
5. Messages stored in local state and Redis backend.

**Clear session:**
- User clicks **"Clear Session"**.
- `DELETE /api/users/session/:sessionId`.
- Chat history removed from Redis.
- Frontend clears chat and reloads.

---

## ⚙️ Notes
- User and bot messages are distinguished via the `role` property.  
- Messages are displayed using a `map` function with conditional rendering.  
- A **typing indicator** is shown while waiting for backend response.  

---

## 💡 Potential Improvements
- Add **WebSocket** support for real-time streaming responses.  
- Implement **message pagination** for long chat history.  
- Add **UI animations** & improved styling.  
