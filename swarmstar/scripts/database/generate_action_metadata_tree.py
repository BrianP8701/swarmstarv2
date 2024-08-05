import os
import json
import asyncio
import importlib.util
from typing import List, Dict, Any

from swarmstar.objects.nodes.action_metadata_node import ActionMetadataNode
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.objects.nodes.base_action_node import BaseActionNode

ACTIONS_ROOT = "/Users/brianprzezdziecki/swarmstar_world/swarmstarv2/swarmstar/swarmstar/actions"

async def create_action_metadata_node(node_data: Dict[str, Any]) -> ActionMetadataNode:
    print(node_data)
    existing_node = await ActionMetadataNode.exists(node_data["id"])
    if existing_node:
        await ActionMetadataNode.delete(node_data["id"])
    node = ActionMetadataNode(
        id=node_data["id"],
        parent_id=node_data["parent_id"],
        description=node_data["description"],
        action_enum=ActionEnum[node_data["action_enum"]] if isinstance(node_data["action_enum"], str) else node_data["action_enum"]
    )
    await node._create()
    print(f"Created action metadata node: {node.id}")
    return node

def load_class_from_file(filepath: str, classname: str):
    spec = importlib.util.spec_from_file_location(classname, filepath)
    if spec is None or spec.loader is None:
        raise ImportError(f"Cannot load spec for {classname} from {filepath}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return getattr(module, classname)

async def process_folder(folder_path: str, parent_id: str | None = None) -> List[ActionMetadataNode]:
    print(f"Processing folder: {folder_path}")
    metadata_path = os.path.join(folder_path, "metadata.json")
    if not os.path.exists(metadata_path):
        print(f"No metadata found in: {folder_path}")
        return []

    with open(metadata_path, "r") as f:
        metadata = json.load(f)

    metadata["parent_id"] = parent_id
    metadata["action_enum"] = 'FOLDER'
    node = await create_action_metadata_node(metadata)
    nodes = [node]
    children_relationships = []

    for item in os.listdir(folder_path):
        item_path = os.path.join(folder_path, item)
        print(f"Found item: {item_path}")
        if os.path.isdir(item_path):
            print(f"Processing subfolder: {item_path}")
            child_nodes = await process_folder(item_path, node.id)
            nodes.extend(child_nodes)
            children_relationships.append((node, child_nodes))
        elif item.endswith(".py"):
            print(f"Found Python file: {item_path}")
            with open(item_path, "r") as f:
                content = f.read()
                if "class" in content and "(BaseActionNode)" in content:
                    class_name = content.split("class ")[1].split("(")[0].strip()
                    print(f"Found class: {class_name} in {item_path}")
                    try:
                        cls = load_class_from_file(item_path, class_name)
                        print(f"Loaded class: {cls}")
                        if issubclass(cls, BaseActionNode):
                            print(f"{class_name} is a subclass of BaseActionNode")
                            action_node = await create_action_metadata_node({
                                "id": cls.id,
                                "parent_id": node.id,
                                "description": cls.description,
                                "action_enum": cls.action_enum.name  # Convert enum to string
                            })
                            nodes.append(action_node)
                            children_relationships.append((node, [action_node]))
                            print(f"Created action node from Python file: {action_node.id}")
                        else:
                            print(f"{class_name} is not a subclass of BaseActionNode")
                    except Exception as e:
                        print(f"Error loading class {class_name} from {item_path}: {e}")

    for parent, children in children_relationships:
        parent.children_ids.extend([child.id for child in children])

    return nodes

async def generate_action_metadata_tree():
    nodes = await process_folder(ACTIONS_ROOT)
    print(f"Generated {len(nodes)} action metadata nodes")

if __name__ == "__main__":
    asyncio.run(generate_action_metadata_tree())