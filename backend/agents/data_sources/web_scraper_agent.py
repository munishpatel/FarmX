from typing import Any, Dict
import aiohttp
from bs4 import BeautifulSoup
from ..utils.base_agent import BaseAgent
import logging

class WebScraperAgent(BaseAgent):
    def __init__(self, config: Dict[str, Any] = None):
        super().__init__("web_scraper", config)
        self.session = None
        
    async def initialize(self) -> None:
        """Initialize the web scraper agent"""
        self.session = aiohttp.ClientSession()
        self.logger.info("Web scraper agent initialized")
        
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process a web scraping request"""
        try:
            url = input_data.get("url")
            if not url:
                raise ValueError("URL is required")
                
            async with self.session.get(url) as response:
                if response.status != 200:
                    raise ValueError(f"Failed to fetch URL: {response.status}")
                    
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                # Extract data based on configuration
                data = self._extract_data(soup, input_data.get("selectors", {}))
                
                return {
                    "url": url,
                    "data": data,
                    "status": "success"
                }
                
        except Exception as e:
            return await self.handle_error(e)
            
    def _extract_data(self, soup: BeautifulSoup, selectors: Dict[str, str]) -> Dict[str, Any]:
        """Extract data from HTML using provided selectors"""
        data = {}
        for key, selector in selectors.items():
            elements = soup.select(selector)
            data[key] = [elem.text.strip() for elem in elements]
        return data
        
    async def cleanup(self) -> None:
        """Cleanup resources"""
        if self.session:
            await self.session.close()
            self.session = None 