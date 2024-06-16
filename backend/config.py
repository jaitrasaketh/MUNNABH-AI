from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    MISTRAL_API_KEY = os.getenv('MISTRAL_API_KEY')
    PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
    MODEL_PATH = "backend/model/phi-2.Q4_0.gguf"