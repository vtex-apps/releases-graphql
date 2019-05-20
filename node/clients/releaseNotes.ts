import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

const DEFAULT_PAGE = 1
const DEFAULT_PER_PAGE = 10

export default class ReleaseNotes extends ExternalClient {
  constructor (context: IOContext, opts?: InstanceOptions) {
    super('http://rlsnts-env-stable.us-east-1.elasticbeanstalk.com', context, opts)
  }

  public async getReleaseNotes(page: number): Promise<any> {
    return this.http.get('/releases', {
      params: {
        page: page ? page : DEFAULT_PAGE,
        perPage: DEFAULT_PER_PAGE,
      },
    })
  }
}
