interface StatisticArgs {
  appName: string
  env: 'stable' | 'beta'
}

const KOTO_KEYS = {
  'beta': 'PreRelease',
  'stable': 'Stable',
}

export default async (_: any, args: StatisticArgs, ctx: Context): Promise<Statistic> => {
  const { clients: { koto, delorean } } = ctx
  const { appName, env } = args

  const statisticFromDelorean = [ '', 'all' ].includes(appName)
    ? await delorean.getStatistic(env)
    : await delorean.getStatistic(env, appName)

  const statisticFromKoto = ['', 'all'].includes(appName)
    ? await koto.getStatistic()
    : await koto.getStatistic(appName)

    const statistic = Object.keys(statisticFromDelorean).reduce((acc, currKey) => {
      const statKey = currKey.charAt(0).toUpperCase() + currKey.substring(1)
      const pre = `PreRelease${statKey}` as keyof StatisticFromKoto
      const stable = `Stable${statKey}` as keyof StatisticFromKoto
      const byEnv = KOTO_KEYS[env] + statKey as keyof StatisticFromKoto
      const kotoValue = [ '', 'all' ].includes(env)
        ? statisticFromKoto[pre] + statisticFromKoto[stable]
        : statisticFromKoto[byEnv]

        return {
        ...acc,
        [currKey]: statisticFromDelorean[(currKey as keyof Statistic)] + kotoValue,
      }
    }, {} as Statistic)

  return statistic
}
