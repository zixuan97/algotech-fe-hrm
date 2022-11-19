import React from 'react';
import '../../styles/people/orgChart.scss';
import { Avatar, Card, Typography } from 'antd';
import { TreeNode } from 'src/models/types';
import { getUserFullName } from 'src/utils/formatUtils';
import ViewUserModal from './ViewUserModal';

interface StyledNodeProps {
  treeNode?: TreeNode;
}

const StyledNode = ({ treeNode }: StyledNodeProps) => {
  const [openViewUserModal, setOpenViewUserModal] =
    React.useState<boolean>(false);

  return (
    <div className='node-container'>
      <Card
        className='node-card'
        hoverable
        onClick={() => setOpenViewUserModal(true)}
      >
        <Avatar className='node-avatar'>
          {`${treeNode?.user.firstName.charAt(
            0
          )}${treeNode?.user.lastName.charAt(0)}`}
        </Avatar>
        <Typography className='node-card-title'>
          {getUserFullName(treeNode?.user)}
        </Typography>
        <Typography className='node-card-text'>
          {treeNode?.user.role}
        </Typography>
      </Card>
      <ViewUserModal
        open={openViewUserModal}
        onClose={() => setOpenViewUserModal(false)}
        user={treeNode?.user}
      />
    </div>
  );
};

export default StyledNode;
