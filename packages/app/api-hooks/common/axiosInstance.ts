import { supabase } from 'app/utils/supabase'
import axios from 'axios'
import Constants from 'expo-constants'

const getHostname = () => {
  const hostUri = Constants.expoConfig?.hostUri
  if (!hostUri) return '127.0.0.1'

  const parts = hostUri.split(':')
  if (parts.length >= 3) {
    return parts[1]?.replace(/\/\//g, '') || '127.0.0.1'
  } else if (parts.length === 2) {
    return parts[0] || '127.0.0.1'
  }
  return '127.0.0.1'
}

const productionUri = ''
const developmentUri = `http://${getHostname()}:5001`

const uri =
  process.env.NODE_ENV === 'production' ? productionUri : developmentUri

const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getAccessToken = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token
}

axiosInstance.interceptors.request.use(
  async (config) => {
    // 예: 인증 토큰 추가
    const token = await getAccessToken()
    // setting related icon for readabilty
    // console.log('🔔 AxiosInstance token', token)
    if (token) {
      config.headers.authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export default axiosInstance
