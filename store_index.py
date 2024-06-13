from IPython import embed
from src.helper import load_pdf, text_splitter, download_embedding
from langchain_pinecone import PineconeVectorStore
from dotenv import load_dotenv

load_dotenv()

# Load the data
pdf_data = load_pdf("data/")

# Split the text into smaller chunks
split_text = text_splitter(pdf_data)

# Download the embedding model
embeddings = download_embedding()


# Create and store embeddings
index_name = "medical-chatbot"
# vectorstore = PineconeVectorStore.from_documents(split_text, embeddings, index_name = index_name)

# print('\n',vectorstore.similarity_search("What is the treatment for Diabetes?"))

# For using the embedding that are already created.
# vectorstore = PineconeVectorStore(embedding = embeddings, index_name = index_name)