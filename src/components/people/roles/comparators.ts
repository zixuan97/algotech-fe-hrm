import { JobRole, User } from 'src/models/types';

export const sortNameAsc = (a: User, b: User) => {
  let aFullName = a.firstName + ' ' + a.lastName;
  let bFullName = b.firstName + ' ' + b.lastName;
  return aFullName.localeCompare(bFullName);
};

export const sortJobRoleAsc = (a: JobRole, b: JobRole) => {
  return a.jobRole.localeCompare(b.jobRole);
};

export const sortJobRoleDesc = (a: JobRole, b: JobRole) => {
  return b.jobRole.localeCompare(a.jobRole);
};
