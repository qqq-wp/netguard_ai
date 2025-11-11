from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from .database import init_db  # Импорт для инициализации БД
from .routers import scan, tasks, auth, ai  # Добавлен ai

app = FastAPI(title="NetGuard AI", description="Мониторинг сетевой безопасности", version="0.1.0")

# CORS для фронта
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Роутеры
app.include_router(scan.router, prefix="/scan", tags=["Сканирование"])
app.include_router(tasks.router, prefix="/tasks", tags=["Задачи"])
app.include_router(auth.router, prefix="/auth", tags=["Аутентификация"])
app.include_router(ai.router, prefix="/ai", tags=["ИИ"])  # Новый роутер

# Инициализация БД при старте
@app.on_event("startup")
async def startup():
    await init_db()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)