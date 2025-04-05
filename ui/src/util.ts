type FetchOptions = RequestInit & { timeout?: number }

const fetchWithTimeout = async (
  resource: string,
  options: FetchOptions,
): Promise<Response> => {
  const { timeout = 8000 } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  })
  clearTimeout(id)

  return response
}

export { fetchWithTimeout }
