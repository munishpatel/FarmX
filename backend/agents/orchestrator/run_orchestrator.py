import asyncio
import sys
import json
import os
from dotenv import load_dotenv
from agents.utils.basic_query_agent import BasicQueryAgent

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from agents.orchestrator.agent_orchestrator import AgentOrchestrator

async def main():
    # Load environment variables
    load_dotenv()
    
    # Get OpenAI API key
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        print(json.dumps({"error": "OPENAI_API_KEY environment variable is not set"}))
        sys.exit(1)
    
    try:
        # Get query from command line arguments
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No query provided"}))
            sys.exit(1)
            
        query = sys.argv[1]
        
        # Initialize orchestrator
        orchestrator = AgentOrchestrator(openai_api_key)
        
        # Register specialized agents
        await orchestrator.register_agent(SoilAnalyzerAgent("soil_analyzer", openai_api_key))
        await orchestrator.register_agent(WeatherAnalyzerAgent("weather_analyzer", openai_api_key))
        await orchestrator.register_agent(CropRecommenderAgent("crop_recommender", openai_api_key))
        await orchestrator.register_agent(SustainabilityAdvisorAgent("sustainability_advisor", openai_api_key))
        await orchestrator.register_agent(DataCollectorAgent("data_collector", openai_api_key))
        
        # Create and register the basic query agent
        basic_agent = BasicQueryAgent("basic_query_agent", openai_api_key)
        await orchestrator.register_agent(basic_agent)
        
        # Process query
        result = await orchestrator.process_query(query)
        
        # Print result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main()) 