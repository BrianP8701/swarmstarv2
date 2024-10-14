// src/components/custom/PanelLayout.tsx
import React from 'react'
import { PanelNodeCreateInput, SplitDirectionEnum } from '@/graphql/generated/graphql'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { cn } from '@/utils/cn'

interface PanelLayoutProps {
  node: PanelNodeCreateInput
  renderContent: (node: PanelNodeCreateInput) => React.ReactNode
  isResizable?: boolean
  className?: string
}

export function PanelLayout({ node, renderContent, isResizable = false, className }: PanelLayoutProps) {
  const renderNode = (
    node: PanelNodeCreateInput,
    parentSplit: SplitDirectionEnum | null = null,
    position: 'first' | 'second' | null = null
  ): React.ReactNode => {
    if (node.split) {
      const direction = node.split === SplitDirectionEnum.Horizontal ? 'horizontal' : 'vertical'

      // Determine border classes based on position
      let borderClasses = ''
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

      if (isResizable) {
        return (
          <ResizablePanelGroup key={node.id} direction={direction} className={borderClasses} style={{ flex: 1 }}>
            <ResizablePanel>{renderNode(node.firstChild!, node.split, 'first')}</ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>{renderNode(node.secondChild!, node.split, 'second')}</ResizablePanel>
          </ResizablePanelGroup>
        )
      } else {
        return (
          <div
            key={node.id}
            className={cn(`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'}`, borderClasses)}
            style={{ flex: 1, position: 'relative' }}
          >
            {node.firstChild && renderNode(node.firstChild, node.split, 'first')}
            {node.secondChild && renderNode(node.secondChild, node.split, 'second')}
          </div>
        )
      }
    } else {
      // Leaf node
      // Determine border classes based on position
      let borderClasses = ''
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

      return (
        <div key={node.id} className={cn(borderClasses)} style={{ flex: 1, position: 'relative' }}>
          {renderContent(node)}
        </div>
      )
    }
  }

  return (
    <div className={cn('flex overflow-hidden', className)} style={{ flex: 1, position: 'relative' }}>
      {renderNode(node)}
    </div>
  )
}
