import React, { Fragment } from 'react';
import { TreeNode as Node } from 'react-organizational-chart';
import { TreeNode } from 'src/models/types';

import '../../styles/people/chartNode.scss';
import StyledNode from './StyledNode';

interface ChartNodeProps {
  treeNodes: TreeNode[];
}

const ChartNode = ({ treeNodes }: ChartNodeProps) => {
  return (
    <>
      {treeNodes.map((node) => (
        <Node label={<StyledNode treeNode={node} />}>
          {node.subordinates.length > 0 && (
            <ChartNode treeNodes={node.subordinates} />
          )}
        </Node>
      ))}
    </>
  );

  // return (
  //   <>
  //     {treeNodes.map((node, index) => (
  //       <>
  //         <li className='card'>
  //           {`child ${node.user.id}`}
  //           {node.subordinates.length > 0 && (
  //             <ChartNode treeNodes={node.subordinates} />
  //           )}
  //         </li>
  //       </>
  //     ))}
  //   </>
  // );

  // return (
  //   <ul
  //     style={{
  //       display: 'flex',
  //       flex: '1'
  //     }}
  //   >
  //     {treeNodes.map((item, index) => (
  //       <Fragment key={item.user.id}>
  //         <li>
  //           <div className='card'>
  //             <div className='image'>
  //               <img alt='Profile' />
  //             </div>
  //             <div className='card-body'>
  //               <h4>{item.user.firstName}</h4>
  //               <p>{item.user.lastName}</p>
  //             </div>
  //             <div className='card-footer' style={{ background: 'red' }}>
  //               <img alt='Chat' />
  //               <img alt='Call' />
  //               <img alt='Video' />
  //             </div>
  //             <div></div>
  //           </div>
  //           {item.subordinates.length > 0 && (
  //             <ChartNode treeNodes={item.subordinates} />
  //           )}
  //         </li>
  //       </Fragment>
  //     ))}
  //   </ul>
  // );
};

export default ChartNode;
