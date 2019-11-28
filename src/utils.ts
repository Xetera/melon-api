export const makeParams = (params: object) => {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&")
}
