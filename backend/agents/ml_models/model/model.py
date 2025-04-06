import torch
from torchvision import transforms
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
import json
import os

# Define model (same as in notebook)
class DoubleConv(torch.nn.Module):
    def __init__(self, in_ch, out_ch):
        super().__init__()
        self.double_conv = torch.nn.Sequential(
            torch.nn.Conv2d(in_ch, out_ch, kernel_size=3, padding=1),
            torch.nn.ReLU(inplace=True),
            torch.nn.Conv2d(out_ch, out_ch, kernel_size=3, padding=1),
            torch.nn.ReLU(inplace=True)
        )

    def forward(self, x):
        return self.double_conv(x)

class UNet(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.down1 = DoubleConv(3, 64)
        self.pool1 = torch.nn.MaxPool2d(2)
        self.down2 = DoubleConv(64, 128)
        self.pool2 = torch.nn.MaxPool2d(2)
        self.bottleneck = DoubleConv(128, 256)
        self.up2 = torch.nn.ConvTranspose2d(256, 128, kernel_size=2, stride=2)
        self.dec2 = DoubleConv(256, 128)
        self.up1 = torch.nn.ConvTranspose2d(128, 64, kernel_size=2, stride=2)
        self.dec1 = DoubleConv(128, 64)
        self.final_conv = torch.nn.Conv2d(64, 1, kernel_size=1)

    def forward(self, x):
        d1 = self.down1(x)
        d2 = self.down2(self.pool1(d1))
        b = self.bottleneck(self.pool2(d2))
        u2 = self.up2(b)
        dc2 = self.dec2(torch.cat([u2, d2], dim=1))
        u1 = self.up1(dc2)
        dc1 = self.dec1(torch.cat([u1, d1], dim=1))
        return self.final_conv(dc1)

def run_inference(img_path, model_weights="unet_model.pth"):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    # Load and transform image
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor()
    ])
    image = Image.open(img_path).convert("RGB")
    input_tensor = transform(image).unsqueeze(0).to(device)

    # Load model and weights
    model = UNet().to(device)
    model.load_state_dict(torch.load(model_weights, map_location=device))
    model.eval()

    with torch.no_grad():
        output = model(input_tensor)
        pred_mask = torch.sigmoid(output).squeeze().cpu().numpy()
        pred_mask_bin = (pred_mask > 0.5).astype(np.uint8)

    # === Pixel Quantification ===
    total_pixels = pred_mask_bin.size
    diseased_pixels = np.sum(pred_mask_bin == 1)
    healthy_pixels = total_pixels - diseased_pixels
    disease_percent = (diseased_pixels / total_pixels) * 100
    disease_type = ""
    result = {"disease_type": disease_type,
              "disease_percentage": round(disease_percent, 2)}
    return json.dumps(result)


run_inference("raw_image.png")
