export const charCodeSetsCache = (() => {
  const caches = new Map<string, Set<number>>();
  return {
    for(letters: string) {
      const cache = caches.get(letters);
      if (cache) return cache;
      const charCodes = letters.split("").map((letter) => letter.charCodeAt(0));
      const newCache = new Set(charCodes);
      caches.set(letters, newCache);
      return newCache;
    },
  };
})();
