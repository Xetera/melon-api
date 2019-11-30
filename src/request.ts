import * as R from "ramda"
import { logger } from "./logger"
import {
  melonAlbumsUrl,
  AlbumTypes,
  extractAlbums,
  extractSongs,
  melonSongsUrl,
  matchArtistId,
} from "./melon-resolvers"
import axios from "axios"
import { JSDOM } from "jsdom"
import { URL } from "url"

export const melonBaseUrl = "https://www.melon.com/"

export const melon = axios.create({
  baseURL: melonBaseUrl,
  timeout: 2000,
  // headers: {
  //   "User-Agent": "Graphql Melon API (in dev)",
  // },
})

export const request = async (url: string) => {
  const res = await melon.get(url)
  const dom = new JSDOM(res.data, {
    referrer: melonBaseUrl,
  })
  return dom.window.document
}

export const albums = async (artistId: string) => {
  const albumsUrl = melonAlbumsUrl(artistId, AlbumTypes.SINGLES)
  const songsUrl = melonSongsUrl(artistId)
  logger.debug(albumsUrl)
  const [albumsDoc, songsDoc] = await Promise.all([
    request(albumsUrl),
    request(songsUrl),
  ])
  // const songsDoc = await request(songsUrl)
  // const possibleArtistLinks = Array.from(
  //   albumsDoc.querySelectorAll("a[href^='javascript']")
  // ).map(e => e.getAttribute("href") ?? "")

  // const  = findMap(possibleArtistLinks, matchArtistId)
  const albums = extractAlbums(albumsDoc)
  const songs = extractSongs(songsDoc)
  const organizedSongs = R.groupBy(a => a.albumId ?? "__unknown__", songs)
  const newAlbum = albums.map(album => {
    return {
      ...album,
      songs: organizedSongs[album.id ?? ""] ?? [],
    }
  })
  // console.log(albums[0])
  return newAlbum
}
