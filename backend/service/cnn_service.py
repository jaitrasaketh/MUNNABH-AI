import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np

class CNNService:
    def __init__(self):
        self.xray_model = None
        self.mri_model = None

    def load_models(self):
        self.xray_model = load_model('./backend/model/chest_model.h5')

    def classify_xray(self, image):
        image = tf.image.resize(image, [224, 224])
        image = np.expand_dims(image, axis=0) / 255.0
        predictions = self.xray_model.predict(image)
        return predictions
