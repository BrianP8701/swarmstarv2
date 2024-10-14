// src/views/Settings/interface/PanelLayoutEditor.tsx
import { useState } from 'react'
import { PanelLayout } from '@/components/custom/PanelLayout'
import {
  PanelContentEnum,
  SplitDirectionEnum,
  PanelNodeCreateInput,
  useCreatePanelLayoutMutation,
} from '@/graphql/generated/graphql'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { prettifyString } from '@/utils/strings'

export function PanelLayoutEditor() {
  const [nodes, setNodes] = useState<PanelNodeCreateInput[]>([])
  const [rootNodeId, setRootNodeId] = useState<string>('root')

  const [createPanelLayout] = useCreatePanelLayoutMutation()

  // Initialize root node if not already present
  if (!nodes.find(node => node.id === rootNodeId)) {
    setNodes([
      ...nodes,
      {
        id: rootNodeId,
        content: PanelContentEnum.Empty,
        split: null,
        parentId: null,
        firstChildId: null,
        secondChildId: null,
      },
    ])
  }

  const addNode = (nodeId: string, split: SplitDirectionEnum) => {
    const newFirstChildId = `${Date.now()}-1`
    const newSecondChildId = `${Date.now()}-2`

    setNodes(prevNodes => {
      // Update the current node with the split and child IDs
      const updatedNodes = prevNodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            split,
            firstChildId: newFirstChildId,
            secondChildId: newSecondChildId,
          }
        }
        return node
      })

      // Add the new child nodes
      const newNodes: PanelNodeCreateInput[] = [
        {
          id: newFirstChildId,
          content: PanelContentEnum.Empty,
          split: null,
          parentId: nodeId,
          firstChildId: null,
          secondChildId: null,
        },
        {
          id: newSecondChildId,
          content: PanelContentEnum.Empty,
          split: null,
          parentId: nodeId,
          firstChildId: null,
          secondChildId: null,
        },
      ]

      return [...updatedNodes, ...newNodes]
    })
  }

  const setContent = (nodeId: string, content: PanelContentEnum) => {
    setNodes(prevNodes => prevNodes.map(node => (node.id === nodeId ? { ...node, content } : node)))
  }

  const renderContent = (node: PanelNodeCreateInput) => {
    if (!node.firstChildId && !node.secondChildId) {
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
          <Select
            onValueChange={value => setContent(node.id ?? '', value as PanelContentEnum)}
            value={node.content ?? PanelContentEnum.Empty}
          >
            <SelectTrigger>{prettifyString(node.content ?? PanelContentEnum.Empty)}</SelectTrigger>
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
    setNodes([
      {
        id: 'root',
        content: PanelContentEnum.Empty,
        split: null,
        parentId: null,
        firstChildId: null,
        secondChildId: null,
      },
    ])
    setRootNodeId('root')
  }

  const handleSave = async () => {
    try {
      await createPanelLayout({
        variables: {
          input: {
            panelNodeCreateInputs: nodes,
          },
        },
      })
      // Handle successful save (e.g., show a success message)
    } catch (error) {
      console.error('Error creating panel layout:', error)
    }
  }

  return (
    <div className='flex flex-col'>
      <div className='flex justify-center items-center'>
        <div className='h-[50vh] w-[50vw] border-2 rounded-2xl flex overflow-hidden'>
          <PanelLayout nodes={nodes} rootNodeId={rootNodeId} renderContent={renderContent} />
        </div>
      </div>
      <div className='flex justify-center items-center space-x-4 mt-4'>
        <Button variant='outline' onClick={clearLayout}>
          Clear
        </Button>
        <Button variant='outline' onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  )
}
