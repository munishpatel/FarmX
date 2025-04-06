from typing import Dict, List, Any, Optional, Tuple, TypedDict
import asyncio
from ..utils.base_agent import BaseAgent
import logging
from ..vector_store.vector_store import VectorStore
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import JsonOutputParser
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from langchain.tools import Tool
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.schema import AgentAction, AgentFinish
import json

class AgentState(TypedDict):
    messages: List[Any]
    current_agent: Optional[str]
    tools_results: List[Dict]
    final_result: Optional[Dict]

class AgentOrchestrator:
    def __init__(self, openai_api_key: str):
        self.agents: Dict[str, BaseAgent] = {}
        self.logger = logging.getLogger("orchestrator")
        self.llm = ChatOpenAI(
            model="gpt-4-turbo-preview",
            temperature=0,
            openai_api_key=openai_api_key
        )
        
        # Initialize vector store with error handling
        try:
            self.vector_store = VectorStore()
            self.logger.info("Successfully initialized vector store")
        except Exception as e:
            self.logger.error(f"Error initializing vector store: {str(e)}")
            self.vector_store = None
            
        self.workflow = self._create_workflow()
        
    def _create_workflow(self) -> StateGraph:
        """Create the LangGraph workflow for agent orchestration"""
        # Create the workflow graph
        workflow = StateGraph(AgentState)
        
        # Define the nodes
        def route_to_agent(state: AgentState) -> Dict[str, Any]:
            """Route to appropriate agent based on query"""
            messages = state["messages"]
            last_message = messages[-1].content if messages else ""
            
            # Use LLM to determine which agent to use
            routing_prompt = ChatPromptTemplate.from_messages([
                ("system", """You are an expert at routing queries to the appropriate agent.
                Available agents:
                - data_collector: Collects farming data from various sources
                - soil_analyzer: Analyzes soil conditions and provides recommendations
                - weather_analyzer: Analyzes weather patterns and provides forecasts
                - crop_recommender: Recommends crops based on conditions
                - sustainability_advisor: Provides sustainable farming practices
                
                Respond with just the agent name."""),
                ("human", "{query}")
            ])
            
            response = self.llm.invoke(routing_prompt.format_messages(query=last_message))
            agent_name = response.content.strip()
            
            # Update state with selected agent
            state["current_agent"] = agent_name
            return state
            
        async def execute_agent(state: AgentState) -> AgentState:
            """Execute the selected agent"""
            agent_name = state["current_agent"]
            if agent_name not in self.agents:
                state["messages"].append(AIMessage(content=f"Error: Agent {agent_name} not found"))
                return state
                
            agent = self.agents[agent_name]
            result = await agent.process(state["messages"][-1].content)
            
            state["tools_results"].append({
                "agent": agent_name,
                "result": result
            })
            
            return state
            
        def should_continue(state: AgentState) -> Dict[str, Any]:
            """Determine if we need more agents or can finish"""
            if len(state["tools_results"]) >= 3:  # Limit to 3 agents per query
                return {"next": "end"}
            return {"next": "continue"}
            
        def generate_final_response(state: AgentState) -> AgentState:
            """Generate final response using all agent results"""
            final_prompt = ChatPromptTemplate.from_messages([
                ("system", """You are an expert sustainable farming advisor.
                Analyze the results from various agents and provide comprehensive advice
                for sustainable farming practices."""),
                ("human", "Query: {query}"),
                ("human", "Results: {results}")
            ])
            
            results_str = json.dumps(state["tools_results"], indent=2)
            response = self.llm.invoke(final_prompt.format_messages(
                query=state["messages"][-1].content,
                results=results_str
            ))
            
            state["final_result"] = {
                "response": response.content,
                "sources": state["tools_results"]
            }
            
            return state
            
        # Add nodes to the graph
        workflow.add_node("route", route_to_agent)
        workflow.add_node("execute", execute_agent)
        workflow.add_node("decide", should_continue)
        workflow.add_node("finalize", generate_final_response)
        
        # Add edges
        workflow.add_edge("route", "execute")
        workflow.add_edge("execute", "decide")
        workflow.add_conditional_edges(
            "decide",
            lambda x: x["next"],
            {
                "continue": "route",
                "end": "finalize"
            }
        )
        
        # Set entry point
        workflow.set_entry_point("route")
        
        return workflow.compile()
        
    async def process_query(self, query: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Process a user query using the LangGraph workflow"""
        try:
            # Initialize state
            initial_state: AgentState = {
                "messages": [HumanMessage(content=query)],
                "current_agent": None,
                "tools_results": [],
                "final_result": None
            }
            
            # Run the workflow
            final_state = await self.workflow.ainvoke(initial_state)
            
            return {
                "status": "success",
                "result": final_state["final_result"]
            }
            
        except Exception as e:
            self.logger.error(f"Error processing query: {str(e)}")
            return {
                "status": "error",
                "error": str(e)
            }
            
    async def register_agent(self, agent: BaseAgent) -> None:
        """Register a new agent with the orchestrator"""
        await agent.initialize()
        self.agents[agent.name] = agent
        self.logger.info(f"Registered agent: {agent.name}")
        
    async def unregister_agent(self, agent_name: str) -> None:
        """Unregister an agent from the orchestrator"""
        if agent_name in self.agents:
            await self.agents[agent_name].cleanup()
            del self.agents[agent_name]
            self.logger.info(f"Unregistered agent: {agent_name}")
            
    async def cleanup(self) -> None:
        """Cleanup resources"""
        for agent in self.agents.values():
            await agent.cleanup()
        self.agents.clear() 