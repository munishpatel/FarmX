import asyncio
import logging
from orchestrator.agent_orchestrator import AgentOrchestrator
from data_sources.web_scraper_agent import WebScraperAgent
from ml_models.sentiment_analyzer_agent import SentimentAnalyzerAgent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def main():
    # Initialize orchestrator
    orchestrator = AgentOrchestrator()
    
    try:
        # Initialize and register agents
        web_scraper = WebScraperAgent({
            "capabilities": ["web_scraping", "html_parsing"],
            "selectors": {
                "reviews": ".review-content",
                "ratings": ".rating"
            }
        })
        
        sentiment_analyzer = SentimentAnalyzerAgent({
            "capabilities": ["sentiment_analysis", "aspect_analysis"],
            "aspects": {
                "service": ["service", "staff", "crew", "attendant"],
                "comfort": ["seat", "comfort", "legroom", "space"],
                "food": ["food", "meal", "dinner", "breakfast"],
                "value": ["price", "cost", "expensive", "cheap"]
            }
        })
        
        await orchestrator.register_agent(web_scraper)
        await orchestrator.register_agent(sentiment_analyzer)
        
        # Example query
        query = "Analyze customer reviews from British Airways website"
        
        # Process query
        result = await orchestrator.process_query(query, {
            "url": "https://www.airlinequality.com/airline-reviews/british-airways",
            "max_pages": 5
        })
        
        # Print results
        logger.info("Query Results:")
        logger.info(result)
        
    except Exception as e:
        logger.error(f"Error in main: {str(e)}")
    finally:
        # Cleanup
        await orchestrator.cleanup()

if __name__ == "__main__":
    asyncio.run(main()) 