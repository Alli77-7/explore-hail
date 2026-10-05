from pathlib import Path

import torch
from torch.utils.data import DataLoader
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report
)

from dataset import (
    ThamudicDataset,
    load_dataset,
    split_dataset
)

from preprocess import (
    preprocess_image,
    eval_transforms
)

from model import create_model


DATA_DIR = Path("dataset/letters")
MODEL_PATH = Path("models/resnet18_best.pth")
BATCH_SIZE = 64


def main():

    file_paths, labels, classes, label_to_idx = load_dataset(
        DATA_DIR
    )

    (
        train_paths,
        val_paths,
        test_paths,
        train_labels,
        val_labels,
        test_labels
    ) = split_dataset(file_paths, labels)

    test_dataset = ThamudicDataset(
        test_paths,
        test_labels,
        label_to_idx,
        transform=eval_transforms,
        preprocess=preprocess_image
    )

    test_loader = DataLoader(
        test_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False
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

    all_predictions = []
    all_labels = []

    with torch.no_grad():

        for images, labels in test_loader:

            images = images.to(device)
            labels = labels.to(device)

            outputs = model(images)

            _, predictions = torch.max(
                outputs,
                1
            )

            all_predictions.extend(
                predictions.cpu().numpy()
            )

            all_labels.extend(
                labels.cpu().numpy()
            )

    accuracy = accuracy_score(
        all_labels,
        all_predictions
    )

    precision = precision_score(
        all_labels,
        all_predictions,
        average="macro"
    )

    recall = recall_score(
        all_labels,
        all_predictions,
        average="macro"
    )

    f1 = f1_score(
        all_labels,
        all_predictions,
        average="macro"
    )

    print("Accuracy:", accuracy)
    print("Precision:", precision)
    print("Recall:", recall)
    print("F1 Score:", f1)

    print("\nClassification Report:")

    print(
        classification_report(
            all_labels,
            all_predictions,
            target_names=classes
        )
    )


if __name__ == "__main__":
    main()