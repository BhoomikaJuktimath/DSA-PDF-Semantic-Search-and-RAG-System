import * as dotenv from 'dotenv';
dotenv.config();

import readlineSync from 'readline-sync';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from "@google/genai";


// Gemini
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// Chat history
const History = [];


// ==========================================
// CHAT FUNCTION
// ==========================================

async function chatting(question) {

    console.log("\nUser question:", question);


    // ==========================================
    // 1. CREATE EMBEDDING FOR USER QUESTION
    // ==========================================

    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: 'gemini-embedding-2',
    });

    const queryVector = await embeddings.embedQuery(question);

    console.log(
        "Query vector dimension:",
        queryVector.length
    );


    // ==========================================
    // 2. CONNECT TO PINECONE
    // ==========================================

    const pinecone = new Pinecone();

    const pineconeIndex = pinecone.Index(
        process.env.PINECONE_INDEX_NAME
    );


    // ==========================================
    // 3. SEARCH PINECONE
    // ==========================================

    const searchResults = await pineconeIndex.query({
        topK: 10,
        vector: queryVector,
        includeMetadata: true,
    });


    console.log(
        "Relevant documents found:",
        searchResults.matches.length
    );


    // ==========================================
    // 4. CREATE CONTEXT
    // ==========================================

    const context = searchResults.matches
        .map(match => match.metadata.text)
        .join("\n\n---\n\n");


    console.log("Context created successfully.");


    // ==========================================
    // 5. ADD QUESTION TO HISTORY
    // ==========================================

    History.push({
        role: 'user',
        parts: [{ text: question }]
    });


    // ==========================================
    // 6. ASK GEMINI
    // ==========================================

    try {

        const response = await ai.models.generateContent({

            model: "gemini-3.8-flash",

            contents: History,

            config: {

                systemInstruction: `
You are a Data Structure and Algorithm expert.

Answer the user's question using ONLY the
information provided in the Context.

If the answer is not present in the Context,
say:

"I could not find the answer in the provided document."

Keep the answer clear, simple and educational.


Context:

${context}
                `,

            },

        });


        // ==========================================
        // 7. SAVE RESPONSE
        // ==========================================

        History.push({
            role: 'model',
            parts: [{ text: response.text }]
        });


        // ==========================================
        // 8. DISPLAY ANSWER
        // ==========================================

        console.log("\n=================================");
        console.log("ANSWER");
        console.log("=================================\n");

        console.log(response.text);

        console.log("\n=================================\n");


    } catch (error) {

        console.log("\nGemini is temporarily unavailable.");
        console.log("Please try the question again.");
        console.log("\nError:", error.message);

        // Remove question from history
        History.pop();
    }
}


// ==========================================
// MAIN PROGRAM
// ==========================================

async function main() {

    const userProblem = readlineSync.question(
        "Ask me anything--> "
    );

    await chatting(userProblem);

    main();
}


main();



