from typing import Any, Dict
from textblob import TextBlob
from ..utils.base_agent import BaseAgent
import logging

class SentimentAnalyzerAgent(BaseAgent):
    def __init__(self, config: Dict[str, Any] = None):
        super().__init__("sentiment_analyzer", config)
        self.aspects = config.get("aspects", {
            "service": ["service", "staff", "crew", "attendant"],
            "comfort": ["seat", "comfort", "legroom", "space"],
            "food": ["food", "meal", "dinner", "breakfast"],
            "value": ["price", "cost", "expensive", "cheap"]
        })
        
    async def initialize(self) -> None:
        """Initialize the sentiment analyzer agent"""
        self.logger.info("Sentiment analyzer agent initialized")
        
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process text for sentiment analysis"""
        try:
            text = input_data.get("text")
            if not text:
                raise ValueError("Text is required")
                
            # Basic sentiment analysis
            blob = TextBlob(text)
            sentiment = blob.sentiment.polarity
            subjectivity = blob.sentiment.subjectivity
            
            # Aspect-based sentiment analysis
            aspect_sentiment = self._analyze_aspects(blob)
            
            return {
                "text": text,
                "overall_sentiment": sentiment,
                "subjectivity": subjectivity,
                "aspect_sentiment": aspect_sentiment,
                "status": "success"
            }
            
        except Exception as e:
            return await self.handle_error(e)
            
    def _analyze_aspects(self, blob: TextBlob) -> Dict[str, float]:
        """Analyze sentiment for different aspects"""
        aspect_sentiment = {}
        
        for aspect, keywords in self.aspects.items():
            sentences = [s for s in blob.sentences if any(k in s.lower() for k in keywords)]
            if sentences:
                aspect_sentiment[aspect] = sum(s.sentiment.polarity for s in sentences) / len(sentences)
            else:
                aspect_sentiment[aspect] = 0
                
        return aspect_sentiment
        
    async def cleanup(self) -> None:
        """Cleanup resources"""
        pass 