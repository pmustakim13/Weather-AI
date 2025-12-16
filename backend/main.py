from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain.agents import create_tool_calling_agent, AgentExecutor
import requests
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input model
class ChatRequest(BaseModel):
    message: str

# Weather Tool
@tool
def get_current_weather(city: str):
    """Get the current weather for a city using Open-Meteo."""
    try:
        # Geocoding to get lat/lon
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json"
        geo_res = requests.get(geo_url).json()
        
        if not geo_res.get("results"):
            return f"Could not find coordinates for {city}."
            
        location = geo_res["results"][0]
        lat = location["latitude"]
        lon = location["longitude"]
        name = location["name"]
        
        # Weather API
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code&wind_speed_unit=ms"
        weather_res = requests.get(weather_url).json()
        
        current = weather_res.get("current", {})
        temp = current.get("temperature_2m", "N/A")
        code = current.get("weather_code", "N/A")
        
        # Simple weather code interpretation (WMO code)
        weather_desc = "Unknown"
        if code == 0: weather_desc = "Clear sky"
        elif code in [1, 2, 3]: weather_desc = "Mainly clear, partly cloudy, and overcast"
        elif code in [45, 48]: weather_desc = "Fog"
        elif code in [51, 53, 55]: weather_desc = "Drizzle"
        elif code in [61, 63, 65]: weather_desc = "Rain"
        elif code in [71, 73, 75]: weather_desc = "Snow fall"
        elif code in [95, 96, 99]: weather_desc = "Thunderstorm"
        
        return f"Weather in {name}: {temp}°C, {weather_desc}"
        
    except Exception as e:
        return f"Error fetching weather: {str(e)}"

# LangChain Setup
api_key = os.getenv("OPENROUTER_API_KEY")
if not api_key:
    print("WARNING: OPENROUTER_API_KEY not found in env.")

llm = ChatOpenAI(
    openai_api_base="https://openrouter.ai/api/v1",
    openai_api_key=api_key,
    model_name="openai/gpt-3.5-turbo",
    temperature=0
)

tools = [get_current_weather]

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant that can provide weather information. Use the available tools to fetch weather data when asked."),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

agent = create_tool_calling_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = agent_executor.invoke({"input": request.message})
        return {"response": response["output"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Weather Backend is running (Full)"}
