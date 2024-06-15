from .config import Config
from .src.helper import download_embedding
from langchain_pinecone import PineconeVectorStore
# from langchain_community.llms import LlamaCpp
# from langchain_core.prompts import ChatPromptTemplate
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain.chains import create_retrieval_chain
from .src.prompt_templates import *

from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

class LLMService:
    # def __init__(self):
        # self.embeddings = download_embedding()
        # self.vectorstore = PineconeVectorStore(embedding=self.embeddings, index_name="medical-chatbot")
        # self.retriever = self.vectorstore.as_retriever()
        # self.prompt = ChatPromptTemplate.from_messages([("system", diagnosis.template), ("human", "{input}")])
        # self.llm = LlamaCpp(model_path=Config.MODEL_PATH, temperature=0.01, n_ctx=512, n_predict=100, top_p=0.9, n_keep=150)
        # self.question_answer_chain = create_stuff_documents_chain(self.llm, self.prompt)
        # self.chain = create_retrieval_chain(self.retriever, self.question_answer_chain)
    def __init__(self):
        self.embeddings = download_embedding()
        self.vectorstore = PineconeVectorStore(embedding=self.embeddings, index_name="medical-chatbot")
        self.prompt = diagnosis.template # default template

    # def handle_query(self, query_input):
    #     result = self.chain.invoke({"input": query_input})
    #     return result

    def vector_search(self, query):
        return self.vectorstore.similarity_search(query)
         

    def change_prompt_template(self, template_name):
        templates = {
            "diagnosis": diagnosis.template,
            "prognosis": prognosis.template,
            "ask": ask.template
        }
        if template_name in templates:
            self.prompt = templates[template_name]
        else:
            raise ValueError(f"Template {template_name} not found")

    def get_prompt_template(self):
        return self.prompt

    @staticmethod
    def get_mistral(user_message, model="mistral-large-latest", is_json=False):
        client = MistralClient(api_key="Tbn8jaY00qC3zjedAVmwnuIwPsGb004j")
        messages = [ChatMessage(role="user", content=user_message)]

        if is_json:
            chat_response = client.chat(
                model=model, messages=messages, response_format={"type": "json_object"}
            )
        else:
            chat_response = client.chat(model=model, messages=messages)

        return chat_response.choices[0].message.content