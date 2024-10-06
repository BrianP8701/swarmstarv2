import { useState } from 'react';
import {
  PanelContentEnum,
  SplitDirectionEnum,
  PanelNodeCreateInput,
} from '@/graphql/generated/graphql';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { CircleMinus } from 'lucide-react';

export function PanelLayoutEditor() {
  const [rootNode, setRootNode] = useState<PanelNodeCreateInput>({
    id: 'root',
    content: PanelContentEnum.Empty,
    split: null,
    firstChild: null,
    secondChild: null,
  });

  const addNode = (nodeId: string, split: SplitDirectionEnum) => {
    const newNode1: PanelNodeCreateInput = {
      id: `${Date.now()}-1`,
      content: PanelContentEnum.Empty,
      split: null,
      firstChild: null,
      secondChild: null,
    };
    const newNode2: PanelNodeCreateInput = {
      id: `${Date.now()}-2`,
      content: PanelContentEnum.Empty,
      split: null,
      firstChild: null,
      secondChild: null,
    };

    const updateNode = (node: PanelNodeCreateInput): PanelNodeCreateInput => {
      if (node.id === nodeId) {
        return {
          ...node,
          split,
          firstChild: newNode1,
          secondChild: newNode2,
        };
      }
      return {
        ...node,
        firstChild: node.firstChild ? updateNode(node.firstChild) : null,
        secondChild: node.secondChild ? updateNode(node.secondChild) : null,
      };
    };

    setRootNode((prevNode) => updateNode(prevNode));
  };

  const setContent = (nodeId: string, content: PanelContentEnum) => {
    const updateNode = (node: PanelNodeCreateInput): PanelNodeCreateInput => {
      if (node.id === nodeId) {
        return { ...node, content };
      }
      return {
        ...node,
        firstChild: node.firstChild ? updateNode(node.firstChild) : null,
        secondChild: node.secondChild ? updateNode(node.secondChild) : null,
      };
    };

    setRootNode((prevNode) => updateNode(prevNode));
  };

  const removeSplit = (nodeId: string) => {
    const updateNode = (node: PanelNodeCreateInput): PanelNodeCreateInput => {
      if (node.id === nodeId) {
        return { ...node, split: null, firstChild: null, secondChild: null };
      }
      return {
        ...node,
        firstChild: node.firstChild ? updateNode(node.firstChild) : null,
        secondChild: node.secondChild ? updateNode(node.secondChild) : null,
      };
    };

    setRootNode((prevNode) => updateNode(prevNode));
  };

  const renderNode = (
    node: PanelNodeCreateInput,
    parentSplit: SplitDirectionEnum | null = null,
    position: 'first' | 'second' | null = null
  ) => {
    // Determine border classes based on position
    let borderClasses = '';

    if (parentSplit === 'HORIZONTAL') {
      if (position === 'first') {
        borderClasses = 'border-r';
      }
    } else if (parentSplit === 'VERTICAL') {
      if (position === 'first') {
        borderClasses = 'border-b';
      }
    } else {
      borderClasses = 'border';
    }

    return (
      <div
        key={node.id}
        className={`flex ${
          node.split === 'HORIZONTAL' ? 'flex-row' : 'flex-col'
        } ${borderClasses}`}
        style={{ flex: 1, position: 'relative' }}
      >
        {!node.firstChild && !node.secondChild && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Split Select */}
            <Select onValueChange={(value) => addNode(node.id ?? '', value as SplitDirectionEnum)}>
              <SelectTrigger className="mb-2">Split</SelectTrigger>
              <SelectContent>
                {Object.values(SplitDirectionEnum).map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Content Select */}
            <Select onValueChange={(value) => setContent(node.id ?? '', value as PanelContentEnum)}>
              <SelectTrigger>Set Content</SelectTrigger>
              <SelectContent>
                {Object.values(PanelContentEnum).map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {node.firstChild && node.secondChild && (
          <div
            className={`absolute ${
              node.split === 'HORIZONTAL'
                ? 'top-0 bottom-0 left-1/2'
                : 'left-0 right-0 top-1/2'
            } flex justify-center items-center`}
            style={{ transform: 'translate(-50%, -50%)', zIndex: 10 }}
          >
            <button
              onClick={() => removeSplit(node.id ?? '')}
              className="bg-red-500 text-white rounded-full p-1"
            >
              <CircleMinus size={16} />
            </button>
          </div>
        )}
        {/* Recursively render children */}
        {node.firstChild && renderNode(node.firstChild, node.split, 'first')}
        {node.secondChild && renderNode(node.secondChild, node.split, 'second')}
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="h-[40vh] w-[40vw] border-2 rounded-2xl flex overflow-hidden">
        {renderNode(rootNode)}
      </div>
    </div>
  );
}
