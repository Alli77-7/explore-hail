import torch
import torch.nn as nn
from torchvision.models import resnet18, ResNet18_Weights


def create_model(num_classes):
    device = torch.device(
        "cuda" if torch.cuda.is_available() else "cpu"
    )

    model = resnet18(
        weights=ResNet18_Weights.DEFAULT
    )

    model.fc = nn.Linear(
        model.fc.in_features,
        num_classes
    )

    model = model.to(device)

    return model, device