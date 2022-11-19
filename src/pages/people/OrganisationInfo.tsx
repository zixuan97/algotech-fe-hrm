import React, { useEffect, useState, useContext } from 'react';
import '../../styles/people/orgChart.scss';
import { Layout, Typography, Divider, Space, Spin, Button } from 'antd';
import { Tree } from 'react-organizational-chart';
import { TreeNode, User, UserRole } from 'src/models/types';
import {
  assignSubordinatesToManager,
  getAllEmployees,
  getCEO,
  getOrganisationHierarchy,
  setCEO
} from 'src/services/peopleService';
import authContext from 'src/context/auth/authContext';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import ChartNode from 'src/components/people/ChartNode';
import StyledNode from 'src/components/people/StyledNode';
import { PEOPLE_ORGCHART_URL } from 'src/components/routes/routes';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import themeContext from 'src/context/theme/themeContext';
import EditChartSidebar from 'src/components/people/EditChartSidebar';
import { Content } from 'antd/lib/layout/layout';
import { ApartmentOutlined } from '@ant-design/icons';

const OrganisationChart = () => {
  const { updateBreadcrumbItems } = useContext(breadcrumbContext);

  const { user } = useContext(authContext);
  const { isDarkMode } = useContext(themeContext);

  const [ceo, setCeo] = useState<User>();
  const [allEmployees, setAllEmployees] = useState<User[]>([]);
  const [managerLessEmployees, setManagerLessEmployees] = useState<User[]>([]);
  const [availableManagers, setAvailableManagers] = useState<User[]>([]);
  const [organisationTree, setOrganisationTree] = useState<TreeNode[]>([]);
  const [collapseSideBar, setCollapsedSideBar] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    updateBreadcrumbItems([
      {
        label: 'Org Chart',
        to: PEOPLE_ORGCHART_URL
      }
    ]);
  }, [updateBreadcrumbItems]);

  const handleSetNewCeo = async (id: string | number) => {
    setLoading(true);
    await asyncFetchCallback(setCEO(id), (res) => {
      setCeo(res);
      loadChart();
    });
  };

  const handleAssignManagerToEmployee = async (body: {
    id: number;
    users: { id: number }[];
  }) => {
    setLoading(true);
    await asyncFetchCallback(assignSubordinatesToManager(body), () => {
      loadChart();
    });
  };

  const handleCloseSideBar = () => {
    setCollapsedSideBar(true);
  };

  const loadChart = () => {
    setLoading(true);
    asyncFetchCallback(
      getCEO(),
      (ceoData) => {
        setCeo(ceoData);

        if (ceoData !== undefined) {
          asyncFetchCallback(getOrganisationHierarchy(), (res) => {
            const employeesWithoutManger: User[] = [];
            res.forEach((treeNode: TreeNode) => {
              if (treeNode.user.manager === null) {
                employeesWithoutManger.push(treeNode.user);
              }
            });
            setManagerLessEmployees(employeesWithoutManger);
            res = res.filter(
              (treeNode: TreeNode) => treeNode.user.manager !== null
            );
            setOrganisationTree([res[0]]);
          });
        }
      },
      () => void 0,
      { updateLoading: setLoading }
    );
  };

  useEffect(() => {
    setLoading(true);
    asyncFetchCallback(getAllEmployees(), (res) => {
      res = res.filter(
        (user: User) =>
          user.role !== UserRole.CUSTOMER && user.role !== UserRole.B2B
      );
      setAllEmployees(res);
      res = res.filter((user: User) => user.role !== UserRole.INTERN);
      setAvailableManagers(res);
    });
    loadChart();
  }, []);

  if (loading) {
    return (
      <>
        <Typography.Title level={2}>Org Chart</Typography.Title>
        <Typography>
          A one-stop shop to see who reports to who. Accuracy depends on
          everyone having the "Manager" field set for each user.
        </Typography>
        <Spin spinning={loading} size='large'>
          <Space direction='vertical' className='org-chart-space'>
            <ApartmentOutlined
              style={{
                color: '#D9D9D9',
                fontSize: '200px',
                paddingTop: '4rem',
                paddingBottom: '2rem'
              }}
            />
          </Space>
        </Spin>
      </>
    );
  }

  if (ceo) {
    return (
      <Layout>
        <Layout>
          <div className='org-chart-heading-container'>
            <div className='org-chart-column-display'>
              <Typography.Title level={2}>Org Chart</Typography.Title>
              <Typography>
                A one-stop shop to see who reports to who. Accuracy depends on
                everyone having the "Manager" field set for each user.
              </Typography>
            </div>
            {user!.role === 'ADMIN' && (
              <Button type='primary' onClick={() => setCollapsedSideBar(false)}>
                Edit Chart
              </Button>
            )}
          </div>
          <Content className='org-chart-layout-content'>
            <div className='org-chart-container'>
              <Tree
                lineWidth={'2px'}
                lineColor={isDarkMode ? '#f3cc62' : '#96694c'}
                lineBorderRadius={'10px'}
                label={<StyledNode treeNode={organisationTree[0]} />}
              >
                <ChartNode
                  treeNodes={
                    organisationTree[0] ? organisationTree[0].subordinates : []
                  }
                />
              </Tree>
            </div>
          </Content>
        </Layout>
        {!collapseSideBar && (
          <Divider type='vertical' className='org-chart-sider-divider' />
        )}
        <EditChartSidebar
          handleCloseSideBar={handleCloseSideBar}
          visible={collapseSideBar}
          ceo={ceo}
          allEmployees={allEmployees}
          managerLessEmployees={managerLessEmployees}
          availableManagers={availableManagers}
          handleSetNewCeo={handleSetNewCeo}
          handleAssignManagerToEmployee={handleAssignManagerToEmployee}
        />
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Layout>
          <div className='org-chart-heading-container'>
            <div className='org-chart-column-display'>
              <Typography.Title level={2}>Org Chart</Typography.Title>
              <Typography>
                A one-stop shop to see who reports to who. Accuracy depends on
                everyone having the "Manager" field set for each user.
              </Typography>
            </div>
            <Button type='primary' onClick={() => setCollapsedSideBar(false)}>
              Edit Chart
            </Button>
          </div>
          <Content className='org-chart-layout-content'>
            <Space direction='vertical' className='org-chart-space'>
              <ApartmentOutlined
                style={{
                  color: '#D9D9D9',
                  fontSize: '200px',
                  paddingTop: '4rem',
                  paddingBottom: '2rem'
                }}
              />
              <Typography.Title level={3}>
                An Org Chart hasn't been created yet
              </Typography.Title>
              <Typography>
                Start building your Org Chart by selecting the CEO.
              </Typography>
            </Space>
          </Content>
        </Layout>
        {!collapseSideBar && (
          <Divider type='vertical' className='org-chart-sider-divider' />
        )}
        <EditChartSidebar
          visible={collapseSideBar}
          handleCloseSideBar={handleCloseSideBar}
          availableManagers={availableManagers}
          handleSetNewCeo={handleSetNewCeo}
          handleAssignManagerToEmployee={handleAssignManagerToEmployee}
        />
      </Layout>
    );
  }
};

export default OrganisationChart;
