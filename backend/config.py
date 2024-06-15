from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    PINECONE_API_KEY = os.getenv('PINECONE_API_KEY')
    MODEL_PATH = "backend/model/phi-2.Q4_0.gguf"