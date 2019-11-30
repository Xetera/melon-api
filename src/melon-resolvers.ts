import { makeParams, findMap } from "./utils"
export enum AlbumTypes {
  ALL = 0,
  FULL = 1,
  SINGLES = 2,
  OTHER = 3,
  // There's a 4th one but I don't think it matters
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

export const melonAlbumsUrl = (artistId: number) => {
  const pageSize = 1000
  const startIndex = 1
  const queries = makeParams({
    startIndex,
    pageSize,
    orderBy: "ISSUE_DATE",
    artistId,
  })
  return `artist/albumPaging.htm?${queries}`
}

export const melonSongsUrl = (artistId: number) => {
  const pageSize = 1000
  const startIndex = 1
  const queries = makeParams({
    pageSize,
    startIndex,
    orderBy: "ISSUE_DATE",
    artistId,
  })
  return `/artist/songPaging.htm?${queries}`
}

export const melonSongLinkUrl = (id: number) =>
  `https://www.melon.com/song/detail.htm?songId=${id}`

export const melonAlbumLinkUrl = (id: number) =>
  `https://www.melon.com/album/detail.htm?albumId=${id}`

export const typeTranslations: Record<string, string> = {
  정규: "Album",
  싱글: "Single",
  EP: "EP",
  OST: "OST",
  // no clue what the hell this is
  옴니버스: "Omniverse",
  리믹스: "Remix",
  디지털: "Digital",
}

export const extractSongs = (album: Document) => {
  // fragile
  const rowSelector = "tbody tr"
  const rows = Array.from(album.querySelectorAll(rowSelector))
  return rows.map(row => {
    const $ = row.querySelector.bind(row)
    const $$ = row.querySelectorAll.bind(row)
    const title = $("td + td.no + td.t_left a.btn")?.textContent
    const albumName = $("td + td.no + td.t_left + td + td a")?.textContent
    const isTitleTrack = Boolean($("span.title"))
    // the links are laid out in a very weird way here so
    // we specifically look for a single link in a list of potential links
    // instead of matching it with a query selector directly
    const allLinks = Array.from($$("td.t_left div div a")).map(extractHrefLink)
    const albumId = findMap(allLinks, matchAlbumId)
    const id = Number(findMap(allLinks, matchSongId)!)
    const melonUrl = id && melonSongLinkUrl(id)

    return { title, albumName, isTitleTrack, albumId, id, melonUrl }
  })
}

export const resolveType = (str: string) => {
  const typeK = str.match(/\[(.*)\]/)?.[1]
  if (!typeK) {
    return "__unknown__"
  }
  return typeTranslations[typeK] ?? typeK
}

const extractHrefLink = (elem: Element) => {
  const attr = "href"
  const jsLink = elem.getAttribute(attr)
  if (!jsLink) {
    throw Error(`
      Element that was expected to have an href js link
      did not have an href attribute`)
  }
  return jsLink
}

const createIdMatcher = (resource: string) => (
  doc: string
): number | undefined => {
  const matcher = new RegExp(`go${resource}Detail\\((.*)\\)`, "i")
  const quotedText = doc.match(matcher)?.[1]
  return Number(quotedText?.slice(1, -1))
}

export const matchAlbumId = createIdMatcher("Album")
export const matchSongId = createIdMatcher("Song")
export const matchArtistId = createIdMatcher("Artist")

const extractAlbum = (album: Element) => {
  const $ = album.querySelector.bind(album)
  const type = resolveType($(".vdo_name")?.textContent ?? "")
  const releaseDate = $(".cnt_view")?.textContent
  const thumbnail = $(".thumb img")?.getAttribute("src")
  // [atist] typo intentional
  const id = Number(matchAlbumId($(".atist_info dt a")!.getAttribute("href")!)!)
  const melonUrl = id && melonAlbumLinkUrl(id)
  const name = $(".vdo_name + * + a")?.textContent
  return { type, releaseDate, thumbnail, melonUrl, name, id }
}

export const extractAlbums = (document: Document) => {
  const albums = Array.from(
    document.querySelectorAll(".d_album_list > ul > li")
  )
  return albums.map(extractAlbum)
}
