import key_params
from pymongo import MongoClient
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import MongoDBAtlasVectorSearch
from langchain.document_loaders import DirectoryLoader
from lanchain.llms import OpenAI
from langchain.chains import RetrievalQA
import gradio as gr
from gradio.themes.base import Base

client = MongoClient(key_params.mongo_uri)
dbName = "langchain_demo"
collectionName = "collection_of_text_blobs"
collection = client[dbName][collectionName]

loader = DirectoryLoader("./sample_files",glob="./*.txt", show_progress=True)
data = loader.load()

embeddings = OpenAIEmbeddings(openai_api_key=key_params.openai_api_key)

vector_store = MongoDBAtlasVectorSearch.from_documents(data, embeddings, collection=collection)    







