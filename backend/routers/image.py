from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import tensorflow as tf
from ..cnn_service import CNNService

router = APIRouter()

cnn_service = CNNService()
cnn_service.load_models()

@router.post("/image-upload")
def upload_image(file: UploadFile = File(...)):
    return {"filename": file.filename}

@router.post("/classify_xray")
async def classify_xray(file: UploadFile = File(...)):
    contents = await file.read()
    image = tf.image.decode_image(contents, channels=3)
    predictions = cnn_service.classify_xray(image)
    labels = ['Cardiomegaly', 'Emphysema', 'Effusion', 'Hernia', 'Infiltration', 'Mass', 'Nodule', 'Atelectasis', 'Pneumothorax', 'Pleural_Thickening', 'Pneumonia', 'Fibrosis', 'Edema', 'Consolidation']
    result = {label: float(pred) for label, pred in zip(labels, predictions[0])}
    return JSONResponse(content=result)