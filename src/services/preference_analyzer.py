import json
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List

class PreferenceKeywords(BaseModel):
    keywords: List[str] = Field(description="A list of 4-6 concise keywords or short phrases representing the core demands (e.g., 'Remote Work', 'Startup', '$120k-$160k', 'Culture First').")

def extract_preference_keywords(text: str) -> List[str]:
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)
    parser = JsonOutputParser(pydantic_object=PreferenceKeywords)
    
    prompt = PromptTemplate(
        template="You are an expert career analyst. Extract exactly 4 to 6 concise tags or keywords from the user's natural language job preferences.\n"
                 "These tags will be displayed as badges on a UI. Keep them very short (1-3 words max).\n\n"
                 "{format_instructions}\n\n"
                 "PREFERENCES TEXT:\n{text}\n",
        input_variables=["text"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
    
    chain = prompt | llm | parser
    
    try:
        result = chain.invoke({"text": text})
        return result.get("keywords", [])
    except Exception as e:
        print(f"Error extracting keywords: {e}")
        return ["Remote", "Flexible", "Growth", "Tech"]
