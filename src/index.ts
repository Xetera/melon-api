import { GraphQLServer } from "graphql-yoga"
import { albums } from "./request"

const typeDefs = `
  type Song {
    name: String!
    id: String!
    albumName: String!
    albumId: String!
    isTitleTrack: Boolean!
    title: String!
  }
  enum AlbumTypes {
    Single,
    EP,
    Album,
    OST,
    Omniverse
  }
  type Album {
    id: String!
    name: String!
    koreanName: String!
    melonUrl: String!
    songCount: Int!
    songs: [Song!]!
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
      return albums(id)
    },
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log("Server is running on localhost:4000"))
