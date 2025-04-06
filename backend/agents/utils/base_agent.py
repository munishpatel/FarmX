from typing import Dict, List, Any, Optional
from agents.utils.base_agent import BaseAgent
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

class BasicQueryAgent(BaseAgent):
    """Agent for handling simple, general farming queries without specialized processing."""
    
    def __init__(self, name: str, openai_api_key: str):
        super().__init__(name)
        self.llm = ChatOpenAI(
            model="gpt-3.5-turbo",  # Using a smaller model for efficiency
            temperature=0,
            openai_api_key=openai_api_key
        )
        
    async def initialize(self) -> None:
        """Initialize the agent."""
        self.initialized = True
        return
        
    async def process(self, query: str) -> Dict[str, Any]:
        """
        Process a simple farming query and provide a direct response.
        
        Returns:
            Dict with:
            - status: "success" or "error"
            - result: The response to the query
        """
        try:
            # Process the query with a farming-focused prompt
            answer_prompt = ChatPromptTemplate.from_messages([
                ("system", """You are a knowledgeable farming assistant with general knowledge about sustainable 
                agriculture, common farming practices, and basic crop information.
                
                Provide helpful, concise answers to general farming questions. If the query requires 
                specialized agricultural expertise beyond general knowledge, still provide the best 
                answer you can based on general principles.
                """),
                ("human", "{query}")
            ])
            
            response = self.llm.invoke(answer_prompt.format_messages(query=query))
            
            return {
                "status": "success",
                "result": response.content
            }
                
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }
    
    async def cleanup(self) -> None:
        """Cleanup resources."""
        self.initialized = False
        return