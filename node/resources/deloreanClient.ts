import axios, { AxiosInstance } from 'axios'

export default class DeloreanClient {
  private client: AxiosInstance

  constructor(ioContext: IOContext) {
    this.client = axios.create({
      baseURL: 'http://delorean.vtex.com',
      headers: {
        'Proxy-Authorization': ioContext.authToken,
        'VtexIdclientAutCookie': ioContext.authToken,
        'X-Vtex-Proxy-To': 'https://delorean.vtex.com'
      }
    })
  }

  public async getPublications(startDate: string, endDate: string, app?: string): Promise<Publication[]> {
    try {
      const requestParams = app
        ? { app, startDate, endDate }
        : { startDate, endDate }
      const response = await this.client.get('/publications', { params: requestParams })
      const publications = response.data

      return publications
    } catch (e) {
      console.log(e)

      return []
    }
  }

  public async getStatistic(env: string, app?: string): Promise<Statistic> {
    try {
      const requestParams = [ '', 'all' ].includes(env)
        ? { app }
        : { env, app }
      const response = await this.client.get('/publications/totalizers', { params: requestParams })

      return response.data
    } catch (e) {
      console.log(e)

      return null
    }
  }
}