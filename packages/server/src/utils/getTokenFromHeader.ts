export const getTokenFromHeader = (header: string): string | undefined => {
  if (!header) return undefined;
  const splitted = header.split(" ");
  return splitted.length === 2 ? header.split(" ")[1] : undefined;
};
