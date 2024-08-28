import React from 'react';
import { CustomNodeElementProps } from 'react-d3-tree';

export const TreeNode: React.FC<CustomNodeElementProps> = ({ nodeDatum }) => {
    return (
        <g>
            <circle r="40" fill="lightblue" />
            <text 
                className='text-xs text-thin font-sans' 
                dy="0.35em" 
                textAnchor="middle"
                style={{ fontFamily: 'inherit' }}
            >
                {nodeDatum.name}
            </text>
        </g>
    );
};

