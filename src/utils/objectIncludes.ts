export default <T>(obj: T, ...requiredItems: string[]): boolean => {
  const keys = Object.keys(obj);

  return requiredItems.every(item => keys.includes(item));
};
