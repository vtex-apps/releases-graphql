import { map } from 'ramda'

export default async (_: any, __: any, ctx: Context): Promise<Project[]> => {
  const { clients: { koto } } = ctx
  const projectsFromKoto = await koto.getProjects()
  const projects = map((projectName: string) => {
    return { name: projectName } as Project
  }, projectsFromKoto)

  return projects
}
