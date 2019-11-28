import { logger } from "./logger"
import { melonAlbumsUrl, AlbumTypes, extractAlbums } from "./melon-resolvers"
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
  const url = melonAlbumsUrl(artistId, {
    size: 100,
    start: 1,
    type: AlbumTypes.SINGLES,
  })
  logger.debug(url)
  const a = await request(url)
  const albums = extractAlbums(a)
  console.log(albums[0])
  return albums
}
