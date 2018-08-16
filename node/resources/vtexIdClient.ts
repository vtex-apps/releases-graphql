import axios, { AxiosInstance } from 'axios'

export interface UserInformationProps {
  userId: string
  user: string
  userType
}

export default class VtexIdClient {
  private client: AxiosInstance

  constructor(ioContext: IOContext) {
    this.client = axios.create({
      baseURL: 'http://vtexid.vtex.com.br/api',
      headers: {
        'Proxy-Authorization': ioContext.authToken,
        'X-Vtex-Proxy-To': 'https://vtexid.vtex.com.br/api'
      }
    })
  }

  public async getUserInformation(authToken: string): Promise<UserInformationProps> {
    const params = { authToken }

    try {
      const response = await this.client.get('/vtexid/pub/authenticated/user', { params })
      
      return response.data
    } catch (e) {
      console.log(e)

      return null
    }
  }
}