import React from 'react';
import { TreeNode as Node } from 'react-organizational-chart';
import { TreeNode } from 'src/models/types';
import StyledNode from './StyledNode';

interface ChartNodeProps {
  treeNodes: TreeNode[];
}

const ChartNode = ({ treeNodes }: ChartNodeProps) => {
  return (
    <>
      {treeNodes.map((node) => {
        if (!node.subordinates.length) {
          return <Node label={<StyledNode treeNode={node} />} />;
        }
        return (
          <Node label={<StyledNode treeNode={node} />}>
            <ChartNode treeNodes={node.subordinates} />
          </Node>
        );
      })}
    </>
  );
};

export default ChartNode;
