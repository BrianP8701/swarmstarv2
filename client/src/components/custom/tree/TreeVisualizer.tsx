import React from 'react';
import Tree, { RawNodeDatum } from 'react-d3-tree';
import { TreeNode } from './TreeNode';

export type TreeNode = {
    id: string
    title?: string | null
    parentId?: string | null
}

interface CustomNodeDatum extends RawNodeDatum {
    id: string;
    title?: string | null
    parentId?: string | null
}

interface TreeVisualizerProps {
    nodes: TreeNode[];
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ nodes }) => {
    const buildTree = (nodes: TreeNode[]): RawNodeDatum => {
        const nodeMap = new Map<string, CustomNodeDatum>();

        // Create CustomNodeDatum objects for each node
        nodes.forEach(node => {
            nodeMap.set(node.id, { ...node, name: node.title ?? 'Untitled Node', children: [] });
        });

        // Build the tree structure
        const root: CustomNodeDatum = { name: 'Root', children: [], id: 'root', title: 'Root', parentId: null };
        nodes.forEach(node => {
            if (node.parentId === null) {
                root.children?.push(nodeMap.get(node.id)!);
            } else {
                const parent = nodeMap.get(node.parentId!);
                if (parent && parent.children) {
                    parent.children.push(nodeMap.get(node.id)!);
                }
            }
        });

        return root;
    };

    const treeData = buildTree(nodes);

    return (
        <div className='w-full h-full bg-secondary rounded-xl'>
            <Tree
                data={treeData}
                orientation="vertical"
                pathFunc="diagonal"
                translate={{ x: 300, y: 300 }}
                zoom={0.5}
                separation={{ siblings: 1.5, nonSiblings: 2 }}
                zoomable={true}
                scaleExtent={{ min: 0.1, max: 3 }}
                renderCustomNodeElement={(rd3tProps) => {
                    return (
                        <TreeNode {...rd3tProps} />
                    );
                }}
            />
        </div>
    );
};
