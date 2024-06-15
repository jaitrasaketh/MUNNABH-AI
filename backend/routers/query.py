from re import template
from fastapi import FastAPI, Response, status, HTTPException, APIRouter, Depends
from .. import schemas
from ..llm_service import LLMService

router = APIRouter(prefix="/query", tags=["query"])
llm_service = LLMService()

@router.post("/message", status_code=status.HTTP_201_CREATED)
def chat(query: schemas.Query):
    similar_docs = llm_service.vector_search(query.query)
    template = llm_service.get_prompt_template()
    formatted_template = template.format(similar_docs=similar_docs, query=query.query)  
    result = llm_service.get_mistral(formatted_template)
    return {"output": result}

# Placeholder for image upload route
@router.post("/upload_image")
def upload_image(): ...

@router.post("/select/{template_name}", status_code=status.HTTP_200_OK)
def select_template(template_name: str):
    try:
        llm_service.change_prompt_template(template_name)
        return {"message": f"Prompt template changed to {template_name}"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))