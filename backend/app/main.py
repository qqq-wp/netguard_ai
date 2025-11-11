from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api.endpoints import assets, scans

# Создание таблиц
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CyberShield Auditor API",
    description="API для системы мониторинга сетевой безопасности",
    version="1.0.0"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(assets.router, prefix="/api", tags=["assets"])
app.include_router(scans.router, prefix="/api", tags=["scans"])

@app.get("/")
async def root():
    return {"message": "CyberShield Auditor API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Функция для добавления тестовых данных
@app.on_event("startup")
async def startup_event():
    from app.database import SessionLocal
    from app.models.scan import ScanNetwork
    
    db = SessionLocal()
    try:
        # Проверяем, есть ли уже сети
        existing_networks = db.query(ScanNetwork).count()
        if existing_networks == 0:
            # Добавляем тестовые сети
            test_networks = [
                ScanNetwork(
                    name="Локальная сеть Docker",
                    cidr_range="172.20.0.0/16",
                    description="Docker сеть для тестирования"
                ),
                ScanNetwork(
                    name="Тестовая сеть 1",
                    cidr_range="192.168.1.0/24", 
                    description="Пример локальной сети"
                ),
                ScanNetwork(
                    name="Тестовая сеть 2",
                    cidr_range="10.0.0.0/8",
                    description="Большая частная сеть"
                )
            ]
            db.add_all(test_networks)
            db.commit()
            print("✅ Тестовые сети добавлены в базу данных")
    except Exception as e:
        print(f"❌ Ошибка при добавлении тестовых сетей: {e}")
        db.rollback()
    finally:
        db.close()