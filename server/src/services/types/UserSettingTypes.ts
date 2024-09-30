type WindowContent = 'InformationGraph' | 'ActionGraph' | 'ToolGraph' | 'Chat'

interface LayoutNode {
  id: string
  content?: WindowContent
  split?: 'horizontal' | 'vertical'
  children?: [LayoutNode, LayoutNode]
  size?: number // Percentage or fraction of parent's size
}

export type LayoutConfig = LayoutNode
