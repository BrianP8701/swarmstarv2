import docker
from docker.models.containers import Container

from swarmstar.utils.containers.abstract import ContainerManagement
from swarmstar.utils.github.wrapper import GitHubWrapper
from swarmstar.context import swarm_id_var

class DockerContainerManager(ContainerManagement):
    def __init__(self):
        self.client = docker.from_env()
        self.github = GitHubWrapper()

    def start(self, image_id: str = "python:latest") -> str:
        """
        Start a container.
        """
        try:
            container: Container = self.client.containers.run(image_id,
                                                              command=["/bin/bash"],
                                                              detach=True,
                                                              tty=True,
                                                              working_dir="/repo")
        except docker.errors.ImageNotFound:
            raise ValueError(f"Image with ID {image_id} not found.")
        except docker.errors.APIError as e:
            raise ConnectionError(f"Failed to start terminal session due to Docker API error: {e}")
        except Exception as e:
            raise Exception(f"An unexpected error occurred while starting terminal session: {e}")
        return container.id

    def start_with_github(self, github_link: str, image_id: str = "python:latest") -> tuple:
        """
        Start a container and create a new branch in the specified GitHub repository.
        
        :param github_link: Full GitHub repository link (e.g., 'https://github.com/owner/repo').
        :param image_id: ID of the Docker image to use for the container (default 'python:latest').
        :return: A tuple containing the container ID and the branch name.
        """        
        github_link = github_link.lower()
        # Generate a new branch name
        branches = self.github.get_branch_names(github_link)
        swarm_id = swarm_id_var.get()
        branch_name = self._generate_branch_name(branches, f"{swarm_id}")
        self.github.create_branch(github_link, branch_name)

        # Start a container with the specified image
        try:
            container: Container = self.client.containers.run(image_id,
                                                              command=["/bin/bash"],
                                                              detach=True,
                                                              tty=True,
                                                              working_dir="/repo")
        except docker.errors.ImageNotFound:
            raise ValueError(f"Image with ID {image_id} not found.")
        except docker.errors.APIError as e:
            raise ConnectionError(f"Failed to start terminal session due to Docker API error: {e}")
        except Exception as e:
            raise Exception(f"An unexpected error occurred while starting terminal session: {e}")

        commands = [
            f"git clone -b main {github_link} /repo",
            f"cd /repo && git checkout -b {branch_name}"
        ]

        outputs = self.send_commands(container.id, commands)
        for output in outputs:
            print(output)

        return container.id, branch_name


    def send_commands(self, container_id: str, commands: list) -> list:
        """Execute a list of commands in the specified Docker container and return their outputs."""
        outputs = []
        container: Container = self.client.containers.get(container_id)
        for command in commands:
            try:
                # Execute command within the /repo directory after ensuring it exists
                full_command = f"cd /repo && {command}"
                exit_code, output = container.exec_run(cmd=["bash", "-c", full_command], workdir="/repo")

                output_decoded = output.decode('utf-8').strip()
                if exit_code != 0:
                    outputs.append(f"Error: Command '{full_command}' failed with exit code {exit_code}. Output: {output_decoded}")
                else:
                    outputs.append(output_decoded)
            except docker.errors.NotFound:
                raise ValueError(f"Container with ID {container_id} not found.")
            except docker.errors.APIError as e:
                raise ConnectionError(f"Failed to send command due to Docker API error: {e}")
            except Exception as e:
                raise Exception(f"An unexpected error occurred while sending command '{command}': {e}")
        return outputs


    def close(self, container_id: str) -> None:
        try:
            container: Container = self.client.containers.get(container_id)
            container.stop()
            container.remove()
        except docker.errors.NotFound:
            raise ValueError(f"Container with ID {container_id} not found.")
        except docker.errors.APIError as e:
            raise ConnectionError(f"Failed to close terminal session due to Docker API error: {e}")
        except Exception as e:
            raise Exception(f"An unexpected error occurred while closing terminal session: {e}")


    def _generate_branch_name(self, branches, prefix):
        """ Generate a new branch name based on existing branches and a prefix """
        i = 0
        while f"{i}_{prefix}" in branches:
            i += 1
        return f"{i}_{prefix}"
