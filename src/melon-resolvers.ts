import { makeParams } from "./utils"
export enum AlbumTypes {
  ALL = 0,
  FULL = 1,
  SINGLES = 2,
  OTHER = 3,
  // There's a 4th one but I don't think it matters
}

export interface AlbumOptions {
  start: number
  size: number
  type: AlbumTypes
}

export interface Album {
  id: string
  englishName: string
  koreanName: string
  melonUrl: string
  songCount: number
  releaseDate: string
  thumbnail: string
  type: "Single" | "EP"
}

const defaultAlbumOptions: AlbumOptions = {
  start: 1,
  size: 100,
  type: AlbumTypes.ALL,
}

export const melonAlbumsUrl = (
  artistId: string,
  { size, start, type }: AlbumOptions = defaultAlbumOptions
) => {
  const queries = makeParams({
    startIndex: start,
    pageSize: size,
    listType: type,
    orderBy: "ISSUE_DATE",
    artistId,
  })
  return `artist/albumPaging.htm?${queries}`
}

export const melonAlbumLinkUrl = (id: string) =>
  `https://www.melon.com/album/detail.htm?albumId=${id}`

export const typeTranslations: Record<string, string> = {
  정규: "Album",
  싱글: "Single",
}

export const resolveType = (str: string) => {
  const typeK = str.match(/\[(.*)\]/)?.[1]
  if (!typeK) {
    return "__unknown__"
  }
  return typeTranslations[typeK] ?? typeK
}

const albumId = (album: Element) => {
  // rough regex
  const MATCHER = /goAlbumDetail\(['"](.*)['"]\)/
  const jsLink = album
    .querySelector(".vdo_name + * + a")
    ?.attributes.getNamedItem("href")
  return jsLink?.textContent?.match(MATCHER)?.[1]
}

const extractAlbum = (album: Element) => {
  const $ = album.querySelector.bind(album)
  const type = resolveType($(".vdo_name")?.textContent ?? "")
  const releaseDate = $(".cnt_view")?.textContent
  const thumbnail = $(".thumb img")?.attributes.getNamedItem("src")?.textContent
  const songCountStr = $(".tot_song")?.textContent ?? ""
  const songCount = Number(songCountStr.split("곡").shift())
  const id = albumId(album)
  const melonUrl = id && melonAlbumLinkUrl(id)
  const name = $(".vdo_name + * + a")?.textContent!
  return { type, releaseDate, thumbnail, songCount, melonUrl, name, id }
}

export const extractAlbums = (document: Document) => {
  const albums = Array.from(document.querySelectorAll(".d_album_list ul li"))
  return albums.map(extractAlbum)
}
