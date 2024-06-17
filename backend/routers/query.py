from fastapi import status, HTTPException, APIRouter
from .. import schemas
from ..llm_service import LLMService

# To load the CNN models
from fastapi import UploadFile, File
from fastapi.responses import JSONResponse
import tensorflow as tf
from ..cnn_service import CNNService
import nibabel as nib
import numpy as np

router = APIRouter()

cnn_service = CNNService()
cnn_service.load_models()

router = APIRouter(prefix="/query", tags=["query"])
llm_service = LLMService()

@router.post("/message", status_code=status.HTTP_201_CREATED)
def chat(query: schemas.Query):
    similar_docs = llm_service.vector_search(query.query)
    template = llm_service.get_prompt_template()
    formatted_template = template.format(similar_docs=similar_docs, query=query.query)  
    result = llm_service.get_mistral(formatted_template)
    return {"output": result}

@router.post("/classify_xray")
async def classify_xray(file: UploadFile = File(...)):
    contents = await file.read()
    image = tf.image.decode_image(contents, channels=3)
    predictions = cnn_service.classify_xray(image)
    labels = ['Cardiomegaly', 'Emphysema', 'Effusion', 'Hernia', 'Infiltration', 'Mass', 'Nodule', 'Atelectasis', 'Pneumothorax', 'Pleural_Thickening', 'Pneumonia', 'Fibrosis', 'Edema', 'Consolidation']
    result = {label: float(pred) for label, pred in zip(labels, predictions[0])}
    return JSONResponse(content=result)

@router.post("/segment_mri/")
async def segment_mri(file: UploadFile = File(...)):
    contents = await file.read()
    with open("temp_image.nii", "wb") as f:
        f.write(contents)
    
    image_nifty_file = "temp_image.nii"
    image = np.array(nib.load(image_nifty_file).get_fdata())
    image = np.expand_dims(image, axis=-1)
    image = np.expand_dims(image, axis=0)
    
    prediction = cnn_service.segment_mri(image)
    result = prediction[0]  # Convert this to appropriate response format

    return JSONResponse(content={"segmentation_result": result.tolist()})

@router.post("/select/{template_name}", status_code=status.HTTP_200_OK)
def select_template(template_name: str):
    try:
        llm_service.change_prompt_template(template_name)
        return {"message": f"Prompt template changed to {template_name}"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))