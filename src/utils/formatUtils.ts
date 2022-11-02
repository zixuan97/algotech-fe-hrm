export const stripHtml = (htmlString?: string): string => {
  if (!htmlString) return '';
  const temp = document.createElement('div');
  temp.innerHTML = htmlString;
  return temp.textContent ?? temp.innerText;
};
