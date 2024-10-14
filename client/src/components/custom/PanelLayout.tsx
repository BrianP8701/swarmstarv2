// src/components/custom/PanelLayout.tsx
import React from 'react'
import { PanelNode, PanelNodeCreateInput, SplitDirectionEnum } from '@/graphql/generated/graphql'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { cn } from '@/utils/cn'

interface PanelLayoutProps {
  nodes: (PanelNodeCreateInput | PanelNode)[]
  rootNodeId: string
  renderContent: (node: PanelNodeCreateInput | PanelNode) => React.ReactNode
  showBorders?: boolean
  className?: string
}

export function PanelLayout({ nodes, rootNodeId, renderContent, showBorders = true, className }: PanelLayoutProps) {
  // Create a mapping from node IDs to nodes for quick access
  const nodeMap = React.useMemo(() => {
    const map: { [id: string]: PanelNodeCreateInput | PanelNode } = {}
    nodes.forEach(node => {
      if (node.id) {
        map[node.id] = node
      }
    })
    return map
  }, [nodes])

  const renderNode = (
    nodeId: string,
    parentSplit: SplitDirectionEnum | null = null,
    position: 'first' | 'second' | null = null
  ): React.ReactNode => {
    const node = nodeMap[nodeId]
    if (!node) return null

    if (node.split) {
      const direction = node.split === SplitDirectionEnum.Horizontal ? 'horizontal' : 'vertical'

      // Determine border classes based on position and showBorders prop
      let borderClasses = ''
      if (showBorders) {
        if (parentSplit === SplitDirectionEnum.Horizontal) {
          if (position === 'first') {
            borderClasses = 'border-r'
          }
        } else if (parentSplit === SplitDirectionEnum.Vertical) {
          if (position === 'first') {
            borderClasses = 'border-b'
          }
        } else {
          borderClasses = 'border'
        }
      }

      const firstChildNodeId = node.firstChildId
      const secondChildNodeId = node.secondChildId

      // Ensure ResizablePanelGroup and ResizablePanel have correct flex properties
      return (
        <ResizablePanelGroup
          key={node.id}
          direction={direction}
          className={borderClasses}
          style={{ flex: 1, display: 'flex', flexDirection: direction === 'horizontal' ? 'row' : 'column' }}
        >
          <ResizablePanel style={{ flex: 1, display: 'flex' }}>
            {firstChildNodeId ? renderNode(firstChildNodeId, node.split, 'first') : null}
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel style={{ flex: 1, display: 'flex' }}>
            {secondChildNodeId ? renderNode(secondChildNodeId, node.split, 'second') : null}
          </ResizablePanel>
        </ResizablePanelGroup>
      )
    } else {
      // Leaf node
      let borderClasses = ''
      if (showBorders) {
        if (parentSplit === SplitDirectionEnum.Horizontal) {
          if (position === 'first') {
            borderClasses = 'border-r'
          }
        } else if (parentSplit === SplitDirectionEnum.Vertical) {
          if (position === 'first') {
            borderClasses = 'border-b'
          }
        } else {
          borderClasses = 'border'
        }
      }

      return (
        <div
          key={node.id}
          className={cn(borderClasses, 'flex')}
          style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}
        >
          {renderContent(node)}
        </div>
      )
    }
  }

  return (
    <div className={cn('flex overflow-hidden', className)} style={{ flex: 1, position: 'relative' }}>
      {renderNode(rootNodeId)}
    </div>
  )
}
