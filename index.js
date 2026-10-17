import * as dotenv from 'dotenv';
dotenv.config();

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';

async function indexDocument() {

    const PDF_PATH = './dsa.pdf';

    // 1. Load PDF
    const pdfLoader = new PDFLoader(PDF_PATH);
    const rawDocs = await pdfLoader.load();

    console.log("PDF loaded");

    // 2. Split PDF into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

    console.log("Chunking Completed");
    console.log("Total chunks:", chunkedDocs.length);

    // 3. Gemini Embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: 'gemini-embedding-2',
    });

    console.log("Embedding model configured");

    // 4. Connect to Pinecone
    const pinecone = new Pinecone();

    const pineconeIndex = pinecone.Index(
        process.env.PINECONE_INDEX_NAME
    );

    console.log("Pinecone configured");

    // 5. Process ONE document at a time
    for (let i = 0; i < chunkedDocs.length; i++) {

        const doc = chunkedDocs[i];

        console.log(
            `Processing ${i + 1} / ${chunkedDocs.length}`
        );

        try {

            // Create embedding for ONE chunk
            const vector = await embeddings.embedQuery(
                doc.pageContent
            );

            console.log(
                "Vector dimension:",
                vector.length
            );

            // Make sure embedding is valid
            if (!vector || vector.length !== 3072) {
                console.log(
                    `Skipping chunk ${i + 1}: Invalid vector`
                );
                continue;
            }

            // Create Pinecone record
            const record = {
                id: `doc-${i}`,
                values: vector,
                metadata: {
                    text: doc.pageContent,
                    page:
                        doc.metadata?.loc?.pageNumber || 0,
                },
            };

            // Upload to Pinecone
            await pineconeIndex.upsert([record]);

            console.log(
                `Uploaded ${i + 1} / ${chunkedDocs.length}`
            );

        } catch (error) {

            console.log(
                `Error processing chunk ${i + 1}:`,
                error.message
            );

        }
    }

    console.log("");
    console.log("=================================");
    console.log("DATA STORED SUCCESSFULLY!");
    console.log("=================================");
}

indexDocument();