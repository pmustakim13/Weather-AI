# 🌤️ Weather AI

A minimal yet powerful weather application that combines a **React** frontend with a **FastAPI** backend, powered by **LangChain** and **OpenRouter** (LLM) to provide intelligent weather insights for any city.

![Weather AI Preview](https://via.placeholder.com/800x400?text=Weather+AI+Preview)

## 🚀 Features

-   **Natural Language Queries**: Ask "How's the weather in Tokyo?" or "Do I need an umbrella in London?".
-   **AI-Powered Responses**: Uses an LLM (via OpenRouter) to interpret requests and fetch real-time data using the Open-Meteo API.
-   **Interactive UI**:
    -   Clean, premium design with glassmorphism effects.
    -   **Clear Chat** functionality.
    -   **Edit Prompts**: Easily correct or modify previous queries.
-   **Real-time Data**: Fetches accurate temperature, weather codes, and wind speeds.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: React (Vite)
-   **Styling**: Vanilla CSS (Modern, Responsive, with Animations)
-   **HTTP Client**: Axios

### Backend
-   **Framework**: FastAPI
-   **AI/Orchestration**: LangChain
-   **LLM Provider**: OpenRouter (OpenAI-compatible)
-   **Tools**: Open-Meteo (Weather Data), Geocoding API

## 📦 Installation

Cloning the repository:
```bash
git clone https://github.com/your-username/weather-ai.git
cd weather-ai
```

### 1. Backend Setup

Prerequisites: Python 3.8+

```bash
cd backend
python -m venv venv

# Activate Virtual Environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `backend` directory:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

start the server:
```bash
uvicorn main:app --reload
```
The backend will run on `http://127.0.0.1:8000`.

### 2. Frontend Setup

Prerequisites: Node.js 18+

```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## 🖥️ Usage

1.  Ensure both backend and frontend servers are running.
2.  Open `http://localhost:5173` in your browser.
3.  Type a query like "Weather in Paris" and hit Send.
4.  The AI will analyze the request, call the weather tool, and give you a natural language response.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
