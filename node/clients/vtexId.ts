import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

export interface UserInformationProps {
  userId: string
  user: string
  userType: any
}

export default class VtexId extends ExternalClient {
  constructor (context: IOContext, opts?: InstanceOptions) {
    super('http://vtexid.vtex.com.br/api/vtexid/pub', context, {
      ...opts,
      headers: {
        'x-vtex-use-https': 'true',
      },
    })
  }

  public async getUserInformation(authToken: string): Promise<UserInformationProps> {
    return this.http.get('/authenticated/user', { params: { authToken } })
  }
}
