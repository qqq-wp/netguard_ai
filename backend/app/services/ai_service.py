from ..ai.models import AnomalyDetector, DeviceClassifier, extract_features
import torch
import joblib
import numpy as np

def analyze_asset(asset_features: np.ndarray):
    # Load models
    detector = joblib.load("models/iforest.joblib")
    classifier = joblib.load("models/kmeans.joblib")
    
    anomaly_score = detector.predict(asset_features.reshape(1, -1))[0]
    cluster = classifier.predict(asset_features.reshape(1, -1))[0]
    
    # Risk pred
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    predictor = RiskPredictor(asset_features.shape[0]).to(device)
    predictor.load_state_dict(torch.load("models/risk_predictor.pth"))
    predictor.eval()
    with torch.no_grad():
        risk_prob = predictor(torch.tensor(asset_features, dtype=torch.float32).unsqueeze(0).to(device)).item()
    
    return {
        "is_anomaly": anomaly_score == -1,
        "cluster": cluster,  # 0: normal, new: outlier
        "risk_prob": risk_prob * 100,  # % шанс взлома
        "signature": f"New sig: anomaly in cluster {cluster}"  # Генерация сигнатур
    }

def update_label(db, asset_id: int, label: str):  # "false_positive", "threat", "accepted_risk"
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if label == "false_positive":
        asset.is_new = False  # "Нормальное"
    # Сохрани для обучения
    db.commit()