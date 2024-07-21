from http.client import HTTPException
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import os

from model import run_query, update_db, init_db

app = FastAPI()

FILES_DIR = "files/"

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

# @app.post("/update_db/")
# def update_db_endpoint(name: str):
#     update_db(f"./files/{name}")
#     return {"updated_db": name}, 200

# @app.post("/run_query/")
# def run_query_endpoint(query: str):
#     result = run_query(query)
#     return result, 200

class QueryRequest(BaseModel):
    query: str
    
@app.post("/run_query/")
def run_query_endpoint(request: QueryRequest):
    try:
        result = run_query(request.query)
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'pdf', 'docx', 'ppt'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.post("/uploadfile/")
async def upload_file(file: UploadFile = File(...)):
    if not os.path.exists("files"):
        os.makedirs("files")

    file_location = f"files/{file.filename}"
    
    if not allowed_file(file.filename):
        return JSONResponse({"error": "Invalid File Format"}), 400
    
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
    
    update_db(file_location)
    return {"updated_db": file.filename}, 200 
    # return JSONResponse(content={"filename": file.filename, "location": file_location})

@app.get("/getFiles/")
async def get_files():
    files = os.listdir(FILES_DIR)
    return {"files": files}

@app.delete("/deletefile/{filename}")
async def delete_file(filename: str):
    file_location = f"{FILES_DIR}{filename}"
    if os.path.exists(file_location):
        os.remove(file_location)
        return {"message": "File deleted"}
    else:
        raise HTTPException(status_code=404, detail="File not found")

if __name__ == "__main__":
    init_db()
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
    

