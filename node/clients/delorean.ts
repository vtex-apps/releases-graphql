import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

export default class Delorean extends ExternalClient {
  constructor (context: IOContext, opts?: InstanceOptions) {
    super('http://delorean.vtex.com', context, {
      ...opts,
      headers: {
        'Api-Version': '2',
        'VtexIdclientAutCookie': context.adminUserAuthToken!,
        'x-vtex-use-https': 'true',
      },
    })
  }

  public async getPublications(startDate: string, endDate: string, app?: string): Promise<Publication[]> {
    const params = app
      ? { app, startDate, endDate }
      : { startDate, endDate }
    return this.http.get('/publications', { params })
  }

  public async getStatistic(env: string, app?: string): Promise<Statistic> {
    const params = [ '', 'all' ].includes(env)
      ? { app }
      : { env, app }
    return this.http.get('/publications/totalizers', { params })
  }
}
