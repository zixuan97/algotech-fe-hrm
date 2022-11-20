import React from 'react';

export interface BreadcrumbItem {
  label: string;
  to: string;
}

type BreadcrumbStateInit = {
  breadcrumbItems: BreadcrumbItem[];
  updateBreadcrumbItems: (breadcrumbItems: BreadcrumbItem[]) => void;
  getBreadcrumbItems: (breadcrumbItems: BreadcrumbItem[]) => React.ReactNode[];
};

const breadcrumbContext = React.createContext({
  breadcrumbItems: [],
  updateBreadcrumbItems: () => void 0,
  getBreadcrumbItems: () => []
} as BreadcrumbStateInit);

export default breadcrumbContext;
