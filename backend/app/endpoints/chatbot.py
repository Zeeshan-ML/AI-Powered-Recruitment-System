from fastapi import HTTPException
from pydantic import BaseModel
import pickle
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from fastapi import APIRouter
import os
router = APIRouter()
# Load FAISS vector store
faiss_file = os.path.join(os.path.dirname(__file__), "faiss_vectors1.pkl")
with open(faiss_file, "rb") as f:
    loaded_vector_store = pickle.load(f)


# Initialize LLM
groq_api_key = "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"
llm = ChatGroq(groq_api_key=groq_api_key, model="Llama-3.3-70B-SpecDec")

# Define prompt template
prompt = ChatPromptTemplate.from_template(
    """
    You are an expert assistant whose responses must be strictly based on the provided document context.
    
    Instructions:
    - Use only the information in the "Context" section to answer the "Question".
    - If the context contains relevant details, provide a clear and accurate answer.
    - If the context is empty or does not include sufficient information to answer the question, respond with: 
      "I'm sorry, I don't have enough information to answer that question. Could you please ask a more specific question or provide additional context?"
    
    Context:
    {context}
    
    Question:
    {input}
    """
)


# Create document and retrieval chains
document_chain = create_stuff_documents_chain(llm, prompt)
retriever = loaded_vector_store.as_retriever()
retrieval_chain = create_retrieval_chain(retriever, document_chain)

# Define request model
class QueryRequest(BaseModel):
    query: str

# API endpoint to get answers from LLM
@router.post("/get_answer")
def get_answer(request: QueryRequest):
    try:
        response = retrieval_chain.invoke({'input': request.query})
        return {"answer": response['answer']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
