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
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv


warnings.filterwarnings("ignore")
load_dotenv(".env")

global vector_index
vector_index = None

GOOGLE_API_KEY=os.environ.get('GOOGLE_GEMINI_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)

model = ChatGoogleGenerativeAI(model="gemini-pro",google_api_key=GOOGLE_API_KEY,
                                temperature=0.6,convert_system_message_to_human=True)


def update_db(doc_path):
    global vector_index
    pdf_loader = PyPDFLoader(doc_path)
    pages = pdf_loader.load_and_split()
    context = "\n\n".join(str(page.page_content) for page in pages)
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=5000, chunk_overlap=800)
    texts = text_splitter.split_text(context)
    
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001",google_api_key=GOOGLE_API_KEY)
    vector_index = Chroma.from_texts(texts, embeddings).as_retriever(search_kwargs={"k":5})


def run_query(query):
    global vector_index
    if not vector_index:
        return {
            "result": "The vector database is currently empty. Please add relevant documents to perform a search. Thanks for asking!",
            "source_documents": []
        }
    
    template = """ 
    You are a helpful interactive chatbot. 
    If it is a casual conversation, respond accordingly.
    Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.  
    {context}
    Question: {question}
    Helpful Answer:"""
    QA_CHAIN_PROMPT = PromptTemplate.from_template(template)
    
    qa_chain = RetrievalQA.from_chain_type( 
        model,
        retriever=vector_index,
        return_source_documents=True,
        chain_type_kwargs={"prompt": QA_CHAIN_PROMPT}
    )
    
    result = qa_chain({"query": query})
    return result

def init_db():
    for path in os.listdir("./files"):
        print(f"./files/{path}")
        update_db(f"./files/{path}")
