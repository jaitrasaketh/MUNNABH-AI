import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import nibabel as nib

class CNNService:
    def __init__(self):
        self.xray_model = None
        self.mri_model = None

    def load_models(self):
        self.xray_model = load_model('./backend/model/chest_model.h5')
        # self.mri_model = load_model('./backend/model/brats_model.h5', custom_objects={'soft_dice_loss': self.soft_dice_loss, 'dice_coefficient': self.dice_coefficient})

    @staticmethod
    def dice_coefficient(y_true, y_pred, smooth=1):
        y_true_f = tf.cast(tf.reshape(y_true, [-1]), dtype=tf.float32)
        y_pred_f = tf.cast(tf.reshape(y_pred, [-1]), dtype=tf.float32)
        intersection = tf.reduce_sum(y_true_f * y_pred_f)
        return (2. * intersection + smooth) / (tf.reduce_sum(y_true_f) + tf.reduce_sum(y_pred_f) + smooth)

    @staticmethod
    def soft_dice_loss(y_true, y_pred):
        return 1 - CNNService.dice_coefficient(y_true, y_pred)

    def classify_xray(self, image):
        image = tf.image.resize(image, [224, 224])
        image = np.expand_dims(image, axis=0) / 255.0
        predictions = self.xray_model.predict(image)
        return predictions

    def segment_mri(self, image):
        prediction = self.mri_model.predict(image)
        return prediction