import subprocess
import xml.etree.ElementTree as ET

class NmapScanner:
    def __init__(self):
        pass
    
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
            print(f"Running command: {command}")
            result = subprocess.run(
                command, 
                shell=True, 
                capture_output=True, 
                text=True,
                timeout=3600  # 1 hour timeout
            )
            
            if result.returncode == 0:
                return self.parse_nmap_xml(result.stdout)
            else:
                return {"error": result.stderr}
                
        except subprocess.TimeoutExpired:
            return {"error": "Scan timeout"}
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
            
            # Информация о сканировании
            scan_info = root.find("scaninfo")
            if scan_info is not None:
                scan_data["scan_info"] = {
                    "type": scan_info.get("type"),
                    "protocol": scan_info.get("protocol"),
                    "services": scan_info.get("services")
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
                
                # Портs
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
            return {"error": f"XML parsing error: {str(e)}"}