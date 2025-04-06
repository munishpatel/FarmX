import asyncio
import logging
import os
from dotenv import load_dotenv
from ..orchestrator.agent_orchestrator import AgentOrchestrator
from .test_agent import TestAgent

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Load environment variables
load_dotenv()

async def main():
    # Get OpenAI API key
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
        
    # Initialize orchestrator
    orchestrator = AgentOrchestrator(openai_api_key)
    
    try:
        # Register test agents
        agents = [
            TestAgent("data_collector", "Collects farming data"),
            TestAgent("soil_analyzer", "Analyzes soil conditions"),
            TestAgent("weather_analyzer", "Analyzes weather patterns"),
            TestAgent("crop_recommender", "Recommends crops"),
            TestAgent("sustainability_advisor", "Provides sustainable farming advice")
        ]
        
        for agent in agents:
            await orchestrator.register_agent(agent)
            
        # Test queries
        test_queries = [
            "What's the current soil condition in my field?",
            "What's the weather forecast for next week?",
            "What crops should I plant this season?",
            "How can I make my farming more sustainable?"
        ]
        
        # Process each query
        for query in test_queries:
            try:
                result = await orchestrator.process_query(query)
                logging.info(f"Query: {query}")
                logging.info(f"Result: {result}")
            except Exception as e:
                logging.error(f"Error processing query: {str(e)}")
                
    finally:
        # Cleanup
        await orchestrator.cleanup()
        
if __name__ == "__main__":
    asyncio.run(main()) 