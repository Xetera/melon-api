import * as R from "ramda"
import { logger } from "./logger"
import { extractAlbums, extractSongs } from "./melon-resolvers"
import axios from "axios"
import { JSDOM } from "jsdom"
import {
  melonAlbumsUrl,
  melonSongsUrl,
  melonSongLinkUrl,
  melonArtistLinkUrl,
} from "./urls"

export interface ArtistResult {
  ARTISTID: string
  ARTISTNAME: string
  ARTISTNAMEDP: string
  // typo intentional. Good job melon
  ARITSTIMG: string
  NATIONALITYNAME?: string
  SEX: string
  ACTTYPENAMES: string
}

export interface SongResults {
  SONGID: string
  SONGNAME: string
  SONGNAMEDP: string
  ALBUMIMG: string
  ALBUMID: string
  ALBUMNAME: string
  ARTISTID: string
  ARTISTNAME: string
}

export interface SearchResult {
  ARTISTCONTENTS: ArtistResult[]
  SONGCONTENTS: SongResults[]
}

export const melonBaseUrl = "https://www.melon.com/"

export const melon = axios.create({
  baseURL: melonBaseUrl,
  timeout: 3000,
  headers: {
    "User-Agent": "GraphQL Melon API (in dev)",
  },
})

export const request = async (url: string) => {
  const res = await melon.get(url)
  const dom = new JSDOM(res.data, {
    referrer: melonBaseUrl,
  })
  return dom.window.document
}

export const albums = async (artistId: number) => {
  logger.debug(`Received request to crawl for artist: ${artistId}`)
  const albumsUrl = melonAlbumsUrl(artistId)
  const songsUrl = melonSongsUrl(artistId)
  const [albumsDoc, songsDoc] = await Promise.all([
    request(albumsUrl),
    request(songsUrl),
  ])
  const albums = extractAlbums(albumsDoc)
  const songs = extractSongs(songsDoc).filter(song => song.albumId)
  const organizedSongs = R.groupBy(song => String(song.albumId), songs)
  // Sometimes albums reference removed songs that don't show up in
  // the songs list so we have to probably omit those
  return albums.map(album => ({
    ...album,
    songs: album.id ? organizedSongs[album.id] : [],
  }))
}

export const getGroup = (id: number) =>
  albums(id).then(albums => ({
    id,
    albums,
  }))

export const search = async (keyword: string) => {
  const { data } = await melon.get<SearchResult>(
    `/search/keyword/index.json?query=${encodeURIComponent(keyword)}`
  )
  const artists = data.ARTISTCONTENTS.map(artist => {
    return {
      actTypeNames: artist.ACTTYPENAMES,
      id: artist.ARTISTID,
      name: artist.ARTISTNAME,
      image: artist.ARITSTIMG,
      nationality: artist.NATIONALITYNAME,
      melonUrl: melonArtistLinkUrl(Number(artist.ARTISTID)),
      sex: artist.SEX,
    }
  })
  const songs = data.SONGCONTENTS.map(song => {
    return {
      id: song.SONGID,
      albumId: song.ALBUMID,
      name: song.SONGNAME,
      albumImage: song.ALBUMIMG,
      albumName: song.ALBUMNAME,
      artistId: song.ARTISTID,
      artistName: song.ARTISTNAME,
      melonUrl: melonSongLinkUrl(Number(song.SONGID)),
    }
  })
  return {
    artists,
    songs,
  }
}
