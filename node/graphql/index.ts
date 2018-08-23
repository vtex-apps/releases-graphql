import profile from '../resolvers/profile'
import projects from '../resolvers/projects'
import releaseDetails from '../resolvers/releaseDetails'
import releases from '../resolvers/releases'
import releasesNotes from '../resolvers/releasesNotes'
import statistic from '../resolvers/statistics'

export const resolvers = {
  Query: {
    profile,
    projects,
    releaseDetails,
    releases,
    releasesNotes,
    statistic
  }
}