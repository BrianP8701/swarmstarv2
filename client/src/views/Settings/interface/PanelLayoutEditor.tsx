// src/views/Settings/interface/PanelLayoutEditor.tsx
import { useState } from 'react'
import { PanelLayout } from '@/components/custom/PanelLayout'
import { PanelContentEnum, SplitDirectionEnum, PanelNodeCreateInput } from '@/graphql/generated/graphql'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export function PanelLayoutEditor() {
  const [rootNode, setRootNode] = useState<PanelNodeCreateInput>({
    id: 'root',
    content: PanelContentEnum.Empty,
    split: null,
    firstChild: null,
    secondChild: null,
  })

  const addNode = (nodeId: string, split: SplitDirectionEnum) => {
    const newNode1: PanelNodeCreateInput = {
      id: `${Date.now()}-1`,
      content: PanelContentEnum.Empty,
      split: null,
      firstChild: null,
      secondChild: null,
    }
    const newNode2: PanelNodeCreateInput = {
      id: `${Date.now()}-2`,
      content: PanelContentEnum.Empty,
      split: null,
      firstChild: null,
      secondChild: null,
    }

    const updateNode = (node: PanelNodeCreateInput): PanelNodeCreateInput => {
      if (node.id === nodeId) {
        return {
          ...node,
          split,
          firstChild: newNode1,
          secondChild: newNode2,
        }
      }
      return {
        ...node,
        firstChild: node.firstChild ? updateNode(node.firstChild) : null,
        secondChild: node.secondChild ? updateNode(node.secondChild) : null,
      }
    }

    setRootNode(prevNode => updateNode(prevNode))
  }

  const setContent = (nodeId: string, content: PanelContentEnum) => {
    const updateNode = (node: PanelNodeCreateInput): PanelNodeCreateInput => {
      if (node.id === nodeId) {
        return { ...node, content }
      }
      return {
        ...node,
        firstChild: node.firstChild ? updateNode(node.firstChild) : null,
        secondChild: node.secondChild ? updateNode(node.secondChild) : null,
      }
    }

    setRootNode(prevNode => updateNode(prevNode))
  }

  const renderContent = (node: PanelNodeCreateInput) => {
    if (!node.firstChild && !node.secondChild) {
      // Leaf node
      return (
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          {/* Split Select */}
          <Select onValueChange={value => addNode(node.id ?? '', value as SplitDirectionEnum)}>
            <SelectTrigger className='mb-2'>Split</SelectTrigger>
            <SelectContent>
              {Object.values(SplitDirectionEnum).map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Content Select */}
          <Select onValueChange={value => setContent(node.id ?? '', value as PanelContentEnum)}>
            <SelectTrigger>Set Content</SelectTrigger>
            <SelectContent>
              {Object.values(PanelContentEnum).map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    }
    return null
  }

  const clearLayout = () => {
    setRootNode({
      id: 'root',
      content: PanelContentEnum.Empty,
      split: null,
      firstChild: null,
      secondChild: null,
    })
  }

  return (
    <div className='flex flex-col'>
      <div className='flex justify-center items-center'>
        <div className='h-[50vh] w-[50vw] border-2 rounded-2xl flex overflow-hidden'>
          <PanelLayout node={rootNode} renderContent={renderContent} />
        </div>
      </div>
      <div className='flex justify-center items-center space-x-4 mt-4'>
        <Button variant='outline' onClick={clearLayout}>
          Clear
        </Button>
        <Button variant='outline'>Save</Button>
      </div>
    </div>
  )
}
