export default async (_: any, __: any, ctx: Context): Promise<Profile> => {
  const { clients: { licenseManager }, vtex: { adminUserAuthToken }} = ctx
  return licenseManager.getTopbarData(adminUserAuthToken!)
}
