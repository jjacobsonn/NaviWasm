from PIL import Image
import os

# Create a 16x16 black image
img = Image.new('RGB', (16, 16), color='black')

# Ensure static directory exists
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)

# Save as ICO
img.save(os.path.join(static_dir, "favicon.ico")) 