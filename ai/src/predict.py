from pathlib import Path

import torch
from PIL import Image

from .model import create_model
from .preprocess import (
    preprocess_image,
    eval_transforms
)


BASE_DIR = Path(__file__).resolve().parents[1]

DATA_DIR = BASE_DIR / "dataset" / "letters"
MODEL_PATH = BASE_DIR / "models" / "resnet18_best.pth"


def get_classes():
    classes = sorted([
        folder.name
        for folder in DATA_DIR.iterdir()
        if folder.is_dir()
    ])

    return classes


def predict_image(image_path):

    classes = get_classes()

    if not classes:
        raise ValueError(
            "No classes found in dataset/letters"
        )

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model not found: {MODEL_PATH}"
        )

    model, device = create_model(
        num_classes=len(classes)
    )

    model.load_state_dict(
        torch.load(
            MODEL_PATH,
            map_location=device
        )
    )

    model.eval()

    image = Image.open(
        image_path
    ).convert("RGB")

    image = preprocess_image(image)

    image = eval_transforms(image)

    image = image.unsqueeze(0)

    image = image.to(device)

    with torch.no_grad():

        outputs = model(image)

        probabilities = torch.softmax(
            outputs,
            dim=1
        )

        confidence, predicted_index = torch.max(
            probabilities,
            1
        )

    predicted_class = classes[
        predicted_index.item()
    ]

    confidence = confidence.item() * 100

    return {
        "class": predicted_class,
        "confidence": round(
            confidence,
            2
        )
    }


if __name__ == "__main__":

    image_path = input(
        "Enter image path: "
    )

    result = predict_image(
        image_path
    )

    print("\nPrediction Result")
    print("-----------------")
    print(
        "Class:",
        result["class"]
    )
    print(
        "Confidence:",
        f'{result["confidence"]}%'
    )