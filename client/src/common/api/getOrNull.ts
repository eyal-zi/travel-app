import axios, { type AxiosResponse } from 'axios'

/**
 * Awaits a request and returns its data, treating a 404 as "no record yet" by
 * resolving to `null` instead of throwing. Any other error propagates.
 *
 * Used by the date-keyed singleton resources (routes, PDFs, weather images)
 * whose endpoints answer 404 when nothing exists on or before the given date.
 */
export const getOrNull = async <T>(
  request: Promise<AxiosResponse<T>>,
): Promise<T | null> => {
  try {
    const { data } = await request
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}
