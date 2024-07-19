from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse

app = FastAPI()  # This creates a new FastAPI app

@app.post("/uploadfile/")  # This sets up a POST endpoint to upload files
async def upload_file(file: UploadFile = File(...)):
    file_location = f"files/{file.filename}"  # Define where to save the file
    with open(file_location, "wb+") as file_object:  # Open the file for writing
        file_object.write(file.file.read())  # Write the uploaded file to the location
    return JSONResponse(content={"filename": file.filename, "location": file_location})  # Return the file info
