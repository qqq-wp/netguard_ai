from sklearn.ensemble import IsolationForest
from sklearn.cluster import KMeans
import torch
import torch.nn as nn
import joblib
import numpy as np
from sqlalchemy.orm import Session
from ..database import get_db  # Адаптируй под вашу db
from ..models import Asset  # Ваша модель Asset

class AnomalyDetector:
    def __init__(self):
        self.iforest = IsolationForest(contamination=0.1, random_state=42)
        self.model_path = "models/iforest.joblib"

    def fit(self, features: np.ndarray):
        self.iforest.fit(features)
        joblib.dump(self.iforest, self.model_path)

    def predict(self, features: np.ndarray) -> np.ndarray:
        return self.iforest.predict(features)  # -1: anomaly, 1: normal

class DeviceClassifier:
    def __init__(self, n_clusters=5):  # Кластеры для "нормальных" устройств
        self.kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        self.model_path = "models/kmeans.joblib"

    def fit(self, features: np.ndarray):
        self.kmeans.fit(features)
        joblib.dump(self.kmeans, self.model_path)

    def predict(self, features: np.ndarray) -> np.ndarray:
        return self.kmeans.predict(features)

class RiskPredictor(nn.Module):  # PyTorch для предсказаний CVE-рисков
    def __init__(self, input_size=10):  # e.g., features: ports, os_version, etc.
        super().__init__()
        self.fc = nn.Linear(input_size, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        return self.sigmoid(self.fc(x))

def extract_features(asset: Asset) -> np.ndarray:
    # Пример: features из Asset (ports len, os encoded, etc.)
    ports_count = len(asset.ports or {})
    os_encoded = hash(asset.os or "unknown") % 100  # Заглушка
    return np.array([ports_count, os_encoded, asset.last_seen.timestamp() % 86400])  # Нормализуй в prod

def load_data_for_training(db: Session) -> np.ndarray:
    assets = db.query(Asset).all()
    features = np.array([extract_features(a) for a in assets])
    # Добавь labels из разметки (e.g., asset.is_new, manual_label)
    return features