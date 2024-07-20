from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to the domains you want to allow
    allow_credentials=True,
    allow_methods=["*"],  # Adjust this to the HTTP methods you want to allow
    allow_headers=["*"],  # Adjust this to the headers you want to allow
)

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
    return JSONResponse(content={"filename": file.filename, "location": file_location})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
