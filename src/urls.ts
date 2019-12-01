import { makeParams } from "./utils"

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

export const melonArtistLinkUrl = (id: number) =>
  `https://www.melon.com/artist/timeline.htm?artistId=${id}`

export const melonSongLinkUrl = (id: number) =>
  `https://www.melon.com/song/detail.htm?songId=${id}`

export const melonAlbumLinkUrl = (id: number) =>
  `https://www.melon.com/album/detail.htm?albumId=${id}`
