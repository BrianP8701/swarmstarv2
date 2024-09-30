import React, { useMemo, useRef, useEffect, useState } from 'react'
import Graph from 'react-vis-network-graph'

// Add this function at the top of the file, outside the component
function hashStringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Generate a bright color
  const hue = hash % 360
  const saturation = 70 + (hash % 30) // 70-100%
  const lightness = 60 + (hash % 20) // 60-80%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export type Node = {
  id: string
  title?: string | null
  type?: string | null
}

export type Edge = {
  startNodeId: string
  endNodeId: string
}

interface GraphVisualizerProps {
  nodes: Node[]
  edges: Edge[]
  colorMap?: Record<string, string>
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ nodes, edges, colorMap }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [key, setKey] = useState(0)

  const graphData = useMemo(() => {
    const uniqueNodes = new Map<string, { id: string; label: string; color: string }>()
    const uniqueEdges = new Set<string>()
    const graphEdges: { from: string; to: string }[] = []
    const duplicates: string[] = []

    nodes.forEach(node => {
      if (uniqueNodes.has(node.id)) {
        duplicates.push(node.id)
        return // Skip this node
      }

      uniqueNodes.set(node.id, {
        id: node.id,
        label: node.title || 'Untitled Node',
        color: colorMap?.[node.type || ''] || hashStringToColor(node.type || ''),
      })
    })

    edges.forEach(edge => {
      const edgeKey = `${edge.startNodeId}-${edge.endNodeId}`
      if (!uniqueEdges.has(edgeKey) && uniqueNodes.has(edge.startNodeId) && uniqueNodes.has(edge.endNodeId)) {
        uniqueEdges.add(edgeKey)
        graphEdges.push({
          from: edge.startNodeId,
          to: edge.endNodeId,
        })
      }
    })

    if (duplicates.length > 0) {
      console.warn('Duplicate node IDs found:', duplicates)
    }

    return {
      nodes: Array.from(uniqueNodes.values()),
      edges: graphEdges,
    }
  }, [nodes, edges, colorMap])

  const options = {
    layout: {
      hierarchical: {
        enabled: false,
        direction: 'UD',
        sortMethod: 'hubsize',
        nodeSpacing: 200,
        treeSpacing: 200,
        blockShifting: true,
        edgeMinimization: true,
        parentCentralization: true,
        levelSeparation: 150,
      },
    },
    nodes: {
      shape: 'dot',
      size: 20,
      font: {
        color: '#ffffff', // White text for better visibility
        size: 14,
      },
      borderWidth: 0, // Remove border
    },
    edges: {
      smooth: {
        type: 'continuous',
      },
    },
    physics: {
      enabled: true,
      stabilization: false,
      barnesHut: {
        gravitationalConstant: -80000,
        springConstant: 0.001,
        springLength: 200,
      },
    },
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      // Force re-render of the Graph component
      setKey(prevKey => prevKey + 1)
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className='w-full h-full rounded-xl'>
      {graphData.nodes.length > 0 && (
        <Graph key={key} graph={graphData} options={options} style={{ width: '100%', height: '100%' }} />
      )}
    </div>
  )
}
