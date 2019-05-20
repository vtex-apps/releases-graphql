import { AuthenticationError, ExternalClient, InstanceOptions, IOContext, LRUCache } from '@vtex/api'

import VtexId from './vtexId'

interface ProjectsData {
  Projects: string[]
}

interface ManifestsData {
  Manifests: Deployment[]
}

const kotoTokenCache = new LRUCache<string, string | null>({max: 5000})

export default class Koto extends ExternalClient {
  private vtexIdClient: VtexId

  constructor (context: IOContext, opts?: InstanceOptions) {
    super('http://koto.vtex.com/api', context, {
      ...opts,
      headers: {
        'Api-Version': '2',
        'VtexIdclientAutCookie': context.adminUserAuthToken!,
        'x-vtex-use-https': 'true',
      },
    })

    this.vtexIdClient = new VtexId(context)
  }

  public async getDeployments(page: number, appName?: string): Promise<Deployment[]> {
    const requestURL = appName
      ? '/VersionManifest/' + appName
      : '/VersionManifest'

    const params = { p: page }
    const {Manifests} = await this.get<ManifestsData>(requestURL, params)
    return Manifests
  }

  public async getDeployment(appName: string, id: string): Promise<Deployment> {
    const requestURL = 'VersionManifest/' + appName + '/' + id
    return this.get<Deployment>(requestURL)
  }

  public async getStatistic(appName?: string): Promise<StatisticFromKoto> {
    const requestURL = appName
      ? '/Statistics/VersionManifest/' + appName
      : '/Statistics/VersionManifest'

    return this.get<StatisticFromKoto>(requestURL)
  }

  public async getProjects(): Promise<string[]> {
    const {Projects} = await this.get<ProjectsData>('/Project')
    return Projects
  }

  private async getKotoToken(): Promise<string> {
    const cached = kotoTokenCache.get(this.context.adminUserAuthToken!)
    if (cached) {
      return cached
    }

    const { userId } = await this.vtexIdClient.getUserInformation(this.context.adminUserAuthToken!)
    if (!userId) {
      throw new AuthenticationError('Not a valid VTEX ID user')
    }

    const newToken = await this.http.post<string>('/Authentication')
    kotoTokenCache.set(this.context.adminUserAuthToken!, newToken)
    return newToken
  }

  private async get<T>(url: string, params?: any): Promise<T> {
    return this.http.get<T>(url, {
      headers: {
        'Authorization': 'Bearer ' + await this.getKotoToken(),
      },
      params,
    }).catch(async (e: any) => {
      if (e.response && e.response.status === 401) {
        // Clean cache and retry once with new token
        kotoTokenCache.set(this.context.adminUserAuthToken!, null)
        return this.http.get<T>(url, {
          headers: {
            'Authorization': 'Bearer ' + await this.getKotoToken(),
          },
          params,
        })
      }
      throw e
    })
  }
}
