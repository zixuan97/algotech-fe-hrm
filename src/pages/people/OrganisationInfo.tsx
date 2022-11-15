import React, { useEffect, useState } from 'react';

import { TreeNode } from 'src/models/types';
import { getOrganisationHierarchy } from 'src/services/peopleService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import ChartNode from 'src/components/people/ChartNode';

import '../../styles/people/chartNode.scss';

const OrganisationChart = () => {
  const [organisationTree, setOrganisationTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getOrganisationHierarchy(),
      (res) => {
        const data = [res[1]];
        setOrganisationTree(data);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className='chart-node'>
      <div>Chart</div>
      <ChartNode treeNodes={organisationTree} />
    </div>
  );
};

export default OrganisationChart;
