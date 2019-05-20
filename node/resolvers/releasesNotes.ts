import { map } from 'ramda'

interface ReleasesNotesArgs {
  page: number
}

export default async (_: any, args: ReleasesNotesArgs, ctx: Context): Promise<ReleaseNote[]> => {
  const { clients: { releaseNotes } } = ctx
  const { page } = args
  const data = await releaseNotes.getReleaseNotes(page)

  if (data.status === 'Fetch in progress') {
    return []
  }

  const notes = map((item: any) => {
    const author = {
      gravatarURL: item.author.avatar_url,
      username: item.author.login,
    } as Author

    return {
      appName: item.repo_name,
      author,
      cacheId: 'ReleaseNotes-' + item.id,
      date: item.published_at,
      description: item.body,
      title: item.name,
      url: item.html_url,
      version: item.tag_name,
    } as ReleaseNote
  }, data.items || []) as ReleaseNote[]

  return notes
}
