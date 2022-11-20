import { Breadcrumb } from 'antd';
import { startCase } from 'lodash';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useHasChanged from 'src/hooks/useHasChanged';
import { FRONT_SLASH } from 'src/utils/constants';
import BreadcrumbContext, { BreadcrumbItem } from './breadcrumbContext';

const BreadcrumbState = ({ children }: React.PropsWithChildren) => {
  const location = useLocation();
  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadcrumbItem[]
  >([]);

  const hasPathChanged = useHasChanged(location.pathname);
  const hasBreadcrumbItemsChanged = useHasChanged(breadcrumbItems);

  console.log(hasPathChanged, hasBreadcrumbItemsChanged);

  React.useEffect(() => {
    if (hasPathChanged && !hasBreadcrumbItemsChanged) {
      setBreadcrumbItems([]);
    }
  }, [hasPathChanged, hasBreadcrumbItemsChanged]);

  const getBreadcrumbItems = React.useCallback(
    (breadcrumbItems: BreadcrumbItem[]) => {
      if (breadcrumbItems.length) {
        return breadcrumbItems.map((item, index) => (
          <Breadcrumb.Item key={index}>
            <Link to={item.to}>{item.label}</Link>
          </Breadcrumb.Item>
        ));
      } else {
        const locations = location.pathname.split(FRONT_SLASH);
        const breadcrumbs = [];
        let currPath = '';
        for (let i = 0; i < locations.length; i++) {
          currPath = `${currPath}${locations[i]}/`;
          const actualPath = currPath.replace(/\/+$/, '');

          breadcrumbs.push(
            <Breadcrumb.Item key={actualPath}>
              <Link to={actualPath}>{startCase(locations[i])}</Link>
            </Breadcrumb.Item>
          );
        }
        return breadcrumbs.slice(1);
      }
    },
    [location]
  );

  return (
    <BreadcrumbContext.Provider
      value={{
        breadcrumbItems,
        updateBreadcrumbItems: setBreadcrumbItems,
        getBreadcrumbItems
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};

export default BreadcrumbState;
