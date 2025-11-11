from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.scan import ScanTask, ScanNetwork
from app.schemas.scan import ScanTask as ScanTaskSchema, ScanTaskCreate, ScanNetwork as ScanNetworkSchema

router = APIRouter()

@router.post("/scan-tasks/", response_model=ScanTaskSchema)
def create_scan_task_endpoint(scan_task: ScanTaskCreate, db: Session = Depends(get_db)):
    try:
        # Создаем простую задачу сканирования
        db_scan_task = ScanTask(**scan_task.dict())
        db.add(db_scan_task)
        db.commit()
        db.refresh(db_scan_task)
        return db_scan_task
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating scan task: {str(e)}")

@router.get("/scan-tasks/", response_model=List[ScanTaskSchema])
def read_scan_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        scan_tasks = db.query(ScanTask).offset(skip).limit(limit).all()
        return scan_tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/scan-networks/", response_model=List[ScanNetworkSchema])
def read_scan_networks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        networks = db.query(ScanNetwork).filter(ScanNetwork.is_active == True).offset(skip).limit(limit).all()
        return networks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")