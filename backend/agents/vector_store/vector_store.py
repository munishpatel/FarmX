from typing import List, Tuple, Dict, Any
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
import logging
import torch

class VectorStore:
    def __init__(self):
        self.logger = logging.getLogger("vector_store")
        try:
            # Check if CUDA is available
            device = "cuda" if torch.cuda.is_available() else "cpu"
            self.logger.info(f"Using device: {device}")
            
            # Initialize the model with error handling
            try:
                self.model = SentenceTransformer('all-MiniLM-L6-v2', device=device)
                self.logger.info("Successfully loaded sentence transformer model")
            except Exception as e:
                self.logger.error(f"Error loading sentence transformer model: {str(e)}")
                raise
                
            # Initialize FAISS index
            self.dimension = self.model.get_sentence_embedding_dimension()
            self.index = faiss.IndexFlatL2(self.dimension)
            self.documents: List[Dict[str, Any]] = []
            self.logger.info("Successfully initialized FAISS index")
            
        except Exception as e:
            self.logger.error(f"Error initializing vector store: {str(e)}")
            raise
            
    def add_documents(self, documents: List[Dict[str, Any]]) -> None:
        """Add documents to the vector store"""
        try:
            if not documents:
                return
                
            # Extract text from documents
            texts = [doc.get("text", "") for doc in documents]
            
            # Generate embeddings
            embeddings = self.model.encode(texts, show_progress_bar=False)
            
            # Add to FAISS index
            self.index.add(np.array(embeddings).astype('float32'))
            
            # Store documents
            self.documents.extend(documents)
            
            self.logger.info(f"Successfully added {len(documents)} documents to vector store")
            
        except Exception as e:
            self.logger.error(f"Error adding documents to vector store: {str(e)}")
            raise
            
    def search(self, query: str, k: int = 5) -> List[Dict[str, Any]]:
        """Search for similar documents"""
        try:
            # Generate query embedding
            query_embedding = self.model.encode([query], show_progress_bar=False)
            
            # Search in FAISS index
            distances, indices = self.index.search(
                np.array(query_embedding).astype('float32'), k
            )
            
            # Return matching documents
            results = []
            for idx, distance in zip(indices[0], distances[0]):
                if idx < len(self.documents):
                    doc = self.documents[idx].copy()
                    doc["score"] = float(1 / (1 + distance))  # Convert distance to similarity score
                    results.append(doc)
                    
            return results
            
        except Exception as e:
            self.logger.error(f"Error searching vector store: {str(e)}")
            raise
            
    def clear(self) -> None:
        """Clear the vector store"""
        try:
            self.index = faiss.IndexFlatL2(self.dimension)
            self.documents = []
            self.logger.info("Successfully cleared vector store")
            
        except Exception as e:
            self.logger.error(f"Error clearing vector store: {str(e)}")
            raise
        
    async def get_query_vector(self, query: str) -> np.ndarray:
        """Convert a query string to a vector"""
        return self.model.encode([query])[0]
        
    async def get_capability_vector(self, capabilities: Dict[str, Any]) -> np.ndarray:
        """Convert agent capabilities to a vector"""
        # Convert capabilities to a descriptive string
        description = f"{capabilities['name']} capabilities: {', '.join(capabilities['capabilities'])}"
        return self.model.encode([description])[0]
        
    async def add_vector(self, vector: np.ndarray, metadata: Dict[str, Any]) -> None:
        """Add a vector and its metadata to the store"""
        if self.index is None:
            await self.initialize()
            
        self.index.add(np.array([vector]).astype('float32'))
        self.vectors.append(vector)
        self.metadata.append(metadata)
        
    async def find_similar_vectors(
        self,
        query_vector: np.ndarray,
        vectors: List[Tuple[Any, np.ndarray]],
        top_k: int = 5
    ) -> List[Tuple[Any, float]]:
        """Find the most similar vectors to a query vector"""
        if not vectors:
            return []
            
        # Convert vectors to numpy array
        vector_array = np.array([v for _, v in vectors]).astype('float32')
        
        # Calculate cosine similarity
        similarities = np.dot(vector_array, query_vector) / (
            np.linalg.norm(vector_array, axis=1) * np.linalg.norm(query_vector)
        )
        
        # Get top k results
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        return [(vectors[i][0], similarities[i]) for i in top_indices]
        
    async def cleanup(self) -> None:
        """Cleanup resources"""
        self.index = None
        self.vectors = []
        self.metadata = [] 