import paramiko
import configparser
import logging
import os
import json
from datetime import datetime, timedelta

class LogSearcher:
    def __init__(self, config_path: str):
        config = configparser.ConfigParser()
        config.read(config_path)

        self.ssh_host = config.get("SSH", "host")
        self.ssh_user = config.get("SSH", "user")
        self.ssh_password = config.get("SSH", "password")
        self.ssh_key_path = config.get("SSH", "key_path")

        self.logger = logging.getLogger('log_finder')
        self.logger.setLevel(logging.INFO)

        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        log_file_path = '/scripts/log_finder/log_finder.log'
        os.makedirs(os.path.dirname(log_file_path), exist_ok=True)

        file_handler = logging.FileHandler(log_file_path)
        file_handler.setFormatter(formatter)
        self.logger.addHandler(file_handler)

        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        self.logger.addHandler(console_handler)

        self.logger.info("Initialized LogSearcher with SSH key-based login.")

    def search_logs_stream(self, keyword, logfile=None, node=None):
        nodes = [int(node)] if node else range(1, 11)
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        try:
            self.logger.info(f"Connecting to {self.ssh_host} as {self.ssh_user}")
            client.connect(
                hostname=self.ssh_host,
                username=self.ssh_user,
                key_filename=self.ssh_key_path
            )
            self.logger.info("SSH connection established.")

            for node_id in nodes:
                current_log = f"/var/log/PMCPROD-{node_id}/qumulo.log"

                if logfile and logfile.startswith("qumulo.log") and logfile.endswith(".gz"):
                    rotated_log = f"/var/log/PMCPROD-{node_id}/{logfile}"
                    command = f"sudo -S zcat {rotated_log} | grep -iE '{keyword}' || true"
                else:
                    command = f"sudo -S cat {current_log} | grep -iE '{keyword}' || true"

                status_line = f"[Node {node_id}] Running command: {command}"
                self.logger.info(status_line)
                yield json.dumps({"type": "status", "message": status_line})

                stdin, stdout, stderr = client.exec_command(command)
                stdin.write(f"{self.ssh_password}\n")
                stdin.flush()

                count = 0
                for line in stdout:
                    stripped_line = line.strip()
                    try:
                        parts = stripped_line.split()
                        timestamp = parts[0]
                        dt = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%S.%fZ")
                        dt_plus8 = dt + timedelta(hours=8)
                        converted_timestamp = dt_plus8.strftime("%Y-%m-%d %H:%M:%S")
                        adjusted_line = stripped_line.replace(timestamp, converted_timestamp, 1)
                    except Exception:
                        adjusted_line = stripped_line

                    yield json.dumps({
                        "type": "log",
                        "node": f"PMCPROD-{node_id}",
                        "log_entry": adjusted_line
                    })
                    count += 1
                    if count >= 250000:
                        break

                error_output = stderr.read().decode().strip()
                if error_output:
                    self.logger.warning(f"[Node {node_id}] STDERR: {error_output}")
                    yield json.dumps({"type": "status", "message": f"[Node {node_id}] STDERR: {error_output}"})

        except Exception as e:
            self.logger.error(f"SSH stream error: {e}")
            yield json.dumps({"type": "status", "message": f"[Error] {str(e)}"})
        finally:
            client.close()
            self.logger.info("SSH connection closed.")
