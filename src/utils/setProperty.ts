const setProperty = (object: unknown, key: string, value: unknown) => {
  (object as Record<string, unknown>)[key] = value;
};

export { setProperty };
