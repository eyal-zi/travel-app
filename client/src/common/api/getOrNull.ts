import axios, { type AxiosResponse } from 'axios'








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
