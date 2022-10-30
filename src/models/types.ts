export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  status: UserStatus;
  isVerified: boolean;
  company?: string;
  contactNo?: string;
}
