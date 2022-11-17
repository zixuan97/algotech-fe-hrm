import { JobRole, User } from 'src/models/types';
import { getUserFullName } from 'src/utils/formatUtils';

export const sortNameAsc = (a: User, b: User) => {
  return getUserFullName(a).localeCompare(getUserFullName(b));
};

export const sortJobRoleAsc = (a: JobRole, b: JobRole) => {
  return a.jobRole.localeCompare(b.jobRole);
};

export const sortJobRoleDesc = (a: JobRole, b: JobRole) => {
  return b.jobRole.localeCompare(a.jobRole);
};
