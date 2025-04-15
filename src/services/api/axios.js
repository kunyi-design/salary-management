import BaseRESTFul from './BaseRESTFul'

const axiosClient = new BaseRESTFul({
  baseURL: import.meta.env.VITE_APP_URL_API || 'http://192.168.0.90:5000/api',
  tokenKey: 'token',
  refreshUrl: 'users/refresh',
  onRefreshFail: () => {
    localStorage.removeItem('token')
  },
})

export default axiosClient.getInstance()
