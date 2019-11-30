import { ApolloServer, gql } from "apollo-server-lambda"
import { albums } from "./request"
import { typeTranslations } from "./melon-resolvers"

const typeDefs = gql`
  type Song {
    name: String!
    id: Int!
    albumName: String!
    albumId: Int!
    isTitleTrack: Boolean!
    title: String!
    melonUrl: String!
  }
  enum AlbumTypes {
    ${Object.values(typeTranslations).join(",\n")}
  }
  type Album {
    id: Int!
    name: String!
    koreanName: String!
    melonUrl: String!
    songs: [Song!]!
    releaseDate: String!
    thumbnail: String
    type: AlbumTypes!
  }
  type Group {
    id: Int!
    albums: [Album!]!
  }
  type Query {
    group(id: Int!): Group
  }
`

interface GroupQueryArgs {
  id: number
}

const resolvers = {
  Query: {
    async group(_: any, { id }: GroupQueryArgs) {
      return {
        id,
        albums: albums(id),
      }
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })
exports.server = server.createHandler()
// server.start(() => console.log("Server is running on localhost:4000"))
