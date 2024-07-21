import time
from tqdm import tqdm
from IPython.display import display
from IPython.display import Markdown
import textwrap
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
import os

import urllib
import warnings
from pathlib import Path as p
from pprint import pprint

import pandas as pd
from langchain import PromptTemplate
from langchain.chains.question_answering import load_qa_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

from langchain_community.document_loaders import UnstructuredPowerPointLoader, Docx2txtLoader
from langchain.document_loaders import PyPDFLoader


warnings.filterwarnings("ignore")
load_dotenv(".env")


GOOGLE_API_KEY=os.environ.get('GOOGLE_GEMINI_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)

model = ChatGoogleGenerativeAI(model="gemini-pro",google_api_key=GOOGLE_API_KEY,
                                temperature=0.9,convert_system_message_to_human=True)

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001",google_api_key=GOOGLE_API_KEY)

global chroma_db
chroma_db = Chroma(persist_directory="data", 
                    embedding_function=embeddings,
                    collection_name="lc_chroma_demo")

collection = chroma_db.get()['ids']
if len(collection):
    chroma_db.delete(ids=collection)


def load_document(file_path: str):
    file_ext = os.path.splitext(file_path)[1].lower()
    
    if file_ext == '.pptx':
        loader = UnstructuredPowerPointLoader(file_path)
        data = loader.load()
    
    elif file_ext == '.docx':
        loader = Docx2txtLoader(file_path)
        data = loader.load()
    
    elif file_ext == '.pdf':
        loader = PyPDFLoader(file_path)
        data = loader.load()
    
    else:
        raise ValueError("Unsupported file type. Please use '.pptx', '.docx', or '.pdf'.")
    
    return data


def update_db():
    global chroma_db
    docs = []

    for path in os.listdir("./files"):
        doc_path = f"./files/{path}"
        data = load_document(doc_path)
        
        doc_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
        docs.extend(doc_splitter.split_documents(data))
    
    if len(docs):
        chroma_db = Chroma.from_documents(
            documents=docs, 
            embedding=embeddings, 
            persist_directory="data",
            collection_name="lc_chroma_demo"
        )
        
        chroma_db.persist()


def run_query(query: str):
    if len(chroma_db.get()['ids']) == 0:
        return {
            "result": "The vector database is currently empty. Please add relevant documents to perform a search. Thanks for asking!",
            "source_documents": []
        }
    
    template = """ 
    You are a helpful interactive chatbot. 
    If it is a casual conversation, respond accordingly.
    Use the following pieces of document to answer the question at the end. If you don't know the answer, give a relavant answer. 
    {context}
    Question: {question}
    Helpful Answer:"""
    QA_CHAIN_PROMPT = PromptTemplate.from_template(template)
    
    qa_chain = RetrievalQA.from_chain_type(
        model,
        chain_type="stuff",
        retriever=chroma_db.as_retriever(),
        return_source_documents=True,
        chain_type_kwargs={"prompt": QA_CHAIN_PROMPT}
    )
    
    result = qa_chain({"query": query})
    return result

update_db()