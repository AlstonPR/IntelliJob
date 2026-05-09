import os
from src.agents.graph import career_agent_workflow

def generate_graph_image():
    """
    Generates a PNG image of the LangGraph workflow and saves it to the root directory.
    """
    print("Generating graph visualization...")
    
    # Get the graph object
    graph = career_agent_workflow.get_graph()
    
    # Save as PNG
    try:
        # draw_mermaid_png requires an internet connection as it uses an external API by default
        png_data = graph.draw_mermaid_png()
        
        output_path = "langgraph_visual.png"
        with open(output_path, "wb") as f:
            f.write(png_data)
            
        print(f"Success! Graph visually saved to: {os.path.abspath(output_path)}")
    except Exception as e:
        print(f"Failed to generate PNG: {e}")
        print("\nFallback: Here is the Mermaid syntax. You can paste this into https://mermaid.live/")
        print("--------------------------------------------------")
        print(graph.draw_mermaid())
        print("--------------------------------------------------")

if __name__ == "__main__":
    generate_graph_image()
