import axios from 'axios'
import * as cookies from 'cookie'

interface TopbarResponse {
  profile: Profile
}

export default async (_, __, ctx: ColossusContext): Promise<Profile> => {
  const path = (account) => `http://${account}.vtexcommercestable.com.br/api/license-manager/site/pvt/newtopbar`
  
  try {
    const { vtex: { account, authToken }, request: { headers: { cookie = '' } } } = ctx
    const { VtexIdclientAutCookie } = cookies.parse(cookie)
    if (!VtexIdclientAutCookie) {
      throw new Error('User is not authenticate!')
    }
    const { data: { profile } } = await axios.get<TopbarResponse>(path(account), {
      headers: {
        'Proxy-Authorization': authToken,
        VtexIdclientAutCookie,
      },
    })
    
    return profile
  } catch (e) {
    console.error(e)
    throw e
  }
}