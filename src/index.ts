import { GraphQLServer } from "graphql-yoga"
import { albums } from "./request"

const typeDefs = `
  enum AlbumTypes {
    Single,
    EP,
    Album,
    OST
  }
  type Album {
    id: String!
    name: String!
    koreanName: String!
    melonUrl: String!
    songCount: Int!
    releaseDate: String!
    thumbnail: String
    type: AlbumTypes!
  }
  type Query {
    group(id: String!): [Album]!
  }
`

interface GroupQueryArgs {
  id: string
}

const resolvers = {
  Query: {
    async group(_: any, { id }: GroupQueryArgs) {
      const e = await albums(id)
      return e.slice(0, 10)
    },
  },
}

// const mamamoo = "750053"
// ;(async () => {
//   const album = await albums(mamamoo)
//   return 0
// })()

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log("Server is running on localhost:4000"))
