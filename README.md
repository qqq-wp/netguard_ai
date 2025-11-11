# NetGuard AI

Масштабируемый инструмент для мониторинга и аудита сетевой безопасности. Обнаруживает аномалии, атаки, уязвимости; инвентаризация активов. WEB-UI на React, backend FastAPI, Postgres, nmap-сканирование. Docker-deploy, без интернета после установки. ИИ для обучения на разметке.

## Структура
- backend/: FastAPI API + Celery.
- frontend/: React/Vite UI (русский, light/dark).
- scanner-worker/: Nmap задачи.
- database/: Postgres init.
- test-environment/: Имитация уязвимых узлов.

## Запуск (dev на Win10)
1. `cp .env.example .env` и заполни (DB_PASS=...).
2. `docker-compose up --build`.
3. Backend: http://localhost:8000/docs (Swagger).
4. Frontend: http://localhost:3000.
5. Тест скана: POST /api/scan/start { "subnet": "192.168.1.0/24", "mode": "quick" }.
6. ИИ-обучение: python ai/train.py (позже).

## Этапы
- 1: База (done).
- 2: UI + дашборды (in progress).
- 3: ИИ (Scikit/PyTorch, GPU GTX1060).
- CVE: python update_cve.py (manual).

ТЗ: см. issues или docs.