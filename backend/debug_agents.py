import langchain.agents
print(dir(langchain.agents))
try:
    from langchain.agents import create_tool_calling_agent
    print("create_tool_calling_agent found")
except ImportError as e:
    print(f"create_tool_calling_agent MISSING: {e}")

try:
    from langchain.agents import initialize_agent
    print("initialize_agent found")
except ImportError as e:
    print(f"initialize_agent MISSING: {e}")
