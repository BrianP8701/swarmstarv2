import React, { useMemo, useRef, useEffect, useState } from 'react';
import Graph from 'react-vis-network-graph';

export type TreeNode = {
    id: string
    title?: string | null
    parentId?: string | null
}

interface TreeVisualizerProps {
    nodes: TreeNode[];
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ nodes }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [key, setKey] = useState(0);

    const graphData = useMemo(() => {
        const uniqueNodes = new Map<string, { id: string; label: string }>();
        const edges: { from: string; to: string }[] = [];
        const duplicates: string[] = [];

        nodes.forEach(node => {
            if (uniqueNodes.has(node.id)) {
                duplicates.push(node.id);
                return; // Skip this node
            }

            uniqueNodes.set(node.id, {
                id: node.id,
                label: node.title || 'Untitled Node',
            });

            if (node.parentId && uniqueNodes.has(node.parentId)) {
                edges.push({
                    from: node.parentId,
                    to: node.id,
                });
            }
        });

        if (duplicates.length > 0) {
            console.warn('Duplicate node IDs found:', duplicates);
        }

        return {
            nodes: Array.from(uniqueNodes.values()),
            edges: edges,
        };
    }, [nodes]);

    const options = {
        layout: {
            hierarchical: {
                enabled: true,
                direction: 'UD',
                sortMethod: 'directed',
            },
        },
        nodes: {
            shape: 'circle',
        },
        physics: {
            enabled: false,
        },
    };

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            // Force re-render of the Graph component
            setKey(prevKey => prevKey + 1);
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full rounded-xl">
            {graphData.nodes.length > 0 && (
                <Graph
                    key={key}
                    graph={graphData}
                    options={options}
                    style={{ width: '100%', height: '100%' }}
                />
            )}
        </div>
    );
};
