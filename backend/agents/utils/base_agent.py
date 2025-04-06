from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
import logging

class BaseAgent(ABC):
    def __init__(self, name: str, config: Optional[Dict[str, Any]] = None):
        self.name = name
        self.config = config or {}
        self.logger = logging.getLogger(f"agent.{name}")
        
    @abstractmethod
    async def initialize(self) -> None:
        """Initialize the agent with necessary resources"""
        pass
    
    @abstractmethod
    async def process(self, input_data: Any) -> Any:
        """Process the input data and return results"""
        pass
    
    @abstractmethod
    async def cleanup(self) -> None:
        """Cleanup resources when the agent is done"""
        pass
    
    def get_capabilities(self) -> Dict[str, Any]:
        """Return the capabilities of the agent"""
        return {
            "name": self.name,
            "capabilities": self.config.get("capabilities", [])
        }
    
    async def validate_input(self, input_data: Any) -> bool:
        """Validate the input data before processing"""
        return True
    
    async def handle_error(self, error: Exception) -> Dict[str, Any]:
        """Handle any errors that occur during processing"""
        self.logger.error(f"Error in {self.name}: {str(error)}")
        return {
            "status": "error",
            "agent": self.name,
            "error": str(error)
        } 