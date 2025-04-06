import subprocess
import sys
import os

def install_package(package, extra_args=None):
    print(f"Installing {package}...")
    cmd = [sys.executable, "-m", "pip", "install", "--no-cache-dir"]
    if extra_args:
        cmd.extend(extra_args)
    cmd.append(package)
    subprocess.check_call(cmd)

def main():
    # First, upgrade pip and install setuptools
    print("Upgrading pip and installing setuptools...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "pip"])
    install_package("setuptools>=68.0.0")
    
    # Install numpy with a newer version compatible with Python 3.12
    print("Installing numpy...")
    install_package("numpy>=1.26.0")
    
    # Install core dependencies
    core_deps = [
        "pandas>=2.0.0",
        "scikit-learn>=1.3.0"
    ]
    
    for dep in core_deps:
        install_package(dep)
    
    # Install web-related dependencies
    web_deps = [
        "beautifulsoup4>=4.9.3",
        "requests>=2.25.1",
        "aiohttp>=3.8.1"
    ]
    
    for dep in web_deps:
        install_package(dep)
    
    # Install NLP-related dependencies
    nlp_deps = [
        "textblob>=0.15.3",
        "nltk>=3.6.3",
        "sentence-transformers>=2.2.2"
    ]
    
    for dep in nlp_deps:
        install_package(dep)
    
    # Install visualization dependencies
    viz_deps = [
        "matplotlib>=3.4.3",
        "seaborn>=0.11.2",
        "plotly>=5.3.1",
        "wordcloud>=1.8.1"
    ]
    
    for dep in viz_deps:
        install_package(dep)
    
    # Install FAISS last
    install_package("faiss-cpu>=1.7.4")
    
    print("All dependencies installed successfully!")

if __name__ == "__main__":
    main() 