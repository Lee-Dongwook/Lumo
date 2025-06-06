import axios from 'axios'
import { createClient } from '../supabase/client'
import { toast } from 'react-toastify'

const apiVersion = '/v1'

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BASE_URL_PROD + apiVersion
      : process.env.NEXT_PUBLIC_BASE_URL_DEV + apiVersion,
})

axiosInstance.interceptors.request.use(async (config) => {
  const supabase = createClient()
  const accessToken =
    sessionStorage.getItem('accessToken') ||
    (await supabase.auth.getSession()).data.session?.access_token

  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase()
    if (method && ['post', 'put', 'delete', 'patch'].includes(method)) {
      toast.success('Successfully')
    }
    return response
  },
  (error) => {
    toast.error(error.response?.data?.message || 'An error occurred')
    return Promise.reject(error)
  },
)

export default axiosInstance
