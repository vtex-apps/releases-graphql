import axios from 'axios'
import * as cookies from 'cookie'

import { AuthenticationError } from '../errors/AuthenticationError'
import { getTokenFromCookies } from '../utils/vtexid'

interface TopbarResponse {
  profile: Profile
}

export default async (_, __, ctx: ColossusContext): Promise<Profile> => {
  const path = (account) => `http://${account}.vtexcommercestable.com.br/api/license-manager/site/pvt/newtopbar`
  const { vtex: { account, authToken }, request: { headers: { cookie = '' } } } = ctx
  const VtexIdclientAutCookie = getTokenFromCookies(cookie)

  if (!VtexIdclientAutCookie) {
    throw new AuthenticationError()
  }

  const { data: { profile } } = await axios.get<TopbarResponse>(path(account), {
    headers: {
      'Proxy-Authorization': authToken,
      VtexIdclientAutCookie,
    },
  })

  return profile
}
