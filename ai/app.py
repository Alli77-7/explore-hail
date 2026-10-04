import os
import sys
from typing import Optional
from fastapi import FastAPI, File, UploadFile, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

try:
    from ai.engine.translator import ThamudicTranslator
except ImportError:
    from engine.translator import ThamudicTranslator

app = FastAPI(
    title="Explore Hail - AI Inscription Translation Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

translator = ThamudicTranslator()
demo_dir = os.path.join(current_dir, "demo")
test_images_dir = os.path.join(current_dir, "data", "test_images")

if os.path.exists(demo_dir):
    app.mount("/demo", StaticFiles(directory=demo_dir, html=True), name="demo")

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "explore-hail-ai",
        "docs": "/docs"
    }

@app.get("/api/ai/health")
def health():
    return {"status": "healthy", "ready": True}

@app.get("/api/ai/samples")
def get_samples():
    samples = translator.recognizer.known_inscriptions
    results = []
    for s in samples:
        results.append({
            "id": s["id"],
            "filename": s["filename"],
            "site_name_ar": s["site_name_ar"],
            "site_name_en": s["site_name_en"],
            "unesco_site": s["unesco_site"],
            "inscription_type": s["inscription_type"],
            "transliteration": s["transliteration"],
            "translation_ar": s["translation_ar"],
            "translation_en": s["translation_en"]
        })
    return {"samples": results, "count": len(results)}

@app.get("/api/ai/sample-image/{filename}")
def get_sample_image(filename: str):
    filepath = os.path.join(test_images_dir, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(filepath, media_type="image/png")

@app.post("/api/ai/translate")
async def translate_inscription(
    file: UploadFile = File(...),
    filename_hint: Optional[str] = Query(None)
):
    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty file")
        hint = filename_hint or file.filename
        result = translator.process_and_translate(content, filename_hint=hint)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
