# Thamudic alphabet mappings
THAMUDIC_ALPHABET = {
    "ʾ": {"arabic": "أ", "name": "Alif", "unicode": "𐪀", "stroke": "vertical_with_hook"},
    "b": {"arabic": "ب", "name": "Ba", "unicode": "𐪁", "stroke": "bracket_square"},
    "g": {"arabic": "ج", "name": "Jim", "unicode": "𐪂", "stroke": "curved_hook"},
    "d": {"arabic": "د", "name": "Dal", "unicode": "𐪃", "stroke": "delta_triangle"},
    "h": {"arabic": "هـ", "name": "Ha", "unicode": "𐪄", "stroke": "trident_horizontal_bars"},
    "w": {"arabic": "و", "name": "Waw", "unicode": "𐪅", "stroke": "circle_on_stem"},
    "z": {"arabic": "ز", "name": "Zayn", "unicode": "𐪆", "stroke": "vertical_crossbar"},
    "ḥ": {"arabic": "ح", "name": "Hha", "unicode": "𐪇", "stroke": "spiral_loop"},
    "ṭ": {"arabic": "ط", "name": "Ta_heavy", "unicode": "𐪈", "stroke": "cross_in_circle"},
    "y": {"arabic": "ي", "name": "Ya", "unicode": "𐪉", "stroke": "double_vertical_connected"},
    "k": {"arabic": "ك", "name": "Kaf", "unicode": "𐪊", "stroke": "palm_branch"},
    "l": {"arabic": "ل", "name": "Lam", "unicode": "𐪋", "stroke": "vertical_hook"},
    "m": {"arabic": "م", "name": "Meem", "unicode": "𐪌", "stroke": "wave_zigzag"},
    "n": {"arabic": "ن", "name": "Nun", "unicode": "𐪍", "stroke": "vertical_lightning"},
    "s": {"arabic": "س", "name": "Seen", "unicode": "𐪎", "stroke": "ladder_comb"},
    "ʿ": {"arabic": "ع", "name": "Ayn", "unicode": "𐪏", "stroke": "circle_eye"},
    "f": {"arabic": "ف", "name": "Fa", "unicode": "𐪐", "stroke": "rhombus_diamond"},
    "ṣ": {"arabic": "ص", "name": "Sad", "unicode": "𐪑", "stroke": "rayed_circle"},
    "q": {"arabic": "ق", "name": "Qaf", "unicode": "𐪒", "stroke": "circle_bisected"},
    "r": {"arabic": "ر", "name": "Ra", "unicode": "𐪓", "stroke": "open_crescent"},
    "š": {"arabic": "ش", "name": "Shin", "unicode": "𐪔", "stroke": "three_prongs"},
    "t": {"arabic": "ت", "name": "Taa", "unicode": "𐪕", "stroke": "plus_cross"},
    "ṯ": {"arabic": "ث", "name": "Thaa", "unicode": "𐪖", "stroke": "diagonal_cross"},
    "ḫ": {"arabic": "خ", "name": "Kha", "unicode": "𐪗", "stroke": "circle_crossed"},
    "ḏ": {"arabic": "ذ", "name": "Dhal", "unicode": "𐪘", "stroke": "triangle_stem"},
    "ḍ": {"arabic": "ض", "name": "Dad", "unicode": "𐪙", "stroke": "fork_stem"},
    "ẓ": {"arabic": "ظ", "name": "Zaa", "unicode": "𐪚", "stroke": "bow_arrow"},
    "ġ": {"arabic": "غ", "name": "Ghayn", "unicode": "𐪛", "stroke": "curved_hook_dot"},
}

def get_glyph_info(char):
    return THAMUDIC_ALPHABET.get(char, {
        "arabic": char,
        "name": "Unknown",
        "unicode": "𐪀",
        "stroke": "line"
    })

def thamudic_to_arabic(translit_str):
    tokens = translit_str.split()
    return " ".join([THAMUDIC_ALPHABET.get(t, {}).get("arabic", t) for t in tokens])
