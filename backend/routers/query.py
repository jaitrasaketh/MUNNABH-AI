from fastapi import status, HTTPException, APIRouter
from .. import schemas
from ..service.llm_service import LLMService
import requests

# To load the CNN models
from fastapi import UploadFile, File
from fastapi.responses import JSONResponse
import tensorflow as tf
from ..service.cnn_service import CNNService

router = APIRouter()

cnn_service = CNNService()
cnn_service.load_models()

router = APIRouter(prefix="/query", tags=["query"])
llm_service = LLMService()

def extract_values(data):
    result = []
    for key, entries in data.items():
        for entry in entries:
            result.append(f"{key}: {entry['value']}")
    return '\n'.join(result)

def get_google_fit_data():
    url = "https://v1.nocodeapi.com/unlimited_power/fit/UAmylmNVsVXkcjWT/aggregatesDatasets?dataTypeName=steps_count,active_minutes,calories_expended,heart_minutes,sleep_segment,weight"
    params = {}
    r = requests.get(url=url, params=params)
    formatted_string = extract_values(r.json())
    return formatted_string

@router.post("/message", status_code=status.HTTP_201_CREATED)
def chat(query: schemas.Query):
    similar_docs = llm_service.vector_search(query.query)
    template = llm_service.get_prompt_template()
    google_fit_data = get_google_fit_data()
    formatted_template = template.format(similar_docs=similar_docs, query=query.query)  
    formatted_template += google_fit_data
    result = llm_service.get_mistral(formatted_template)
    return {"output": result}

@router.post("/classify_xray")
async def classify_xray(file: UploadFile = File(...)):
    contents = await file.read()
    image = tf.image.decode_image(contents, channels=3)
    predictions = cnn_service.classify_xray(image)
    labels = ['Cardiomegaly', 'Emphysema', 'Effusion', 'Hernia',
            'Infiltration', 'Mass', 'Nodule', 'Atelectasis',
            'Pneumothorax', 'Pleural_Thickening', 'Pneumonia',
            'Fibrosis', 'Edema', 'Consolidation']
    result = {label: float(pred) for label, pred in zip(labels, predictions[0])}
    return JSONResponse(content=result)


@router.post("/select/{template_name}", status_code=status.HTTP_200_OK)
def select_template(template_name: str):
    try:
        llm_service.change_prompt_template(template_name)
        return {"message": f"Prompt template changed to {template_name}"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))