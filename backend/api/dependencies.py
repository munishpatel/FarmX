from fastapi import Depends
from ..agents.orchestrator.agent_orchestrator import AgentOrchestrator
import os
from dotenv import load_dotenv

load_dotenv()

# Global orchestrator instance
_orchestrator = None

async def get_orchestrator() -> AgentOrchestrator:
    """
    Get or create the AI orchestrator instance
    """
    global _orchestrator
    
    if _orchestrator is None:
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
            
        _orchestrator = AgentOrchestrator(openai_api_key)
        
    return _orchestrator 