import { User } from 'src/models/types';

export const stripHtml = (htmlString?: string): string => {
  if (!htmlString) return '';
  const temp = document.createElement('div');
  temp.innerHTML = htmlString;
  return temp.textContent ?? temp.innerText;
};

export const getFirstLastNameInitials = (
  firstName: string,
  lastName: string
): string => {
  if (!firstName?.length && !lastName?.length) return '';
  if (!firstName.length && lastName.length) {
    return lastName.length > 1
      ? lastName.charAt(0) + lastName.charAt(lastName.length - 1)
      : lastName.charAt(0);
  }
  if (firstName.length && !lastName.length) {
    return firstName.length > 1
      ? firstName.charAt(0) + firstName.charAt(firstName.length - 1)
      : firstName.charAt(0);
  }
  return firstName.charAt(0) + lastName.charAt(0);
};

export const getUserFullName = (user: User | null | undefined): string => {
  if (!user) return '';
  return `${user.firstName} ${user.lastName}`;
};
