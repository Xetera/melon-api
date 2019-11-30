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

interface IdLookupRequest {
  id: number
}

const resolvers = {
  Query: {
    // async album(_: any, { id }: IdLookupRequest) {
    //   return
    // },
    async group(_: any, { id }: IdLookupRequest) {
      return {
        id,
        albums: await albums(id),
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  tracing: process.env.NODE_ENV === "development",
})

exports.server = server.createHandler()
