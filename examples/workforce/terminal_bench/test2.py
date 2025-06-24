import docker

client = docker.from_env()
container = client.containers.get("play-zork-container")
# walk through the container's file system
r = container.exec_run("ls -l ")
print(r.output.decode("utf-8"))
r = container.exec_run("pwd")
print(r.output.decode("utf-8"))