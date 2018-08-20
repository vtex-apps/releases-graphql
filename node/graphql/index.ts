import buildResults from '../resolvers/buildResults'
import buildResultsFromCommit from '../resolvers/buildResultsFromCommit'
import projects from '../resolvers/projects'
import releaseDetails from '../resolvers/releaseDetails'
import releases from '../resolvers/releases'
import releasesNotes from '../resolvers/releasesNotes'
import saveBuildResults from '../resolvers/saveBuildResults'
import statistic from '../resolvers/statistics'

export const resolvers = {
  Mutation: {
    saveBuildResults
  },
  Query: {
    buildResults,
    buildResultsFromCommit,
    projects,
    releaseDetails,
    releases,
    releasesNotes,
    statistic
  }
}