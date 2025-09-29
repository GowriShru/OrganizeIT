// Performance monitoring utilities

export const measurePerformance = (name: string, fn: () => Promise<any>) => {
  return async () => {
    const start = performance.now()
    try {
      const result = await fn()
      const end = performance.now()
      console.log(`⏱️ ${name} completed in ${(end - start).toFixed(2)}ms`)
      return result
    } catch (error: any) {
      const end = performance.now()
      console.log(`❌ ${name} failed after ${(end - start).toFixed(2)}ms:`, error.message)
      throw error
    }
  }
}

export const withTimeout = (promise: Promise<any>, timeoutMs: number, timeoutMessage?: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(timeoutMessage || `Operation timed out after ${timeoutMs}ms`))
    }, timeoutMs)

    promise
      .then((result) => {
        clearTimeout(timeoutId)
        resolve(result)
      })
      .catch((error) => {
        clearTimeout(timeoutId)
        reject(error)
      })
  })
}

export const createAbortableRequest = (url: string, options: RequestInit = {}, timeoutMs: number = 5000) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const request = fetch(url, {
    ...options,
    signal: controller.signal
  }).finally(() => {
    clearTimeout(timeoutId)
  })

  return { request, controller }
}