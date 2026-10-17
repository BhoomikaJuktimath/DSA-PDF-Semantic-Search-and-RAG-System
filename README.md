\# DSA PDF Semantic Search and RAG System



An AI-powered document retrieval system that processes Data Structures and Algorithms (DSA) PDF notes, converts text into vector embeddings, and stores them in Pinecone for semantic search and retrieval-augmented generation (RAG).



\## Overview



This project uses LangChain, Google Gemini embeddings, and Pinecone to build the foundation of a question-answering system over DSA study materials.



Instead of searching only for exact keywords, semantic retrieval can identify document passages related to the meaning of a query.



\## Technologies Used



\- \*\*Node.js\*\* — JavaScript runtime

\- \*\*LangChain\*\* — PDF loading and text splitting

\- \*\*Google Gemini Embeddings\*\* — Text embedding generation

\- \*\*Pinecone\*\* — Vector database for similarity search

\- \*\*dotenv\*\* — Environment variable configuration



\## Features



\- PDF document loading and text extraction

\- Text chunking with configurable chunk size and overlap

\- Vector embedding generation

\- Storage of embeddings and document metadata in Pinecone

\- Separate scripts for document indexing and querying



\*Note: The complete question-answering workflow depends on the implementation of retrieval and Gemini response generation in `query.js`.\*



\## Project Structure



```text

RAG/

├── index.js

├── query.js

├── dsa.pdf

├── package.json

├── package-lock.json

├── .gitignore

└── README.md

```



\## Prerequisites



\- Node.js and npm

\- A Google AI API key with access to the selected embedding model

\- A Pinecone account and configured index



\## Installation



1\. Clone the repository:



&#x20;  ```bash

&#x20;  git clone https://github.com/BhoomikaJuktimath/DSA-PDF-Semantic-Search-and-RAG-System.git

&#x20;  ```



2\. Navigate to the project directory:



&#x20;  ```bash

&#x20;  cd DSA-PDF-Semantic-Search-and-RAG-System

&#x20;  ```



3\. Install dependencies:



&#x20;  ```bash

&#x20;  npm install

&#x20;  ```



4\. Create a `.env` file in the project root:



&#x20;  ```env

&#x20;  GEMINI\_API\_KEY=your\_gemini\_api\_key

&#x20;  PINECONE\_API\_KEY=your\_pinecone\_api\_key

&#x20;  PINECONE\_INDEX\_NAME=your\_pinecone\_index\_name

&#x20;  ```



5\. Place your DSA PDF in the project directory using the filename expected by the indexing script.



\## Configuration



Ensure that the Pinecone index dimension matches the embedding model output dimension. Configure the correct embedding model and API credentials before running the application.



Never commit `.env` or expose API keys in source code.



\## Running the Project



Run the document indexing script:



```bash

node index.js

```



Run the query script:



```bash

node query.js

```



The scripts may require additional configuration depending on the current implementation.



\## Future Enhancements



\- Natural-language question answering using Gemini

\- Semantic similarity search with retrieved document chunks

\- Source page references in generated answers

\- Interactive web-based chat interface

\- Conversation history and improved error handling



\## Author



\*\*Bhoomika Juktimath\*\*



GitHub: \[BhoomikaJuktimath](https://github.com/BhoomikaJuktimath)



\## License



A license has not yet been specified.



