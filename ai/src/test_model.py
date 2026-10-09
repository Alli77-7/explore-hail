from model import create_model

model, device = create_model(28)

print("Model loaded successfully")
print("Device:", device)
print("Output classes:", model.fc.out_features)