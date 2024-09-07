import React from 'react';
import { CustomNodeElementProps } from 'react-d3-tree';

export const TreeNode: React.FC<CustomNodeElementProps> = ({ nodeDatum }) => {
    console.log('Node data:', nodeDatum);

    return (
        <g>
            <circle r="50" fill="white" />
            <text
                className='text-xs'
                style={{
                    fontWeight: 1,
                    letterSpacing: '0.05em'
                }}
                dy="0.35em"
                textAnchor="middle"
            >
                {typeof nodeDatum.name === 'string' ? nodeDatum.name : 'Unknown'}
            </text>
        </g>
    );
};
