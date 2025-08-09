from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uuid
import os
import json
from datetime import datetime, timedelta
import random
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI(title="MedAnalyzer API")

# CORS setup
origins = os.environ.get("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "medanalyzer_db")

client = None
db = None

@app.on_event("startup")
async def startup_db_client():
    global client, db
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()

# Pydantic models
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    age: Optional[int] = None
    gender: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class AnalysisRequest(BaseModel):
    user_id: str
    patient_name: str
    patient_age: int
    patient_gender: str
    analysis_type: str
    symptoms: Optional[str] = ""
    medications: Optional[str] = ""

# Simulated AI analysis responses
ANALYSIS_TEMPLATES = {
    "blood_test": {
        "indicators": [
            {"name": "Гемоглобин", "value": "145 г/л", "norm": "120-160 г/л", "status": "normal", "description": "В пределах нормы"},
            {"name": "Эритроциты", "value": "4.2 ×10¹²/л", "norm": "3.8-5.1 ×10¹²/л", "status": "normal", "description": "Количество красных кровяных телец в норме"},
            {"name": "Лейкоциты", "value": "7.8 ×10⁹/л", "norm": "4.0-9.0 ×10⁹/л", "status": "normal", "description": "Иммунная система функционирует нормально"},
            {"name": "Глюкоза", "value": "5.8 ммоль/л", "norm": "3.9-6.1 ммоль/л", "status": "normal", "description": "Уровень сахара в крови в норме"}
        ],
        "summary": "Результаты общего анализа крови показывают, что все основные показатели находятся в пределах референсных значений. Признаков воспалительного процесса или анемии не обнаружено.",
        "recommendations": [
            "Поддерживать здоровый образ жизни",
            "Сбалансированное питание",
            "Регулярные профилактические осмотры через 6 месяцев"
        ]
    },
    "xray": {
        "findings": [
            "Легочные поля чистые, без очаговых и инфильтративных изменений",
            "Корни легких структурны, не расширены",
            "Сердечная тень в пределах нормы",
            "Купола диафрагмы четкие, подвижные"
        ],
        "summary": "Рентгенография органов грудной клетки не выявила патологических изменений. Легочные поля чистые, сердце в норме.",
        "recommendations": [
            "При появлении симптомов обратиться к врачу",
            "Профилактическое обследование через год",
            "Избегать переохлаждения"
        ]
    },
    "urine_test": {
        "indicators": [
            {"name": "Белок", "value": "0.02 г/л", "norm": "до 0.1 г/л", "status": "normal", "description": "Белок в моче в норме"},
            {"name": "Глюкоза", "value": "отсутствует", "norm": "отсутствует", "status": "normal", "description": "Глюкозы в моче не обнаружено"},
            {"name": "Лейкоциты", "value": "2-3 в п/з", "norm": "до 5 в п/з", "status": "normal", "description": "Количество лейкоцитов в норме"},
            {"name": "Эритроциты", "value": "1-2 в п/з", "norm": "до 2 в п/з", "status": "normal", "description": "Эритроциты в пределах нормы"}
        ],
        "summary": "Общий анализ мочи показывает нормальные значения всех исследуемых параметров. Признаков заболеваний мочеполовой системы не выявлено.",
        "recommendations": [
            "Поддерживать водно-солевой баланс",
            "Соблюдать личную гигиену",
            "При появлении симптомов обратиться к урологу"
        ]
    }
}

# API Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

@app.post("/api/register")
async def register_user(user: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")
    
    user_id = str(uuid.uuid4())
    user_data = {
        "user_id": user_id,
        "name": user.name,
        "email": user.email,
        "password": user.password,  # In production, hash this!
        "age": user.age,
        "gender": user.gender,
        "created_at": datetime.now(),
        "subscription_plan": "basic"
    }
    
    await db.users.insert_one(user_data)
    return {"message": "User registered successfully", "user_id": user_id}

@app.post("/api/login")
async def login_user(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email, "password": credentials.password})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "message": "Login successful",
        "user": {
            "user_id": user["user_id"],
            "name": user["name"],
            "email": user["email"],
            "subscription_plan": user.get("subscription_plan", "basic")
        }
    }

