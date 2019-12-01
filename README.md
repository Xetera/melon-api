# Melon API

An unofficial graphql api that lets you query data from https://melon.com

## API Endpoint

https://melon.mykpoplist.com/graphql

```graphql
query TwiceSongs {
  group(id: 905701) {
    albums {
      id
      name
      melonUrl
      releaseDate
      thumbnail
      type
      songs {
        melonUrl
        isTitleTrack
        albumId
        name
        id
      }
    }
  }
}
```

## Features

- [x] Querying artists by id
- [ ] Querying songs by id
- [ ] Querying albums by id
- [ ] Searching by keyword
- [ ] Chart data (low priority)
- [ ] Subscriptions (low priority)

> API developed for [mykpoplist](https://github.com/xetera/mykpoplist)
