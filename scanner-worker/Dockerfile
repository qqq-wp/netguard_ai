FROM python:3.11-slim

WORKDIR /app

# Установка nmap и системных зависимостей
RUN apt-get update && apt-get install -y \
    nmap \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Копирование requirements и установка Python зависимостей
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование исходного кода
COPY . .

# Создание не-root пользователя (но nmap требует привилегий для некоторых сканирований)
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app

# Для nmap некоторых типов сканирований нужны права, поэтому оставляем root
# В продакшене нужно настроить безопасные capability
USER root

# Запуск воркера
CMD ["python", "app/main.py"]