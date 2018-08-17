import { VBase } from '@vtex/api'
import { buildsBucket } from '../utils/conf'

export default class Builds {
  private vbase: VBase

  constructor(vbase: VBase) {
    this.vbase = vbase
  }

  public saveBuild = async (appId: string, commitId: string, buildId: string, build: Build): Promise<string> => {
    const vbasePath = [appId, commitId, buildId].filter(id => !!id).join('/')
    try {
      console.log(vbasePath)
      await this.vbase.saveJSON<Build>(buildsBucket, vbasePath, build)
      return buildId
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}