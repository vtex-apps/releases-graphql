import { AuthenticationError, InstanceOptions, IOClients, IOContext } from '@vtex/api'

import Delorean from './delorean'
import Koto from './koto'
import ReleaseNotes from './releaseNotes'

export class Clients extends IOClients {
  constructor (
    clientOptions: Record<string, InstanceOptions>,
    ctx: IOContext
  ) {
    if (!ctx.adminUserAuthToken) {
      throw new AuthenticationError('Admin credentials are required.')
    }

    super(clientOptions, ctx)
  }

  public get delorean() {
    return this.getOrSet('delorean', Delorean)
  }

  public get koto() {
    return this.getOrSet('koto', Koto)
  }

  public get releaseNotes() {
    return this.getOrSet('releaseNotes', ReleaseNotes)
  }
}
