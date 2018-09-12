import { parse } from 'cookie'
import { head, pickBy, values} from 'ramda'

export const getTokenFromCookies = (cookieHeader: string): string => {
  const cookies = parse(cookieHeader)
  const startsWithVtexId = (_, key) => key.startsWith('VtexIdclientAutCookie')
  return head(values(pickBy(startsWithVtexId, cookies)))
}
