from typing import Any, Dict
from ..utils.base_agent import BaseAgent
import logging

class TestAgent(BaseAgent):
    def __init__(self, name: str, config: Dict[str, Any] = None):
        super().__init__(name, config)
        self.logger = logging.getLogger(f"test_agent.{name}")
        
    async def initialize(self) -> None:
        """Initialize the test agent"""
        self.logger.info(f"Initializing test agent: {self.name}")
        
    async def process(self, input_data: str) -> Dict[str, Any]:
        """Process input and return test response"""
        self.logger.info(f"Processing input in {self.name}: {input_data}")
        return {
            "status": "success",
            "agent": self.name,
            "response": f"Test response from {self.name} for query: {input_data}",
            "confidence": 0.95
        }
        
    async def cleanup(self) -> None:
        """Cleanup resources"""
        self.logger.info(f"Cleaning up test agent: {self.name}") 