@app.post("/api/analyze")
async def analyze_medical_data(
    user_id: str = Form(...),
    patient_name: str = Form(...),
    patient_age: int = Form(...),
    patient_gender: str = Form(...),
    analysis_type: str = Form(...),
    symptoms: str = Form(""),
    medications: str = Form(""),
    file: Optional[UploadFile] = File(None)
):
    # Simulate AI processing delay
    import asyncio
    await asyncio.sleep(2)
    
    analysis_id = str(uuid.uuid4())
    
    # Get template based on analysis type
    template_key = "blood_test"  # default
    if "кровь" in analysis_type.lower() or "blood" in analysis_type.lower():
        template_key = "blood_test"
    elif "рентген" in analysis_type.lower() or "xray" in analysis_type.lower():
        template_key = "xray"
    elif "моча" in analysis_type.lower() or "urine" in analysis_type.lower():
        template_key = "urine_test"
    
    template = ANALYSIS_TEMPLATES.get(template_key, ANALYSIS_TEMPLATES["blood_test"])
    
    # Create analysis result
    analysis_result = {
        "analysis_id": analysis_id,
        "user_id": user_id,
        "patient_name": patient_name,
        "patient_age": patient_age,
        "patient_gender": patient_gender,
        "analysis_type": analysis_type,
        "symptoms": symptoms,
        "medications": medications,
        "file_name": file.filename if file else None,
        "created_at": datetime.now(),
        "ai_confidence": random.randint(85, 98),
        "status": "completed",
        **template
    }
    
    # Save to database
    await db.analyses.insert_one(analysis_result)
    
    return analysis_result

@app.get("/api/user/{user_id}/analyses")
async def get_user_analyses(user_id: str):
    analyses = []
    async for analysis in db.analyses.find({"user_id": user_id}).sort("created_at", -1).limit(10):
        analysis["_id"] = str(analysis["_id"])  # Convert ObjectId to string
        analyses.append(analysis)
    return {"analyses": analyses}

@app.get("/api/analysis/{analysis_id}")
async def get_analysis_details(analysis_id: str):
    analysis = await db.analyses.find_one({"analysis_id": analysis_id})
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    analysis["_id"] = str(analysis["_id"])
    return analysis

@app.get("/api/user/{user_id}/dashboard")
async def get_user_dashboard(user_id: str):
    # Get user stats
    user = await db.users.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Count analyses
    total_analyses = await db.analyses.count_documents({"user_id": user_id})
    
    # Get recent analyses
    recent_analyses = []
    async for analysis in db.analyses.find({"user_id": user_id}).sort("created_at", -1).limit(5):
        analysis["_id"] = str(analysis["_id"])
        recent_analyses.append({
            "analysis_id": analysis["analysis_id"],
            "analysis_type": analysis["analysis_type"],
            "created_at": analysis["created_at"],
            "ai_confidence": analysis.get("ai_confidence", 90)
        })
    
    # Generate simulated health metrics
    health_metrics = {
        "heart_rate": {"value": random.randint(65, 95), "status": "normal", "trend": "stable"},
        "blood_pressure": {"value": f"{random.randint(110, 140)}/{random.randint(70, 90)}", "status": "normal", "trend": "stable"},
        "weight": {"value": random.randint(60, 80), "status": "normal", "trend": "decreasing"},
        "risk_score": {"value": random.randint(15, 35), "status": "low", "trend": "improving"}
    }
    
    return {
        "user": {
            "name": user["name"],
            "email": user["email"],
            "subscription_plan": user.get("subscription_plan", "basic")
        },
        "stats": {
            "total_analyses": total_analyses,
            "active_treatments": random.randint(1, 3),
            "upcoming_appointments": random.randint(0, 2)
        },
        "health_metrics": health_metrics,
        "recent_analyses": recent_analyses
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)