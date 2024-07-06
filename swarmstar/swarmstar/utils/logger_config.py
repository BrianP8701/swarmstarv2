import logging
from dotenv import load_dotenv
import os

def setup_logging():
    load_dotenv()
    LOGGING_FILE_PATH = os.getenv("LOGGING_FILE_PATH")

    if LOGGING_FILE_PATH is None:
        raise ValueError("LOGGING_FILE_PATH is not set in the .env file")

    logging.basicConfig(
        filename=LOGGING_FILE_PATH,  # Log file name
        level=logging.INFO,  # Log level
        format='%(asctime)s - %(levelname)s - %(message)s',  # Log format
        datefmt='%Y-%m-%d %H:%M:%S'  # Date format
    )

    class CustomFileHandler(logging.FileHandler):
        def emit(self, record):
            super().emit(record)
            self.stream.write('\n\n')  # Add two new lines
            self.flush()

    # Replace the default handler with the custom handler
    for handler in logging.getLogger().handlers:
        if isinstance(handler, logging.FileHandler):
            logging.getLogger().removeHandler(handler)

    logging.getLogger().addHandler(CustomFileHandler(LOGGING_FILE_PATH))
