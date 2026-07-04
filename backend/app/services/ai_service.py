from typing import TypedDict, Annotated, Sequence
import operator
from langgraph.graph import StateGraph, END
from app.schemas.ai import ConsultationRequest, ConsultationResponse
from app.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession

# 1. Define the Graph State
class AgentState(TypedDict):
    request: ConsultationRequest
    user_profile: dict
    extracted_ingredients: list[str]
    clinical_flags: list[str]
    final_analysis: str
    routine: str
    is_safe: bool

# 2. Define the Graph Nodes
async def node_extract_prescription(state: AgentState) -> AgentState:
    """Simulates an LLM/OCR tool extracting chemical compounds from text."""
    prescription = state["request"].prescription_text
    ingredients = []
    flags = []
    
    if prescription:
        # Placeholder for LLM extraction logic (e.g., LangChain LLMChain)
        if "tretinoin" in prescription.lower() or "retinol" in prescription.lower():
            ingredients.append("Tretinoin/Retinoid")
            flags.append("HIGH_SENSITIVITY")
            flags.append("AVOID_SALICYLIC_ACID")
            
    return {"extracted_ingredients": ingredients, "clinical_flags": flags}

async def node_analyze_profile(state: AgentState) -> AgentState:
    """Analyzes the user's base skin profile alongside the new query."""
    query = state["request"].text_query or ""
    profile = state["user_profile"]
    
    analysis = f"Patient presents with {profile.get('skin_type', 'unspecified')} skin. "
    if state["clinical_flags"]:
        analysis += f"Clinical flags detected: {', '.join(state['clinical_flags'])}. "
        
    analysis += "Diagnostic: Proceed with gentle, non-comedogenic hydration."
    return {"final_analysis": analysis}

async def node_generate_routine(state: AgentState) -> AgentState:
    """Generates the final routine and safety check based on earlier node data."""
    is_safe = "HIGH_SENSITIVITY" not in state.get("clinical_flags", [])
    
    routine = "1. Gentle Cleanser (AM/PM)\n2. Ceramide Moisturizer (AM/PM)\n3. SPF 50+ (AM only)"
    if not is_safe:
        routine = "Prescription conflict detected. Please consult your primary dermatologist before adding active OTC serums."
        
    return {"routine": routine, "is_safe": is_safe}

# 3. Compile the LangGraph
workflow = StateGraph(AgentState)

workflow.add_node("extract", node_extract_prescription)
workflow.add_node("analyze", node_analyze_profile)
workflow.add_node("generate", node_generate_routine)

workflow.set_entry_point("extract")
workflow.add_edge("extract", "analyze")
workflow.add_edge("analyze", "generate")
workflow.add_edge("generate", END)

diagnostic_app = workflow.compile()

# 4. Expose the execution function to the FastAPI route
async def run_diagnostic_graph(request: ConsultationRequest, user: User, db: AsyncSession) -> ConsultationResponse:
    # Initialize the state payload
    initial_state = {
        "request": request,
        "user_profile": {
            "skin_type": user.skin_type,
            "skin_concerns": user.skin_concerns
        },
        "extracted_ingredients": [],
        "clinical_flags": [],
        "final_analysis": "",
        "routine": "",
        "is_safe": True
    }
    
    # Execute the LangGraph workflow
    final_state = await diagnostic_app.ainvoke(initial_state)
    
    return ConsultationResponse(
        analysis=final_state["final_analysis"],
        suggested_routine=final_state["routine"],
        is_safe_to_proceed=final_state["is_safe"]
    )