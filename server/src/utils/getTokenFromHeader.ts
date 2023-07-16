export const getTokenFromHeader = (header: string): string => {
  return header.split(" ")[1];
};
