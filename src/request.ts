import * as R from "ramda"
import { logger } from "./logger"
import {
  melonAlbumsUrl,
  extractAlbums,
  extractSongs,
  melonSongsUrl,
} from "./melon-resolvers"
import axios from "axios"
import { JSDOM } from "jsdom"

export const melonBaseUrl = "https://www.melon.com/"

export const melon = axios.create({
  baseURL: melonBaseUrl,
  timeout: 2000,
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
  const songs = extractSongs(songsDoc)
  const organizedSongs = R.groupBy(
    a => (a.albumId ? String(a.albumId) : "__unknown__"),
    songs
  )
  // Sometimes albums reference removed songs that don't show up in
  // the songs list so we have to probably omit those
  return albums.map(album => ({
    ...album,
    songs: album.id ? organizedSongs[album.id] : [],
  }))
}
