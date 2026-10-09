from pathlib import Path

import numpy as np
import torch

from PIL import Image, ImageFile
from torch.utils.data import Dataset
from torch.utils.data.sampler import WeightedRandomSampler
from sklearn.model_selection import train_test_split


ImageFile.LOAD_TRUNCATED_IMAGES = True

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp"}


class ThamudicDataset(Dataset):
    def __init__(
        self,
        file_paths,
        labels,
        label_to_idx,
        transform=None,
        preprocess=None
    ):
        self.file_paths = file_paths
        self.labels = labels
        self.label_to_idx = label_to_idx
        self.transform = transform
        self.preprocess = preprocess

    def __len__(self):
        return len(self.file_paths)

    def __getitem__(self, idx):
        image = Image.open(
            self.file_paths[idx]
        ).convert("RGB")

        label = self.labels[idx]
        label_idx = self.label_to_idx[label]

        if self.preprocess:
            image = self.preprocess(image)

        if self.transform:
            image = self.transform(image)

        return image, label_idx


def load_dataset(data_dir):
    data_dir = Path(data_dir)

    file_paths = []
    labels = []

    classes = sorted([
        folder.name
        for folder in data_dir.iterdir()
        if folder.is_dir()
    ])

    for class_name in classes:
        class_dir = data_dir / class_name

        for image_path in class_dir.iterdir():
            if image_path.suffix.lower() in ALLOWED_EXTENSIONS:
                file_paths.append(str(image_path))
                labels.append(class_name)

    file_paths = np.array(file_paths)
    labels = np.array(labels)

    label_to_idx = {
        label: idx
        for idx, label in enumerate(classes)
    }

    return file_paths, labels, classes, label_to_idx


def split_dataset(file_paths, labels):
    train_paths, test_paths, train_labels, test_labels = (
        train_test_split(
            file_paths,
            labels,
            test_size=0.20,
            stratify=labels,
            random_state=42
        )
    )

    train_paths, val_paths, train_labels, val_labels = (
        train_test_split(
            train_paths,
            train_labels,
            test_size=0.10,
            stratify=train_labels,
            random_state=42
        )
    )

    return (
        train_paths,
        val_paths,
        test_paths,
        train_labels,
        val_labels,
        test_labels
    )


def create_sampler(labels):
    unique_labels, counts = np.unique(
        labels,
        return_counts=True
    )

    class_weights = {
        label: 1.0 / count
        for label, count in zip(unique_labels, counts)
    }

    sample_weights = [
        class_weights[label]
        for label in labels
    ]

    sample_weights = torch.DoubleTensor(
        sample_weights
    )

    return WeightedRandomSampler(
        sample_weights,
        len(sample_weights)
    )