import { ApolloServer, gql } from "apollo-server-lambda"
import { albums, search } from "./request"
import { typeTranslations } from "./melon-resolvers"

const typeDefs = gql`
  type Artist {
    actType: String
    id: String!
    name: String!
    image: String
    melonUrl: String!
    nationality: String
    sex: String!
  }
  type Song {
    name: String!
    id: Int!
    albumName: String!
    albumId: Int!
    albumImage: String
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
    songs: [Song!]
    releaseDate: String!
    thumbnail: String
    type: AlbumTypes!
  }
  type Group {
    id: Int!
    albums: [Album!]!
  }
  type SearchResult {
    artists: [Artist!]!
    songs: [Song!]!
  }
  type Query {
    search(keyword: String!): SearchResult!
    group(id: Int!): Group
  }
`

interface IdLookupRequest {
  id: number
}

const resolvers = {
  Query: {
    async search(_: any, { keyword }: { keyword: string }) {
      return search(keyword)
    },
    async group(_: any, { id }: IdLookupRequest) {
      return {
        id,
        albums: albums(id),
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
