import { VBase } from '@vtex/api'
import { parse as parseCookie } from 'cookie'
import { head, pickBy, values} from 'ramda'
import DeloreanClient from './deloreanClient'
import KotoClient from './kotoClient'

export default class Resources {
  public clientAuthToken: string
  public deloreanClient: DeloreanClient
  public kotoClient: KotoClient
  public vbase: VBase

  constructor(ctx: ColossusContext) {
    const cookies = ctx.request.header.cookie ? ctx.request.header.cookie : ''
    const parsedCookies = parseCookie(cookies)
    const startsWithVtexId = (_, key) => key.startsWith('VtexIdclientAutCookie')
    const token = head(values(pickBy(startsWithVtexId, parsedCookies)))
    if (!token) {
      throw new Error()
    }

    this.vbase = new VBase(ctx.vtex)
    this.deloreanClient = new DeloreanClient(ctx.vtex)
    this.kotoClient = new KotoClient(ctx.vtex, this.vbase, token)
  }
}