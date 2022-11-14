import React from 'react';
import Card from 'antd';

import { TreeNode } from 'src/models/types';

import '../../styles/people/chartNode.scss';

interface ChartNodeProps {
  treeNodes: TreeNode[];
}

const ChartNode = ({ treeNodes }: ChartNodeProps) => {
  console.log(treeNodes);
  return (
    <ul>
      {treeNodes.map((node, index) => (
        <>
          <li>
            {`child ${node.id}`}
            {node.subordinates.length > 0 && (
              <ChartNode treeNodes={node.subordinates} />
            )}
          </li>
        </>
      ))}
    </ul>
  );
};

export default ChartNode;
