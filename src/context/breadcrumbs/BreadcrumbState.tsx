import { Breadcrumb } from 'antd';
import { startCase } from 'lodash';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useDebounce from 'src/hooks/useDebounce';
import { FRONT_SLASH } from 'src/utils/constants';
import BreadcrumbContext, { BreadcrumbItem } from './breadcrumbContext';

const BreadcrumbState = ({ children }: React.PropsWithChildren) => {
  const location = useLocation();
  const [breadcrumbItems, setBreadcrumbItems] = React.useState<
    BreadcrumbItem[]
  >([]);

  const debouncedBreadcrumbs = useDebounce(breadcrumbItems, 20);

  React.useEffect(() => {
    setBreadcrumbItems([]);
  }, [location.pathname]);

  const updateBreadcrumbItems = React.useCallback(
    (updatedItems: BreadcrumbItem[]) => {
      if (breadcrumbItems.length === 0) {
        setBreadcrumbItems(updatedItems);
      }
    },
    [breadcrumbItems]
  );

  const getBreadcrumbItems = React.useCallback(() => {
    if (debouncedBreadcrumbs.length) {
      return debouncedBreadcrumbs.map((item, index) => (
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
  }, [location, debouncedBreadcrumbs]);

  return (
    <BreadcrumbContext.Provider
      value={{
        breadcrumbItems,
        updateBreadcrumbItems,
        getBreadcrumbItems
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};

export default BreadcrumbState;
