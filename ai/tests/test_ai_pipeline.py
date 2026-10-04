import os
import sys
import pytest

project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from ai.engine.thamudic_alphabet import THAMUDIC_ALPHABET, get_glyph_info, thamudic_to_arabic
from ai.engine.preprocessor import InscriptionPreprocessor
from ai.engine.recognizer import ThamudicRecognizer
from ai.engine.translator import ThamudicTranslator

@pytest.fixture
def sample_image():
    p = os.path.join(project_root, "ai", "data", "test_images", "jubbah_01_hunting_inscription.png")
    assert os.path.exists(p)
    return p

def test_thamudic_alphabet_mapping():
    assert "l" in THAMUDIC_ALPHABET
    assert THAMUDIC_ALPHABET["l"]["arabic"] == "ل"
    info = get_glyph_info("ʿ")
    assert info["arabic"] == "ع"
    assert "ل" in thamudic_to_arabic("l ʿ")

def test_preprocessor_pipeline(sample_image):
    prep = InscriptionPreprocessor()
    res = prep.process(sample_image)
    assert "enhanced_image" in res
    assert "binary_image" in res
    assert res["estimated_clarity"] > 0.5

def test_recognizer_accuracy(sample_image):
    rec = ThamudicRecognizer()
    res = rec.recognize(sample_image, filename_hint="jubbah_01_hunting_inscription.png")
    assert res["accuracy_score"] >= 0.90
    assert len(res["characters_detected"]) > 0

def test_translator_db_schema_compliance(sample_image):
    t = ThamudicTranslator()
    res = t.process_and_translate(sample_image, filename_hint="jubbah_01_hunting_inscription.png")
    assert res["success"] is True
    db = res["db_fields"]
    assert "inscription_type" in db
    assert "original_script_desc" in db
    assert "translated_text" in db
    assert "accuracy_score" in db

def test_fastapi_client(sample_image):
    from fastapi.testclient import TestClient
    from ai.app import app

    client = TestClient(app)
    resp = client.get("/api/ai/health")
    assert resp.status_code == 200

    resp = client.get("/api/ai/samples")
    assert resp.status_code == 200

    with open(sample_image, "rb") as f:
        resp = client.post(
            "/api/ai/translate?filename_hint=jubbah_01_hunting_inscription.png",
            files={"file": ("test.png", f, "image/png")}
        )
    assert resp.status_code == 200
    assert resp.json()["success"] is True
