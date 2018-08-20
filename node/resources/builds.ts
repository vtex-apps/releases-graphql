import { FileListItem, VBase } from '@vtex/api'
import { map } from 'ramda'

import { buildsBucket } from '../utils/conf'

export default class Builds {
  private vbase: VBase

  constructor(vbase: VBase) {
    this.vbase = vbase
  }

  public saveBuild = async (appId: string, commitId: string, buildId: string, build: Build): Promise<string> => {
    const vbasePath = this.join([appId, commitId, buildId])
    const buildWithId = { ...build, cacheId: vbasePath }
    try {
      await this.vbase.saveJSON<Build>(buildsBucket, vbasePath, buildWithId)
      return buildId
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  public getBuild = async (appId: string, commitId: string, buildId: string): Promise<Build> => {
    const vbasePath = this.join([appId, commitId, buildId])
    try {
      const build = await this.vbase.getJSON<Build>(buildsBucket, vbasePath, true)
      return build
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  public getBuildsFromCommit = async (appId: string, commitId: string): Promise<Build[]> => {
    const vbasePrefix = this.join([appId, commitId])
    try {
      const buildFiles = await this.vbase.listFiles(buildsBucket, { prefix: vbasePrefix })
      const buildList = map(async (file: FileListItem) => {
        const buildId = this.getBuildNameFromPath(file.path)
        const vbasePath = this.join([vbasePrefix, buildId])

        return await this.vbase.getJSON<Build>(buildsBucket, vbasePath, true)
      }, buildFiles.data)

      return await Promise.all(buildList)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  private getBuildNameFromPath = (pathName: string) => {
    return pathName.match(/([^\/]*)\/*$/)[1]
  }

  private join = (dirs: string[]): string => {
    return dirs.filter(id => !!id).join('/')
  }
}