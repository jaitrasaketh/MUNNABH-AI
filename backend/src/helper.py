from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader # For loading documents
from langchain.text_splitter import RecursiveCharacterTextSplitter # For splitting text (corpus) into smaller chunks
from langchain_huggingface import HuggingFaceEmbeddings # For downloading the embedding model

# Extract data from the PDF
def load_pdf(data):
    loader = DirectoryLoader(data,
                    glob = "*.pdf",
                    loader_cls = PyPDFLoader)
    
    documents = loader.load()
    return documents

# Split the text into smaller chunks
def text_splitter(data):
    splitter = RecursiveCharacterTextSplitter(chunk_size = 500, chunk_overlap = 20)
    split_data = splitter.split_documents(data)
    return split_data


# Donwload embedding model
def download_embedding():
    embeddings = HuggingFaceEmbeddings(model_name = "sentence-transformers/paraphrase-MiniLM-L6-v2")
    return embeddings

