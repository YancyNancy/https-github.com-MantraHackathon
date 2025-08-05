from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

from video_processor import process_video  # your processing function

app = FastAPI()

# Enable CORS for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change "*" to your frontend URL for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files (images, etc.) - adjust paths if needed
app.mount("/static", StaticFiles(directory="../static"), name="static")

# Optionally serve frontend files via backend
app.mount("/frontend", StaticFiles(directory="../frontend"), name="frontend")

@app.get("/")
def serve_frontend():
    # Serve your frontend index.html when visiting root
    return FileResponse("../frontend/index.html")

@app.post("/upload/")
async def upload_video(file: UploadFile = File(...)):
    file_location = f"temp_{file.filename}"
    try:
        with open(file_location, "wb") as f:
            f.write(await file.read())

        # Process the video and get summary
        summary = process_video(file_location)

    finally:
        # Clean up uploaded temp file
        if os.path.exists(file_location):
            os.remove(file_location)

    return JSONResponse(content={"summary": summary})
