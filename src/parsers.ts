import * as P from "parsimmon"

const trim = (p: P.Parser<string>) => p.map(res => res.trim())
const isnt = (not: string) => (str: string) => str !== not

/**
 * Nevermind this entire parser is useless because
 * melon is _incredibly_ inconsistent with how they name things
 */
export const titleParser = P.createLanguage({
  lb: () => P.string("("),
  rb: () => P.string(")"),
  mainLanguage: () => trim(P.takeWhile(isnt("("))),
  optionalEnglish: r => trim(P.takeWhile(isnt(")")).wrap(r.lb, r.rb)),
  name: r =>
    r.mainLanguage
      .skip(P.optWhitespace)
      .chain(main => {
        return r.optionalEnglish.times(0, 1).map(([alternative]) => {
          if (!alternative) {
            return { english: main }
          }
          return { korean: main, english: alternative }
        })
      })
      // extra prentheses at the end aren't important
      .skip(P.all),
})

// export const interpretTitle = (title: string): SongTitle => {
//   const sectionMatcher = /(.*?) +\((.*?)\)/
//   const match = title.match(sectionMatcher)
//   if (!match) {
//     return {}
//   }
//   const [, main, alternative] = match
//   const hasOnlyEnglishTitle = !alternative
// }
