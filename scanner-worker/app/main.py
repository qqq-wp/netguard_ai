import time
import redis
import json
import subprocess
import xml.etree.ElementTree as ET
from datetime import datetime

# Подключение к Redis и БД
r = redis.Redis(host='redis', port=6379, db=0, decode_responses=True)

class NmapScanner:
    def scan(self, target: str, scan_type: str, options: str = ""):
        """Выполнение nmap сканирования"""
        nmap_args = {
            "ping": "-sn",
            "quick": "-T4 -F", 
            "normal": "-sS -sV -O",
            "full": "-sS -sV -O -A -p-"
        }
        
        arguments = nmap_args.get(scan_type, options)
        command = f"nmap {arguments} {target} -oX -"
        
        try:
            print(f"🔍 Запуск сканирования: {command}")
            result = subprocess.run(
                command, 
                shell=True, 
                capture_output=True, 
                text=True,
                timeout=3600
            )
            
            if result.returncode == 0:
                return self.parse_nmap_xml(result.stdout)
            else:
                return {"error": result.stderr}
                
        except subprocess.TimeoutExpired:
            return {"error": "Таймаут сканирования"}
        except Exception as e:
            return {"error": str(e)}
    
    def parse_nmap_xml(self, xml_output: str):
        """Парсинг XML вывода nmap"""
        try:
            root = ET.fromstring(xml_output)
            scan_data = {
                "scan_info": {},
                "hosts": [],
                "summary": {
                    "total_hosts": 0,
                    "up_hosts": 0,
                    "down_hosts": 0
                }
            }
            
            # Обработка хостов
            for host in root.findall("host"):
                host_data = {
                    "ip": None,
                    "mac": None,
                    "status": "down",
                    "hostname": None,
                    "ports": []
                }
                
                # IP адрес
                address = host.find("address[@addrtype='ipv4']")
                if address is not None:
                    host_data["ip"] = address.get("addr")
                
                # MAC адрес
                mac_address = host.find("address[@addrtype='mac']")
                if mac_address is not None:
                    host_data["mac"] = mac_address.get("addr")
                    host_data["vendor"] = mac_address.get("vendor")
                
                # Статус
                status = host.find("status")
                if status is not None:
                    host_data["status"] = status.get("state")
                    if host_data["status"] == "up":
                        scan_data["summary"]["up_hosts"] += 1
                
                # Hostname
                hostname_elem = host.find("hostnames/hostname")
                if hostname_elem is not None:
                    host_data["hostname"] = hostname_elem.get("name")
                
                # Порты
                ports_elem = host.find("ports")
                if ports_elem is not None:
                    for port in ports_elem.findall("port"):
                        port_data = {
                            "port": int(port.get("portid")),
                            "protocol": port.get("protocol"),
                            "state": port.find("state").get("state"),
                            "service": {
                                "name": "unknown",
                                "version": None,
                                "product": None
                            }
                        }
                        
                        service = port.find("service")
                        if service is not None:
                            port_data["service"]["name"] = service.get("name", "unknown")
                            port_data["service"]["product"] = service.get("product")
                            port_data["service"]["version"] = service.get("version")
                        
                        host_data["ports"].append(port_data)
                
                scan_data["hosts"].append(host_data)
                scan_data["summary"]["total_hosts"] += 1
            
            scan_data["summary"]["down_hosts"] = (
                scan_data["summary"]["total_hosts"] - scan_data["summary"]["up_hosts"]
            )
            
            return scan_data
            
        except Exception as e:
            return {"error": f"Ошибка парсинга XML: {str(e)}"}

def process_scan_tasks():
    """Основной цикл обработки задач сканирования"""
    scanner = NmapScanner()
    
    while True:
        # Получаем задачу из очереди (пока эмулируем)
        task_data = r.lpop('scan_queue')
        
        if task_data:
            try:
                task = json.loads(task_data)
                print(f"🎯 Обработка задачи сканирования: {task['id']} для цели: {task['target']}")
                
                # Выполняем сканирование
                result = scanner.scan(
                    target=task['target'],
                    scan_type=task['scan_type'],
                    options=task.get('options', '')
                )
                
                # Сохраняем результат
                r.set(f"scan_result:{task['id']}", json.dumps(result))
                print(f"✅ Задача сканирования {task['id']} завершена")
                
            except Exception as e:
                print(f"❌ Ошибка обработки задачи: {e}")
        
        time.sleep(5)

if __name__ == "__main__":
    print("🚀 Scanner Worker запущен...")
    process_scan_tasks()