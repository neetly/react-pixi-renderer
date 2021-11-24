const getProperty = (object: unknown, key: string) => {
  return (object as Record<string, unknown>)[key];
};

export { getProperty };
