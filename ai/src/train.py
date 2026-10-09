from pathlib import Path

import torch
import torch.nn as nn
from torch.utils.data import DataLoader

from dataset import (
    ThamudicDataset,
    load_dataset,
    split_dataset,
    create_sampler
)

from preprocess import (
    preprocess_image,
    train_transforms,
    eval_transforms
)

from model import create_model


DATA_DIR = Path(r"D:\Thamudic_classes_CH4_test")
BATCH_SIZE = 64
LEARNING_RATE = 0.0001
NUM_EPOCHS = 20


def train_model(
    model,
    train_loader,
    val_loader,
    criterion,
    optimizer,
    device,
    num_epochs
):
    best_val_loss = float("inf")

    for epoch in range(num_epochs):

        model.train()

        train_correct = 0
        train_total = 0

        for images, labels in train_loader:

            images = images.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()

            outputs = model(images)

            loss = criterion(outputs, labels)

            loss.backward()
            optimizer.step()

            _, predictions = torch.max(outputs, 1)

            train_total += labels.size(0)
            train_correct += (
                predictions == labels
            ).sum().item()

        train_accuracy = train_correct / train_total

        model.eval()

        val_loss = 0.0
        val_correct = 0
        val_total = 0

        with torch.no_grad():

            for images, labels in val_loader:

                images = images.to(device)
                labels = labels.to(device)

                outputs = model(images)

                loss = criterion(outputs, labels)

                val_loss += loss.item()

                _, predictions = torch.max(outputs, 1)

                val_total += labels.size(0)
                val_correct += (
                    predictions == labels
                ).sum().item()

        val_accuracy = val_correct / val_total

        print(
            f"Epoch {epoch + 1}/{num_epochs} | "
            f"Train Accuracy: {train_accuracy:.4f} | "
            f"Val Accuracy: {val_accuracy:.4f}"
        )

        if val_loss < best_val_loss:

            best_val_loss = val_loss

            torch.save(
                model.state_dict(),
                "models/resnet18_best.pth"
            )

            print("Best model saved")


def main():

    file_paths, labels, classes, label_to_idx = load_dataset(
        DATA_DIR
    )

    print("Classes:", classes)
    print("Number of classes:", len(classes))
    print("Number of images:", len(file_paths))

    (
        train_paths,
        val_paths,
        test_paths,
        train_labels,
        val_labels,
        test_labels
    ) = split_dataset(file_paths, labels)

    train_dataset = ThamudicDataset(
        train_paths,
        train_labels,
        label_to_idx,
        transform=train_transforms,
        preprocess=preprocess_image
    )

    val_dataset = ThamudicDataset(
        val_paths,
        val_labels,
        label_to_idx,
        transform=eval_transforms,
        preprocess=preprocess_image
    )

    train_sampler = create_sampler(train_labels)

    train_loader = DataLoader(
        train_dataset,
        batch_size=BATCH_SIZE,
        sampler=train_sampler
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False
    )

    model, device = create_model(
        num_classes=len(classes)
    )

    criterion = nn.CrossEntropyLoss()

    optimizer = torch.optim.Adam(
        model.parameters(),
        lr=LEARNING_RATE,
        weight_decay=0.0001
    )

    print("ResNet-18 ready")
    print("Device:", device)
    print("Classes:", len(classes))
    print("Batch size:", BATCH_SIZE)
    print("Learning rate:", LEARNING_RATE)
    print("Epochs:", NUM_EPOCHS)

    train_model(
        model=model,
        train_loader=train_loader,
        val_loader=val_loader,
        criterion=criterion,
        optimizer=optimizer,
        device=device,
        num_epochs=NUM_EPOCHS
    )


if __name__ == "__main__":
    main()