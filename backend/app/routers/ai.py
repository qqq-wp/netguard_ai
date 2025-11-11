from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.ai_service import analyze_asset, update_label, train_ai  # train как task

router = APIRouter(prefix="/ai", tags=["ИИ"])

@router.post("/analyze/{asset_id}")
def analyze(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    features = extract_features(asset)
    return analyze_asset(features)

@router.post("/label/{asset_id}")
def label(asset_id: int, label: str, db: Session = Depends(get_db)):
    update_label(db, asset_id, label)
    return {"status": "Разметка сохранена; переобучите модель"}

@router.post("/train")
def start_training():
    # Celery task для train.py
    from ..celery import app
    app.send_task("ai.train_ai")  # Или subprocess.run(["python", "train.py"])
    return {"status": "Обучение запущено"}