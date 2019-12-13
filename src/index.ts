import { ApolloServer, gql, UserInputError } from "apollo-server-lambda"
import { albums, search, getGroup } from "./request"
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
  type Group @cacheControl(maxAge: 240) {
    id: Int!
    albums: [Album!]!
  }
  type SearchResult {
    artists: [Artist!]!
    songs: [Song!]!
  }
  type Query {
    search(keyword: String!): SearchResult!
    group(id: Int, name: String): Group
  }
`

interface LookupRequest {
  id?: number
  name?: string
}

const resolvers = {
  Query: {
    // group(_: any, { keyword }: { keyword: string }) {
    //   return
    // }
    async search(_: any, { keyword }: { keyword: string }) {
      return search(keyword)
    },
    async group(_: any, { id, name }: LookupRequest) {
      if (id) {
        return getGroup(id)
      } else if (name) {
        const [first] = await search(name).then(res => res.artists)
        return getGroup(first.id)
      }
      throw new UserInputError("Missing either id or name parameter")
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
