from abc import ABC, abstractmethod

class ContainerManagement(ABC):
    """
    What is the ContainerManagement abstract class?
    
    Swarmstar need an easy way to create an environment and have terminal sessions.
    
    This class defines a simple interface for swarmstar. Create a container,
    send commands and close it.

    For now we'll use docker locally, but in the future we can extend this 
    to run docker on a remote machine and scale.
    """
    
    @abstractmethod
    def start(self, github_link: str, image_id: str) -> str:
        """
        Create a container with the project and start a terminal session.

        :param github_link: The link to the github repository.
        :param image_id: The id of the image to use for the container.
        :return: The id of the container.
        """
        pass

    @abstractmethod
    def send_commands(self, container_id: str, command: str) -> str:
        """
        Send a command to the container and return the output.

        :param container_id: The id of the container.
        :param command: The command to send to the container.
        :return: The output of the command.
        """
        pass

    @abstractmethod
    def close(self, container_id: str) -> None:
        """
        Close the terminal session and the container
        
        :param container_id: The id of the container.
        """
        pass
