import { VBase } from '@vtex/api'
import axios, { AxiosInstance, AxiosPromise } from 'axios'

import { userAuthTokenBucket } from '../utils/conf'
import VtexIdClient from './vtexIdClient'

interface AuthTokenJson {
  authToken: string
}

interface AuthorizationHeader {
  Authorization: string
}

interface ProjectsData {
  Projects: string[]
}

interface ManifestsData {
  Manifests: Deployment[]
}

export default class KotoClient {
  private client: AxiosInstance
  private kotoAuthToken: string
  private userAuthToken: string
  private vbase: VBase
  private vtexIdClient: VtexIdClient

  constructor(ioContext: IOContext, vbase: VBase, userAuthToken: string) {
    this.client = axios.create({
      baseURL: 'http://koto.vtex.com/api',
      headers: {
        'Api-Version': '2',
        'Proxy-Authorization': ioContext.authToken,
        'VtexIdclientAutCookie': userAuthToken,
        'X-Vtex-Proxy-To': 'https://koto.vtex.com'
      }
    })
    this.userAuthToken = userAuthToken
    this.vtexIdClient = new VtexIdClient(ioContext)
    this.vbase = vbase
  }

  public async getDeployments(page: number, appName?: string, retry?: boolean): Promise<Deployment[]> {
    const requestURL = appName
      ? '/VersionManifest/' + appName
      : '/VersionManifest'
    const kotoAuthToken = await this.getKotoAuthTokenFromVBase()

    try {
      const params = { p: page }
      const response = await this.getDataFromKoto<ManifestsData>(requestURL, kotoAuthToken, params)

      return response.data.Manifests
    } catch (error) {
      if (!retry && error.response && error.response.status === 401) {
        await this.renewToken()
        return this.getDeployments(page, appName, true)
      }
      console.log(error)

      return []
    }
  }

  public async getDeployment(appName: string, id: string, retry?: boolean): Promise<Deployment> {
    const requestURL = 'VersionManifest/' + appName + '/' + id
    const kotoAuthToken = await this.getKotoAuthTokenFromVBase()

    try {
      const response = await this.getDataFromKoto<Deployment>(requestURL, kotoAuthToken)

      return response.data
    } catch (e) {
      if (!retry && e.response && e.response.status === 401) {
        await this.renewToken()
        return this.getDeployment(appName, id, true)
      }

      console.log(e)
      return null
    }
  }

  public async getStatistic(appName?: string, retry?: boolean): Promise<StatisticFromKoto> {
    const requestURL = appName
      ? '/Statistics/VersionManifest/' + appName
      : '/Statistics/VersionManifest'
    const kotoAuthToken = await this.getKotoAuthTokenFromVBase()

    try {
      const response = await this.getDataFromKoto<StatisticFromKoto>(requestURL, kotoAuthToken)

      return response.data
    } catch (e) {
      if (!retry && e.response && e.response.status === 401) {
        await this.renewToken()
        return this.getStatistic(appName, true)
      }
      console.log(e)

      return null
    }
  }

  public async getProjects(retry?: boolean): Promise<string[]> {
    const requestURL = '/Project'
    const kotoAuthToken = await this.getKotoAuthTokenFromVBase()

    try {
      const response = await this.getDataFromKoto<ProjectsData>(requestURL, kotoAuthToken)

      return response.data.Projects as string[]
    } catch (e) {
      if (!retry && e.response && e.response.status === 401) {
        await this.renewToken()
        return this.getProjects(true)
      }
      console.log(e)

      return []
    }
  }

  private async getKotoAuthTokenFromVBase(): Promise<string> {
    if (this.kotoAuthToken) {
      return this.kotoAuthToken
    }

    try {
      const { userId } = await this.vtexIdClient.getUserInformation(this.userAuthToken)
      const vbaseAuthToken = await this.vbase.getJSON<AuthTokenJson>(userAuthTokenBucket, userId, true)
      this.kotoAuthToken = vbaseAuthToken.authToken
      return this.kotoAuthToken
    } catch (error) {
      console.log(error)
    }
  }

  private async renewToken(): Promise<void> {
    try {
      const { userId } = await this.vtexIdClient.getUserInformation(this.userAuthToken) 
      const newToken = await this.client.post('/Authentication')
      this.kotoAuthToken = newToken.data
      await this.vbase.saveJSON<object>(userAuthTokenBucket, userId, { authToken: this.kotoAuthToken })
    } catch (error) {
      console.log(error)
    }
  }

  private getDataFromKoto<T>(url: string, authToken: string, params?: any): AxiosPromise<T> {
    return this.client.get<T>(url, {
      headers: this.getAuthorizationHeader(authToken),
      params
    })
  }

  private getAuthorizationHeader(authToken: string): AuthorizationHeader {
    return {
      'Authorization': 'Bearer ' + authToken
    }
  }
}