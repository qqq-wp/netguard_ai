-- Пользователи системы
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('security_admin', 'auditor')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Сети для сканирования
CREATE TABLE IF NOT EXISTS scan_networks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cidr_range CIDR NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Очередь задач сканирования
CREATE TABLE IF NOT EXISTS scan_tasks (
    id SERIAL PRIMARY KEY,
    network_id INTEGER REFERENCES scan_networks(id),
    scan_type VARCHAR(50) NOT NULL,
    nmap_arguments TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    results JSONB
);

-- Инвентарь активов
CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    ip_address INET NOT NULL,
    mac_address MACADDR,
    hostname VARCHAR(255),
    os_name VARCHAR(100),
    os_version VARCHAR(100),
    device_type VARCHAR(50),
    vendor VARCHAR(100),
    first_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Открытые порты
CREATE TABLE IF NOT EXISTS asset_ports (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER REFERENCES assets(id),
    port INTEGER NOT NULL,
    protocol VARCHAR(10) NOT NULL,
    service_name VARCHAR(100),
    service_version VARCHAR(100),
    state VARCHAR(20),
    last_scanned TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Базовые индексы для производительности
CREATE INDEX IF NOT EXISTS idx_assets_ip ON assets(ip_address);
CREATE INDEX IF NOT EXISTS idx_assets_last_seen ON assets(last_seen);
CREATE INDEX IF NOT EXISTS idx_scan_tasks_status ON scan_tasks(status);
CREATE INDEX IF NOT EXISTS idx_scan_tasks_created_at ON scan_tasks(created_at);