from camel.interpreters.docker_interpreter import DockerInterpreter

import docker
import os
from pydantic import BaseModel
from pathlib import Path
class EnvModel(BaseModel):
    def to_env_dict(self, include_os_env: bool = False) -> dict[str, str]:
        env_dict = {}

        for field_name, value in self.model_dump(exclude_none=True).items():
            if value is None:
                continue

            env_dict[f"T_BENCH_{field_name.upper()}"] = str(value)

        if include_os_env:
            env_dict.update(os.environ.copy())

        return env_dict

class DockerComposeEnvVars(EnvModel):
    task_docker_client_container_name: str | None = None
    task_docker_client_image_name: str | None = None
    task_docker_name_prefix: str | None = None
    container_logs_path: str | None = None
    test_dir: str | None = None
    task_logs_path: str | None = None

compose_file = "/Users/qijia/Documents/code/camel/camel/environments/terminal-use-env/cartpole-rl-training/docker-compose.yaml"

task_id = "cartpole-rl-training"
client_image_name = f"t-bench__{task_id}__client".replace(".", "-")
trial_name = f"cartpole-rl-training__trial__0"
client_container_name = f"{trial_name}__client".replace(".", "-")
base_dir = Path(__file__).parent.absolute()
env = DockerComposeEnvVars(
    task_docker_client_container_name=client_container_name,
    task_docker_client_image_name=client_image_name,
    task_docker_name_prefix=f"{task_id}__",
    container_logs_path=str(base_dir / "logs"),
    test_dir=str(base_dir / "tests"),
    task_logs_path=str(base_dir / "task_logs")
)

env_dict = env.to_env_dict(include_os_env=True)

assert os.path.exists(compose_file), f"Compose file {compose_file} does not exist."
import subprocess

result = subprocess.run(
    ["docker", "compose", "-p", client_container_name, "-f", str(compose_file), "build"],
    env=env_dict,
    capture_output=True,
    check=False,  # Don't raise exception immediately
    text=True
)
# print("Docker compose build output:", result)

up_result = subprocess.run(
    ["docker", "compose", "-p", client_container_name, "-f", str(compose_file), "up", "-d"],
    capture_output=True,
    text=True,
    check=False,
    env=env_dict
)
# print("Docker compose up output:", up_result)

client = docker.from_env()

container = client.containers.get(client_container_name)
container.start()
if result.returncode != 0:
    raise InterpreterError(f"Docker compose failed: {result.stderr}")

print("Docker composed\n\n\n ")

from camel.toolkits.terminal_toolkit import TerminalToolkit

docker_interpreter = DockerInterpreter()
# docker_interpreter._initialize_if_needed()
# docker_interpreter.start_container()
container = docker_interpreter._container
terminal_toolkit = TerminalToolkit(need_terminal=False,docker=True, container_id=container.id)

r1 = terminal_toolkit.shell_exec(id="session1", command="pwd")
r2 = terminal_toolkit.shell_exec(id="session1", command="mkdir logs")
r3 = terminal_toolkit.shell_exec(id="session1", command="cd logs")
r4 = terminal_toolkit.shell_exec(id="session1", command="pwd")
print("Command output:", r1)
print("Command output:", r2)
print("Command output:", r3)
print("Command output:", r4)
# docker_interpreter = DockerInterpreter(require_confirm=False, print_stdout=True, print_stderr=True)
# # docker_interpreter._container = container


# # Run a command in the Docker container
# r1 = docker_interpreter.run("pwd", "bash")
# r2 = docker_interpreter.run("mkdir logs", "bash")
# r2 = docker_interpreter.run("cd logs", "bash")
# r3 = docker_interpreter.run("ls", "bash")
# del docker_interpreter
# print("Command output:", r1)