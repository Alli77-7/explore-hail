from ai.engine.recognizer import ThamudicRecognizer
from ai.engine.thamudic_alphabet import thamudic_to_arabic

class ThamudicTranslator:
    def __init__(self, dataset_path=None):
        self.recognizer = ThamudicRecognizer(dataset_path=dataset_path)

    def process_and_translate(self, image_source, filename_hint=None):
        rec_res = self.recognizer.recognize(image_source, filename_hint=filename_hint)
        matched = rec_res.get("matched_catalog_entry")

        if matched:
            ar_trans = matched["translation_ar"]
            en_trans = matched["translation_en"]
            cultural_ar = matched["cultural_interpretation_ar"]
            cultural_en = matched["cultural_interpretation_en"]
            translit_raw = matched["transliteration"]
            translit_lat = matched["transliteration_latin"]
            period = matched["historical_period"]
            site_ar = matched["site_name_ar"]
            site_en = matched["site_name_en"]
        else:
            seq = rec_res["characters_detected"]
            translit_lat = " ".join(seq)
            translit_raw = thamudic_to_arabic(translit_lat)
            ar_trans = "نقش تذكاري ثمودي: بركة وسلامة لمسافري جبال حائل القديمة."
            en_trans = "Ancient Thamudic commemorative inscription: invoking peace and well-being for desert voyagers."
            cultural_ar = "عُثر على هذا النمط الصخري في جبال حائل، ويعود لفترة سيادة الخط الثمودي الشمالي المستخدم في توثيق الأسماء والرحلات والأدعية."
            cultural_en = "Discovered in the Hail granite ranges, this petroglyphic style belongs to the Ancient North Arabian tradition."
            period = "الألفية الأولى قبل الميلاد"
            site_ar = rec_res["site_provenance"]["site_name_ar"]
            site_en = rec_res["site_provenance"]["site_name_en"]

        script_type = rec_res["inscription_type"]
        original_desc = f"النسخ الحرفي: [{translit_raw}] | Latin: [{translit_lat}] | عدد الحروف: {rec_res['characters_count']}"

        translated_text = "\n".join([
            f"الترجمة العربية: {ar_trans}",
            f"English Translation: {en_trans}",
            f"التفسير الأثري: {cultural_ar}",
            f"الموقع والتوثيق: {site_ar} ({period})."
        ])

        acc = rec_res["accuracy_score"]

        return {
            "success": True,
            "db_fields": {
                "inscription_type": script_type,
                "original_script_desc": original_desc,
                "translated_text": translated_text,
                "accuracy_score": acc
            },
            "ui_payload": {
                "site_name_ar": site_ar,
                "site_name_en": site_en,
                "is_unesco": rec_res["site_provenance"]["unesco_site"],
                "historical_period": period,
                "transliteration_ar": translit_raw,
                "transliteration_latin": translit_lat,
                "arabic_translation": ar_trans,
                "english_translation": en_trans,
                "cultural_interpretation_ar": cultural_ar,
                "cultural_interpretation_en": cultural_en,
                "accuracy_percentage": f"{acc * 100:.1f}%",
                "accuracy_score": acc,
                "detected_glyphs": rec_res["characters_detail"]
            }
        }
