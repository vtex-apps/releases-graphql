import Resources from '../resources'

interface BuildInput {
  appId: string,
  build: string,
  buildId: string,
  commitId: string,
  log: string,
  status: string
}

export default async (_, args: BuildInput, ctx: ColossusContext): Promise<string> => {
  try {
    const { builds } = new Resources(ctx)
    const { appId, buildId, commitId, log, status } = args

    return builds.saveBuild(appId, commitId, buildId, { buildLog: log, buildId, status })
  } catch (error) {
    console.error(error)
    throw error
  }
}