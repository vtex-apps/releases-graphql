import { AppsSettings } from '@vtex/api'
import { Context } from 'koa'

declare global {

  interface ColossusContext extends Context {
    vtex: IOContext
  }

  interface IOContext {
    account: string
    workspace: string
    production: boolean
    authToken: string
    userAgent: string
    recorder?: any
    region: string
    route: string
  }

  type ReleaseType = 'publication' | 'deployment'

  interface Commiter {
    Name: string
    Email: string
  }

  interface Author {
    gravatarURL: string
    name: string
    username: string
  }

  interface Commit {
    title: string
  }

  interface CommitFromKoto {
    Title: string
  }

  interface Deployment {
    Id: string
    Version: string
    ProjectName: string
    ApplicationName: string
    Commits?: CommitFromKoto[]
    CreatedAt: string
    Dependencies: DependencyFromKoto[]
    IsPreRelease: boolean
    RepositoryName: string
    Commiters: Commiter[]
    CommitsTotal: number
  }

  interface Dependency {
    name: string
    version: string
  }

  interface DependencyFromKoto {
    Name: string
    Version: string
  }

  interface Profile {
    id: string
    name: string
    email: string
  }

  interface Publication {
    _id: string,
    app: string,
    version: string,
    versionFrom: string,
    env: string,
    vtexIdUser: string,
    created_at: string
  }

  interface Release {
    authors: Author[],
    appName: string,
    commits?: Commit[]
    commitsTotal?: number,
    cacheId: string,
    date: string,
    dependencies?: Dependency[]
    environment: string,
    type: ReleaseType,
    version: string,
    versionFrom?: string
  }

  interface ReleaseNote {
    appName: string
    author: Author
    description: string
    cacheId: string
    title: string
    url: string
    version: string
  }

  interface StatisticFromKoto {
    StableLastHour: number,
    StableLast3Hours: number,
    StableLast7Days: number,
    StableLast30Days: number,
    PreReleaseLastHour: number,
    PreReleaseLast3Hours: number,
    PreReleaseLast7Days: number,
    PreReleaseLast30Days: number
  }


  interface Statistic {
    lastHour: number,
    last3Hour: number,
    last7Days: number,
    last30Days: number
  }

  interface Project {
    name: string
  }
}