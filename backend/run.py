from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from model import run_query, update_db

app = FastAPI()

# orig_origins = [
#     "http://localhost",  
#     "http://localhost:8000",  
#     "https://example.com",  
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# class Item(BaseModel):
#     name: str
#     description: str = None
#     price: float
#     tax: float = None

@app.get("/")
def read_root():
    return {"Hello": "World"}, 200

@app.post("/test/")
def test_endpoint(name: str):
    return {"input": name}, 200

@app.post("/update_db/")
def update_db_endpoint(name: str):
    update_db(f"./assets/{name}")
    return {"updated_db": name}, 200

@app.post("/run_query/")
def run_query_endpoint(query: str):
    result = run_query(query)
    return result, 200



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
