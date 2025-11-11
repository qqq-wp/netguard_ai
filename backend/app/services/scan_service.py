import redis
import json
from app.database import SessionLocal
from app.models.scan import ScanTask
from app.models.asset import Asset, AssetPort

r = redis.Redis(host='redis', port=6379, db=0, decode_responses=True)

def start_scan_task(scan_task_id: int):
    """Запуск задачи сканирования через scanner-worker"""
    db = SessionLocal()
    try:
        # Получаем задачу из БД
        scan_task = db.query(ScanTask).filter(ScanTask.id == scan_task_id).first()
        if not scan_task:
            print(f"❌ Задача сканирования {scan_task_id} не найдена")
            return
        
        # Получаем сеть для сканирования
        from app.models.scan import ScanNetwork
        network = db.query(ScanNetwork).filter(ScanNetwork.id == scan_task.network_id).first()
        if not network:
            print(f"❌ Сеть для задачи {scan_task_id} не найдена")
            return
        
        # Обновляем статус задачи
        scan_task.status = "running"
        db.commit()
        
        # Отправляем задачу в очередь
        task_data = {
            "id": scan_task_id,
            "target": network.cidr_range,
            "scan_type": scan_task.scan_type,
            "options": scan_task.nmap_arguments or ""
        }
        
        r.lpush('scan_queue', json.dumps(task_data))
        print(f"✅ Задача {scan_task_id} добавлена в очередь сканирования")
        
    except Exception as e:
        print(f"❌ Ошибка запуска задачи сканирования: {e}")
        db.rollback()
    finally:
        db.close()