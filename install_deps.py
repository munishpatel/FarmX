import subprocess
import sys
import os

def install_package(package):
    """Install a package using pip"""
    print(f"Installing {package}...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

def main():
    """Install dependencies in the correct order"""
    # Upgrade pip first
    print("Upgrading pip...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "pip"])
    
    # Install core dependencies first
    core_deps = [
        "numpy>=1.24.0",
        "pandas>=2.0.0",
        "scikit-learn>=1.3.0",
        "torch>=2.1.0"
    ]
    
    for dep in core_deps:
        install_package(dep)
    
    # Install LangChain dependencies
    langchain_deps = [
        "langchain-core>=0.1.0",
        "langchain>=0.1.0",
        "langchain-openai>=0.0.2",
        "langgraph>=0.0.10",
        "openai>=1.0.0"
    ]
    
    for dep in langchain_deps:
        install_package(dep)
    
    # Install remaining dependencies
    remaining_deps = [
        "beautifulsoup4>=4.12.0",
        "requests>=2.31.0",
        "aiohttp>=3.9.0",
        "textblob>=0.17.1",
        "nltk>=3.8.1",
        "sentence-transformers>=2.2.2",
        "transformers>=4.36.0",
        "matplotlib>=3.8.0",
        "seaborn>=0.13.0",
        "plotly>=5.18.0",
        "wordcloud>=1.9.3",
        "faiss-cpu>=1.7.4",
        "python-dotenv>=1.0.0"
    ]
    
    for dep in remaining_deps:
        install_package(dep)
    
    print("All dependencies installed successfully!")

if __name__ == "__main__":
    main() 