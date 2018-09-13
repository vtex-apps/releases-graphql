import { parse } from 'cookie'
import { head, pickBy, values} from 'ramda'

const startsWithVtexId = (_, key) => key.startsWith('VtexIdclientAutCookie')

export const getTokenFromCookies = (cookieHeader: string): string => {
  const cookies = parse(cookieHeader)
  return head(values(pickBy(startsWithVtexId, cookies)))
}
