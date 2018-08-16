import Resources from '../resources'

interface StatisticArgs {
  appName: string
}

export default async (_, args: StatisticArgs, ctx: ColossusContext): Promise<Statistic> => {
  try {
    const resources = new Resources(ctx)
    const { appName } = args
    const statisticFromKoto = ['', 'all'].includes(appName)
      ? await resources.kotoClient.getStatistic()
      : await resources.kotoClient.getStatistic(appName)

    const statistic = Object.keys(statisticFromKoto).reduce(
      (acc, currKey) => ({
        ...acc,
        [currKey.charAt(0).toLowerCase() + currKey.slice(1)]: statisticFromKoto[currKey],
      }),
      {},
    ) as Statistic

    return statistic
  } catch (e) {
    console.error(e)
    throw e
  }
}