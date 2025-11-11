import nmap
from celery import Celery
from .celery import app
from .database import SessionLocal
from .models import ScanTask, Asset
from .ai.models import extract_features, analyze_asset  # Интеграция ИИ
from .ai.train import train_ai  # Для задачи обучения

@app.task(bind=True)
def scan_subnet(self, task_id: int, subnet: str, mode: str, custom_flags: str, uuid: str):
    db = SessionLocal()
    task = db.query(ScanTask).filter(ScanTask.id == task_id).first()
    if not task:
        return {"error": "Task not found"}

    task.status = "running"
    db.commit()

    try:
        nm = nmap.PortScanner()
        flags = get_nmap_flags(mode, custom_flags)
        nm.scan(hosts=subnet, arguments=flags)

        results = {}
        for host in nm.all_hosts():
            host_data = {
                "hostname": nm[host].hostname(),
                "os": nm[host].get('osmatch', [{}])[0].get('name', "Unknown"),
                "ports": {str(p): s['state'] for p, s in nm[host].get('tcp', {}).items()},
                "vulns": detect_vulns(nm[host])  # Заглушка CVE
            }
            results[host] = host_data

            # Создать/обновить asset
            asset = db.query(Asset).filter(Asset.ip == host).first() or Asset(ip=host)
            asset.hostname = host_data["hostname"]
            asset.os = host_data["os"]
            asset.ports = host_data["ports"]
            asset.vulns = host_data["vulns"]
            asset.scan_task_id = task_id
            asset.last_seen = datetime.utcnow()

            # ИИ-анализ: извлечь features и предсказать
            features = extract_features(asset)
            ai_analysis = analyze_asset(features)
            asset.is_new = ai_analysis["cluster"] > 3  # Пример: outlier кластер
            asset.anomaly_score = ai_analysis["is_anomaly"]
            asset.risk_prob = ai_analysis["risk_prob"]

            db.add(asset) if not asset.id else db.commit()

        task.results = results
        task.status = "completed"
    except Exception as e:
        task.status = "failed"
        task.results = {"error": str(e)}
    finally:
        db.commit()
        db.close()

    return task.results

@app.task
def ai_train_task():
    train_ai()  # Ручное обучение на разметке

def get_nmap_flags(mode: str, custom: str) -> str:
    flags = {
        "ping": "-sn",
        "quick": "-T4 -F",
        "full": "-sS -sV -O",
        "custom": custom
    }
    return flags.get(mode, "-sn")

def detect_vulns(host_data: dict) -> list:
    # Заглушка: матчинг с CVE БД (добавьте позже)
    return [{"cve": "CVE-2023-1234", "risk": "high"}]