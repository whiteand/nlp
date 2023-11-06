export const charSetsCache = (() => {
  const caches = new Map<string, Set<string>>();
  return {
    for(letters: string) {
      const cache = caches.get(letters);
      if (cache) return cache;
      const newCache = new Set(letters.split(""));
      caches.set(letters, newCache);
      return newCache;
    },
  };
})();
