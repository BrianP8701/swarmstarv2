# swarmstar/utils/github/wrapper.py
import os
from github import Github, GithubException, Auth
from dotenv import load_dotenv

load_dotenv()

class GitHubWrapper:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(GitHubWrapper, cls).__new__(cls)
            cls._instance.github_token = os.getenv('GITHUB_ACCESS_TOKEN')
            cls._instance.client = Github(auth=Auth.Token(cls._instance.github_token))
        return cls._instance

    def create_branch(self, github_link, branch_name, base_branch="main"):
        """
        Create a branch in a GitHub repository.

        :param github_link: Full GitHub repository link (e.g., 'https://github.com/owner/repo').
        :param branch_name: Name of the branch to create (str).
        :param base_branch: Name of the branch from which to create the new branch (default 'main').
        :return: True if the branch was created, False otherwise.
        """
        try:
            # Extract the repository name from the GitHub link
            repo_name = '/'.join(github_link.split('/')[-2:]) if '/' in github_link else github_link

            # Get the repository
            repo = self.client.get_repo(repo_name)

            # Get the SHA of the base branch
            source_branch = repo.get_branch(base_branch)
            source_sha = source_branch.commit.sha

            # Create new branch from the SHA
            repo.create_git_ref(ref=f"refs/heads/{branch_name}", sha=source_sha)
            print(f"Branch '{branch_name}' created successfully from '{base_branch}'!")
            return True
        except GithubException as e:
            print(f"Failed to create branch: {e}")
            return False

    def get_branch_names(self, github_link):
        """
        Get the names of all branches in a GitHub repository.

        :param github_link: Full GitHub repository link (e.g., 'https://github.com/owner/repo').
        :return: List of branch names (str).
        """
        try:
            # Extract the repository name from the GitHub link
            repo_name = '/'.join(github_link.split('/')[-2:]) if '/' in github_link else github_link
            repo = self.client.get_repo(repo_name)

            # Get the list of branches
            branches = [branch.name for branch in repo.get_branches()]
            return branches
        except GithubException as e:
            print(f"Failed to get branch names: {e.status}, {e.data}")
            return []
