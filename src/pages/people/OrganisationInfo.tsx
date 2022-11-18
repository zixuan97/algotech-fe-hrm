import React, { useEffect, useState, useContext } from 'react';
import '../../styles/people/orgChart.scss';
import { Affix, Layout, Typography } from 'antd';
import { Tree } from 'react-organizational-chart';
import { TreeNode } from 'src/models/types';
import { getOrganisationHierarchy } from 'src/services/peopleService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import ChartNode from 'src/components/people/ChartNode';
import StyledNode from 'src/components/people/StyledNode';
import { PEOPLE_ORGCHART_URL } from 'src/components/routes/routes';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import themeContext from 'src/context/theme/themeContext';
import EditChartSidebar from 'src/components/people/EditChartSidebar';
import { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';

const OrganisationChart = () => {
  const { updateBreadcrumbItems } = useContext(breadcrumbContext);
  const { isDarkMode } = useContext(themeContext);

  const [organisationTree, setOrganisationTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    updateBreadcrumbItems([
      {
        label: 'Org Chart',
        to: PEOPLE_ORGCHART_URL
      }
    ]);
  }, [updateBreadcrumbItems]);

  useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getOrganisationHierarchy(),
      (res) => {
        setOrganisationTree([res[0]]);
      },
      () => void 0,
      { updateLoading: setLoading }
    );
  }, []);

  return (
    <Layout>
      <Content
        style={{
          paddingRight: '5rem',
          overflow: 'auto'
        }}
      >
        <Typography.Title level={2}>Org Chart</Typography.Title>
        <Typography>
          A one-stop shop to see who reports to who. Accuracy depends on
          everyone having the "Manager" field filled set for each user.
        </Typography>
        <div className='org-chart-container'>
          <Tree
            lineWidth={'2px'}
            lineColor={isDarkMode ? '#f3cc62' : '#96694c'}
            lineBorderRadius={'10px'}
            label={<StyledNode treeNode={organisationTree[0]} />}
          >
            <ChartNode treeNodes={organisationTree} />
          </Tree>
        </div>
      </Content>
      {/* <EditChartSidebar /> */}
    </Layout>
  );
};

export default OrganisationChart;
