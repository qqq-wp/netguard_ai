#!/usr/bin/env python3
import sys
import os

# Добавляем текущую директорию в путь для импортов
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base
from app.models import user, asset, scan

def init_database():
    """Инициализация базы данных"""
    print("🔄 Создание таблиц в базе данных...")
    Base.metadata.create_all(bind=engine)
    print("✅ Таблицы созданы успешно!")

if __name__ == "__main__":
    init_database()