export function joinPath(...paths: string[]) {
  return paths.join('/').replace(/\/+/g, '/')
}
