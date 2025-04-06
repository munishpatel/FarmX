from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from ..dependencies import get_orchestrator
from ...agents.orchestrator.agent_orchestrator import AgentOrchestrator
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/query")
async def process_ai_query(
    query: Dict[str, str],
    orchestrator: AgentOrchestrator = Depends(get_orchestrator)
) -> Dict[str, Any]:
    """
    Process a query using the AI orchestrator
    """
    try:
        if not query.get("text"):
            raise HTTPException(status_code=400, detail="Query text is required")
            
        result = await orchestrator.process_query(query["text"])
        return result
        
    except Exception as e:
        logger.error(f"Error processing AI query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 