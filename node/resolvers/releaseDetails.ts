import { map } from 'ramda'

interface ReleaseDetailArgs {
  appName: string
  cacheId: string
}

export default async (_: any, args: ReleaseDetailArgs, ctx: Context): Promise<Release> => {
  const { clients: { koto } } = ctx

  const { appName, cacheId } = args
  const [, id] = cacheId.split('-')
  const deployment = await koto.getDeployment(appName, id)

  const commits: Commit[] = map((commitFromKoto: CommitFromKoto) => {
    return { title: commitFromKoto.Title } as Commit
  }, deployment.Commits || [])

  const dependencies: Dependency[] = map((dependencyFromKoto: DependencyFromKoto) => {
    return { name: dependencyFromKoto.Name, version: dependencyFromKoto.Version }
  }, deployment.Dependencies)

  const release: Release = {
    appName: deployment.ProjectName,
    authors: [{ gravatarURL: '' } as Author],
    cacheId: deployment.Id,
    commits,
    commitsTotal: commits.length,
    date: deployment.CreatedAt,
    dependencies,
    environment: deployment.IsPreRelease ? 'beta' : 'stable',
    type: 'deployment',
    version: deployment.Version,
  }

  return release
}
