# Explore Hail AI Module

AI module for recognizing Thamudic characters using PyTorch and ResNet-18.

## Structure

- `src/model.py` - Creates the ResNet-18 model.
- `src/preprocess.py` - Preprocesses and prepares images.
- `src/dataset.py` - Loads and splits the dataset.
- `src/train.py` - Trains the model.
- `src/evaluate.py` - Evaluates model performance.
- `src/predict.py` - Predicts a Thamudic character from an image.
- `src/app.py` - FastAPI service for AI predictions.
- `src/check_environment.py` - Checks PyTorch and device configuration.
- `src/test_model.py` - Tests model initialization.

## Model

- Architecture: ResNet-18
- Framework: PyTorch
- Optimizer: Adam
- Learning Rate: 0.0001
- Batch Size: 64
- Epochs: 20

## API

Run the AI API:

```bash
python -m uvicorn src.app:app --reload
