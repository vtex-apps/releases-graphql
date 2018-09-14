import { concat, map, sort } from 'ramda'
import { Md5 } from 'ts-md5'

import Resources from '../resources'

interface ReleasesArgs {
  appName: string
  endDate: string
  page: number
}

export default async (_, args: ReleasesArgs, ctx: ColossusContext): Promise<Release[]> => {
  const resources = new Resources(ctx)
  const kotoClient = resources.kotoClient
  const deloreanClient = resources.deloreanClient
  const { appName, page, endDate } = args
  const allApps = ['', 'all'].includes(appName)

  const deployments = allApps
    ? await kotoClient.getDeployments(page)
    : await kotoClient.getDeployments(page, appName)

  const startDate = deployments.length
    ? deployments[deployments.length - 1].CreatedAt
    : '2014-01-01T00:00:00.000Z'

  const publications = allApps
    ? await deloreanClient.getPublications(startDate, endDate)
    : await deloreanClient.getPublications(startDate, endDate, appName)

  const deploymentReleases: Release[] = map((deployment: Deployment) => {
    const authors = map((commiter: Commiter) => {
      return {
        gravatarURL: 'https://www.gravatar.com/avatar/' + Md5.hashStr(commiter.Email) + '?s=40',
        name: commiter.Name,
        username: commiter.Email
      } as Author
    }, deployment.Commiters)
    const deploymentDate = new Date(deployment.CreatedAt)

    return {
      appName: deployment.ProjectName,
      authors,
      cacheId: deployment.Id,
      commitsTotal: deployment.CommitsTotal,
      date: deploymentDate.toISOString(),
      environment: deployment.IsPreRelease ? 'beta' : 'stable',
      type: 'deployment',
      version: deployment.Version
    } as Release
  }, deployments)

  const publicationReleases: Release[] = map((publication: Publication) => {
    const author: Author = {
      gravatarURL: 'https://www.gravatar.com/avatar/' + Md5.hashStr(publication.vtexIdUser) + '?s=40',
      name: publication.vtexIdUser,
      username: publication.vtexIdUser
    }
    const publicationDate = new Date(publication.created_at)

    return {
      appName: publication.app,
      authors: [author],
      cacheId: publication._id,
      date: publicationDate.toISOString(),
      environment: publication.env,
      type: 'publication',
      version: publication.version,
      versionFrom: publication.versionFrom
    } as Release
  }, publications)

  const releases: Release[] = sort((a: Release, b: Release) => {
    return Date.parse(b.date) - Date.parse(a.date)
  }, concat(deploymentReleases, publicationReleases))

  return releases
}
