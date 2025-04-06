import sys
import os
import asyncio
from agents.orchestrator.agent_orchestrator import AgentOrchestrator
from agents.test.test_agent import TestAgent  # Adjust import if needed

async def main(prompt):
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        print("Missing OPENAI_API_KEY", file=sys.stderr)
        sys.exit(1)

    orchestrator = AgentOrchestrator(openai_api_key)

    agents = [
        TestAgent("data_collector", "Collects farming data"),
        TestAgent("soil_analyzer", "Analyzes soil conditions"),
        TestAgent("weather_analyzer", "Analyzes weather patterns"),
        TestAgent("crop_recommender", "Recommends crops"),
        TestAgent("sustainability_advisor", "Provides sustainable farming advice"),
    ]

    for agent in agents:
        await orchestrator.register_agent(agent)

    try:
        result = await orchestrator.process_query(prompt)
        print(result)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Prompt is required", file=sys.stderr)
        sys.exit(1)
    prompt = sys.argv[1]
    asyncio.run(main(prompt))
