import os
import io
import numpy as np
from PIL import Image, ImageOps, ImageFilter

class InscriptionPreprocessor:
    def __init__(self, target_size=(800, 500)):
        self.target_size = target_size

    def load_image(self, image_source):
        if isinstance(image_source, Image.Image):
            return image_source.convert("RGB")
        elif isinstance(image_source, (bytes, bytearray)):
            return Image.open(io.BytesIO(image_source)).convert("RGB")
        elif isinstance(image_source, str):
            if not os.path.exists(image_source):
                raise FileNotFoundError(f"Image not found: {image_source}")
            return Image.open(image_source).convert("RGB")
        else:
            raise ValueError("Unsupported image source")

    def enhance_contrast(self, gray_img):
        arr = np.array(gray_img, dtype=np.float32)
        min_val, max_val = np.percentile(arr, (2, 98))
        if max_val > min_val:
            arr = np.clip((arr - min_val) / (max_val - min_val) * 255.0, 0, 255)
        enhanced = Image.fromarray(arr.astype(np.uint8))
        return ImageOps.autocontrast(enhanced, cutoff=2)

    def denoise(self, gray_img):
        return gray_img.filter(ImageFilter.MedianFilter(size=3))

    def binarize(self, gray_img):
        arr = np.array(gray_img)
        hist, _ = np.histogram(arr, bins=256, range=(0, 256))
        total = arr.size
        curr_max, threshold = 0, 128
        sum_total = np.dot(np.arange(256), hist)
        sum_back, weight_back = 0.0, 0.0

        for t in range(256):
            weight_back += hist[t]
            if weight_back == 0:
                continue
            weight_fore = total - weight_back
            if weight_fore == 0:
                break
            sum_back += t * hist[t]
            mean_back = sum_back / weight_back
            mean_fore = (sum_total - sum_back) / weight_fore
            variance = weight_back * weight_fore * ((mean_back - mean_fore) ** 2)
            if variance > curr_max:
                curr_max = variance
                threshold = t

        binary_arr = np.where(arr < threshold, 255, 0).astype(np.uint8)
        return Image.fromarray(binary_arr), threshold

    def detect_regions(self, binary_img):
        arr = np.array(binary_img)
        h, w = arr.shape
        h_proj = np.sum(arr, axis=1) / 255.0
        line_mask = h_proj > (np.max(h_proj) * 0.25)
        y_indices = np.where(line_mask)[0]

        if len(y_indices) > 0:
            top_y = max(0, y_indices[0] - 15)
            bottom_y = min(h, y_indices[-1] + 15)
        else:
            top_y, bottom_y = int(h * 0.2), int(h * 0.8)

        sub_arr = arr[top_y:bottom_y, :]
        v_proj = np.sum(sub_arr, axis=0) / 255.0
        glyph_mask = v_proj > (np.max(v_proj) * 0.15) if np.max(v_proj) > 0 else np.zeros(w, dtype=bool)

        boxes = []
        in_glyph = False
        start_x = 0

        for x in range(w):
            if glyph_mask[x] and not in_glyph:
                in_glyph = True
                start_x = x
            elif not glyph_mask[x] and in_glyph:
                in_glyph = False
                bw = x - start_x
                if bw >= 10:
                    boxes.append((start_x, top_y, bw, bottom_y - top_y))

        if in_glyph and (w - start_x >= 10):
            boxes.append((start_x, top_y, w - start_x, bottom_y - top_y))

        return sorted(boxes, key=lambda b: b[0])

    def process(self, image_source):
        rgb_img = self.load_image(image_source)
        gray = rgb_img.convert("L")
        denoised = self.denoise(gray)
        enhanced = self.enhance_contrast(denoised)
        binary, threshold = self.binarize(enhanced)
        boxes = self.detect_regions(binary)

        roughness = float(np.std(np.array(gray)))
        clarity = max(0.5, min(0.99, 1.0 - (roughness / 255.0)))

        return {
            "original_size": rgb_img.size,
            "enhanced_image": enhanced,
            "binary_image": binary,
            "threshold_used": int(threshold),
            "glyph_boxes": boxes,
            "glyph_count": len(boxes),
            "estimated_clarity": round(clarity, 3)
        }
