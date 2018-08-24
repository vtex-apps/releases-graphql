import { map } from 'ramda'
import Resources from '../resources'

export default async (_, __, ctx: ColossusContext): Promise<Project[]> => {
  try {
    const resources = new Resources(ctx)
    const projectsFromKoto = await resources.kotoClient.getProjects()

    const projects = map((projectName: string) => {
      return { name: projectName } as Project
    }, projectsFromKoto)

    return projects
  } catch (e) {
    console.error(e)
    throw e
  }
}