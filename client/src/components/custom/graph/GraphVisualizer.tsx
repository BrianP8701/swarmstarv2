import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react'
import Graph from 'react-vis-network-graph'
import debounce from 'lodash/debounce'
import { Tooltip, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import { Network } from 'vis-network'

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

export type BaseNode<T = string> = {
  id: string
  title?: string | null
  type?: T | null
}

export type Edge = {
  startNodeId: string
  endNodeId: string
}

interface GraphVisualizerProps<T extends BaseNode<U>, U extends string = string> {
  nodes: T[]
  edges: Edge[]
  colorMap?: Partial<Record<U, string>>
  rootNodeId?: string
  edgeLength?: number
  hierarchical?: boolean
  renderTooltip?: (node: T) => React.ReactNode
}

export function GraphVisualizer<T extends BaseNode<U>, U extends string = string>({
  nodes,
  edges,
  colorMap,
  rootNodeId,
  edgeLength = 200,
  hierarchical = false,
  renderTooltip,
}: GraphVisualizerProps<T, U>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [key, setKey] = useState(0)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [hoveredNode, setHoveredNode] = useState<T | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [network, setNetwork] = useState<Network | null>(null)

  const graphData = useMemo(() => {
    const uniqueNodes = new Map<string, { id: string; label: string; color: string; level?: number }>()
    const uniqueEdges = new Set<string>()
    const graphEdges: { from: string; to: string }[] = []
    const duplicates: string[] = []

    // First pass: create nodes
    nodes.forEach((node, index) => {
      if (uniqueNodes.has(node.id)) {
        duplicates.push(node.id)
        return // Skip this node
      }

      const nodeType = node.type as U | undefined
      uniqueNodes.set(node.id, {
        id: node.id,
        label: node.title || 'Untitled Node',
        color: nodeType && colorMap?.[nodeType] ? colorMap[nodeType] : hashStringToColor(nodeType || ''),
        level: hierarchical ? index : undefined, // Assign levels if hierarchical
      })
    })

    // Second pass: adjust levels based on edges
    if (hierarchical) {
      edges.forEach(edge => {
        const startNode = uniqueNodes.get(edge.startNodeId)
        const endNode = uniqueNodes.get(edge.endNodeId)
        if (startNode && endNode) {
          if (startNode.level === undefined) startNode.level = 0
          if (endNode.level === undefined || endNode.level <= startNode.level) {
            endNode.level = startNode.level + 1
          }
        }
      })
    }

    // Create edges
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

    // If a root node is specified, ensure it's at the top level
    if (rootNodeId && hierarchical) {
      const rootNode = uniqueNodes.get(rootNodeId)
      if (rootNode) {
        rootNode.level = 0
        // Adjust other nodes' levels
        uniqueNodes.forEach(node => {
          if (node.id !== rootNodeId && node.level !== undefined) {
            node.level += 1
          }
        })
      }
    }

    return {
      nodes: Array.from(uniqueNodes.values()),
      edges: graphEdges,
    }
  }, [nodes, edges, colorMap, rootNodeId, hierarchical])

  const options = useMemo(() => ({
    layout: {
      hierarchical: {
        enabled: hierarchical,
        direction: 'UD',
        sortMethod: 'directed',
        nodeSpacing: 150,
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
        color: '#ffffff',
        size: 14,
      },
      borderWidth: 0,
    },
    edges: {
      smooth: hierarchical
        ? {
            type: 'cubicBezier',
            forceDirection: 'vertical',
            roundness: 0.4,
          }
        : {
            type: 'continuous',
          },
      length: edgeLength,
    },
    physics: {
      enabled: !hierarchical,
      barnesHut: {
        gravitationalConstant: -80000,
        springConstant: 0.001,
        springLength: 200,
      },
      stabilization: {
        iterations: 1000,
        updateInterval: 100,
      },
    },
    interaction: {
      hover: true,
    },
  }), [hierarchical, edgeLength])

  const debouncedResize = useCallback(
    debounce(() => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }, 200),
    []
  )

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      debouncedResize()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      resizeObserver.disconnect()
      debouncedResize.cancel()
    }
  }, [debouncedResize])

  useEffect(() => {
    setKey(prevKey => prevKey + 1)
  }, [containerSize])

  // Add these event handlers outside of useEffect
  const handleHoverNode = useCallback(
    (event: { node: string }) => {
      const node = nodes.find(n => n.id === event.node);
      if (node && network && containerRef.current) {
        setHoveredNode(node);

        const position = network.getPositions([event.node])[event.node];
        const canvasPosition = network.canvasToDOM(position);

        const containerRect = containerRef.current.getBoundingClientRect();

        // Calculate position relative to the container
        const x = canvasPosition.x - containerRect.left;
        const y = canvasPosition.y - containerRect.top;

        setTooltipPosition({ x, y });
      }
    },
    [nodes, network]
  );

  const handleBlurNode = useCallback(() => {
    setHoveredNode(null)
  }, [])

  useEffect(() => {
    if (network) {
      network.on('hoverNode', handleHoverNode)
      network.on('blurNode', handleBlurNode)
    }

    return () => {
      if (network) {
        network.off('hoverNode', handleHoverNode)
        network.off('blurNode', handleBlurNode)
      }
    }
  }, [network, handleHoverNode, handleBlurNode])

  return (
    <TooltipProvider>
      <div ref={containerRef} className='relative flex flex-col h-full rounded-xl bg-secondary'>
        {graphData.nodes.length > 0 && containerSize.width > 0 && containerSize.height > 0 && (
          <>
            <Graph
              key={key}
              graph={graphData}
              options={options}
              style={{ width: `${containerSize.width}px`, height: `${containerSize.height}px` }}
              getNetwork={setNetwork}
              network={network}
            />
            {hoveredNode && renderTooltip && (
              <div
                style={{
                  position: 'absolute',
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y}px`,
                  transform: 'translate(-50%, -100%)',
                  pointerEvents: 'none',
                  zIndex: 1000,
                }}
              >
                <Tooltip open={true}>
                  <TooltipContent>
                    {renderTooltip(hoveredNode)}
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </>
        )}
      </div>
    </TooltipProvider>
  )
}
