const ignoredPaths = [
  "/docs",
  "/ui",
  //
];

export function isIgnoredPath(path: string) {
  return ignoredPaths.some((ignoredPath) => path.startsWith(ignoredPath));
}
