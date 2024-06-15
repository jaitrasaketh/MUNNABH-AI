from llm_service import LLMService
import os

# os.environ['PINECONE_API_KEY'] = "d0ccc28f-3d45-4cff-989a-ff83b043add8"

llm_service = LLMService()

result = llm_service.handle_query("What is acne?")