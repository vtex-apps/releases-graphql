import Resources from '../resources'

interface BuildResultsArgs {
  appId: string
  commitId: string
  buildId: string
}

export default async (_, args: BuildResultsArgs, ctx: ColossusContext): Promise<Build> => {
  try {
    const { builds } = new Resources(ctx)
    const { appId, commitId, buildId } = args
    const build = await builds.getBuild(appId, commitId, buildId)

    return build
  } catch (e) {
    console.error(e)
    throw e
  }
}