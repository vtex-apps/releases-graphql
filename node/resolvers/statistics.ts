import Resources from '../resources'

interface StatisticArgs {
  appName: string
  env: string
}

const KOTO_KEYS = {
  'beta': 'PreRelease',
  'stable': 'Stable'
}

export default async (_, args: StatisticArgs, ctx: ColossusContext): Promise<Statistic> => {
  const resources = new Resources(ctx)
  const { appName, env } = args
  const statisticFromDelorean = [ '', 'all' ].includes(appName)
    ? await resources.deloreanClient.getStatistic(env)
    : await resources.deloreanClient.getStatistic(env, appName)
  const statisticFromKoto = ['', 'all'].includes(appName)
    ? await resources.kotoClient.getStatistic()
    : await resources.kotoClient.getStatistic(appName)

    const statistic = Object.keys(statisticFromDelorean).reduce(
    (acc, currKey) => {
      const statKey = currKey.charAt(0).toUpperCase() + currKey.substring(1)
      const kotoValue = [ '', 'all' ].includes(env)
        ? statisticFromKoto[`PreRelease${statKey}`] + statisticFromKoto[`Stable${statKey}`]
        : statisticFromKoto[KOTO_KEYS[env] + statKey]

        return {
        ...acc,
        [currKey]: statisticFromDelorean[currKey] + kotoValue
      }
    }, {} as Statistic)

  return statistic
}
