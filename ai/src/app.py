import os
import tempfile

from fastapi import FastAPI, UploadFile, File, HTTPException

from .predict import predict_image


app = FastAPI(
    title="Explore Hail AI API",
    version="1.0"
)


@app.get("/")
def health_check():
    return {
        "status": "running",
        "service": "Explore Hail AI"
    }


@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/bmp"
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid image type"
        )

    suffix = os.path.splitext(
        file.filename or ""
    )[1]

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_file:

            temp_file.write(
                await file.read()
            )

            temp_path = temp_file.name

        result = predict_image(
            temp_path
        )

        return {
            "success": True,
            "prediction": result
        }

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)