# 🎵 Spotify Music Downloader & Player

A **React-based** web application that allows users to **download Spotify tracks and playlists**, featuring a built-in **music player with queue management**, shuffle, repeat, and favorite tracks functionality.

---

## 🛠️ Technologies Used

* **Frontend:** React 18, TypeScript, TailwindCSS
* **State Management:** React Query (TanStack Query)
* **Routing:** React Router DOM
* **HTTP Client:** Axios
* **Icons:** FontAwesome
* **Backend:** Node.js (Express)
* **Database:** PostgreSQL

---

## ⚙️ Setup & Configuration

### Prerequisites

* Node.js **v18 or higher**
* PostgreSQL installed and running
* Spotify Developer Account for API credentials

### Environment Variables

Create a `.env` file in the `/server` directory and configure your database and Spotify credentials.

---

## 🚀 How to Run

### ⚙️ Install Dependencies

```bash
npm install
cd ./server
npm install
```

### 🚀 Start the Project

```bash
# Start the backend server
cd ./server
npm run start
```

---

## 🌟 Features

* Download and play Spotify tracks directly in the browser
* Queue management with shuffle and repeat
* Like and recently played track history (stored in localStorage)

