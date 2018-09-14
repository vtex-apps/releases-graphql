import { VBase } from '@vtex/api'

import { AuthenticationError } from '../errors/AuthenticationError'
import { getTokenFromCookies } from '../utils/vtexid'

import DeloreanClient from './deloreanClient'
import KotoClient from './kotoClient'

export default class Resources {
  public clientAuthToken: string
  public deloreanClient: DeloreanClient
  public kotoClient: KotoClient
  public vbase: VBase

  constructor(ctx: ColossusContext) {
    const cookies = ctx.request.header.cookie ? ctx.request.header.cookie : ''
    const VtexIdclientAutCookie = getTokenFromCookies(cookies)

    if (!VtexIdclientAutCookie) {
      throw new AuthenticationError()
    }

    this.vbase = new VBase(ctx.vtex)
    this.deloreanClient = new DeloreanClient(ctx.vtex)
    this.kotoClient = new KotoClient(ctx.vtex, this.vbase, VtexIdclientAutCookie)
  }
}
