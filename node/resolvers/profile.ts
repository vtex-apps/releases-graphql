export default async (_: any, __: any, ctx: Context): Promise<Profile> => {
  const { clients: { licenseManager }, vtex: { adminUserAuthToken }} = ctx
  const {profile} = await licenseManager.getTopbarData(adminUserAuthToken!)
  return profile
}
