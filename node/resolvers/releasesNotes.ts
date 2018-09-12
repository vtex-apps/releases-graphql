import axios from 'axios'
import { map } from 'ramda'

interface ReleasesNotesArgs {
  page: number
}

export default async (_, args: ReleasesNotesArgs, ctx: ColossusContext): Promise<ReleaseNote[]> => {
  const releaseNotesURL = 'http://rlsnts-env-stable.us-east-1.elasticbeanstalk.com/releases'
  const http = axios.create({ headers: { 'Proxy-Authorization': ctx.vtex.authToken } })
  const { page } = args
  const elements = await http.get(releaseNotesURL, {
    params: {
      page: page ? page : 1,
      perPage: 10
    }
  })

  const { data: { items } } = elements
  const notes = map((item: any) => {
    const author = {
      gravatarURL: item.author.avatar_url,
      username: item.author.login
    } as Author

    return {
      appName: item.repo_name,
      author,
      cacheId: 'ReleaseNotes-' + item.id,
      date: item.published_at,
      description: item.body,
      title: item.name,
      url: item.html_url,
      version: item.tag_name
    } as ReleaseNote
  }, items) as ReleaseNote[]

  return notes
}
