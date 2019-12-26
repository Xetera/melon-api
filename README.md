# Melon API

An unofficial graphql api that lets you query data from https://melon.com

## API Endpoint

https://melon.mykpoplist.com/graphql

## Example query

```graphql
 query Group($name: String!) {
  melon_group(name: $name) {
    genre
    name
    gender
    type thumbnail
    activity
    debut
    melon_id
    melon_url
    artists {
      thumbnail
      name
      details
      melon_id
      role
      melon_url
    }
    albums {
      release_date
      melon_id
      name
      thumbnail
      melon_url
      type
      songs {
        is_title_track
        melon_url
        album_id
        name
        melon_id
      }
    }
  }
}
```

## Features

- [x] Querying artists by id
- [ ] Querying songs by id
- [ ] Querying albums by id
- [x] Searching by keyword
- [ ] Chart data (low priority)
- [ ] Subscriptions (low priority)

> API developed for [mykpoplist](https://github.com/xetera/mykpoplist)
