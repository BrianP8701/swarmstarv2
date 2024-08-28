import React from 'react';
import { CustomNodeElementProps } from 'react-d3-tree';

export const TreeNode: React.FC<CustomNodeElementProps> = ({ nodeDatum }) => {
    return (
        <g>
            <circle r="40" fill="lightblue" />
            <text className='text-sm' dy="0.35em" textAnchor="middle">
                {nodeDatum.name}
            </text>
        </g>
    );
};

