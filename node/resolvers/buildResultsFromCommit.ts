import Resources from '../resources'

interface BuildResultsFromCommitsArgs {
  appId: string
  commitId: string
}

export default async (_, args: BuildResultsFromCommitsArgs, ctx: ColossusContext): Promise<Build[]> => {
  try {
    const { appId, commitId } = args
    const { builds } = new Resources(ctx)
    const buildsList = await builds.getBuildsFromCommit(appId, commitId)

    return buildsList
  } catch (e) {
    console.error(e)
    throw e
  }
}