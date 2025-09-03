import os
import shutil
import random

def split_dataset(input_dir, output_dir, train_ratio=0.8, seed=42):
    random.seed(seed)

    # Create train and val folders
    for split in ["train", "val"]:
        os.makedirs(os.path.join(output_dir, split), exist_ok=True)

    # Loop through each class folder
    for class_name in os.listdir(input_dir):
        class_path = os.path.join(input_dir, class_name)
        if not os.path.isdir(class_path):
            continue

        # Only take image files
        images = [f for f in os.listdir(class_path)
                  if os.path.isfile(os.path.join(class_path, f)) and f.lower().endswith((".jpg", ".jpeg", ".png"))]

        random.shuffle(images)
        split_idx = int(len(images) * train_ratio)
        train_images = images[:split_idx]
        val_images = images[split_idx:]

        # Train class folder
        train_class_dir = os.path.join(output_dir, "train", class_name)
        os.makedirs(train_class_dir, exist_ok=True)
        for img in train_images:
            shutil.copy(os.path.join(class_path, img), os.path.join(train_class_dir, img))

        # Val class folder
        val_class_dir = os.path.join(output_dir, "val", class_name)
        os.makedirs(val_class_dir, exist_ok=True)
        for img in val_images:
            shutil.copy(os.path.join(class_path, img), os.path.join(val_class_dir, img))

        print(f"✅ {class_name}: {len(train_images)} train, {len(val_images)} val")

    print(f"\nDataset split complete → {output_dir}")


if __name__ == "__main__":
    input_path = "./data"        # 👈 where your original dataset is
    output_path = "./data_split" # 👈 new folder for train/val
    split_dataset(input_path, output_path, train_ratio=0.8)
