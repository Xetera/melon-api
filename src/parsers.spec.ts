import { titleParser } from "./parsers"
describe("Title parser", () => {
  it("Should be parsing titles with no hangul", () => {
    const english = "Bad bye"
    const a = titleParser.name.tryParse(english)
    expect(a).toStrictEqual({ english })
  })
  it("Should parse korean + english titles", () => {
    const title = "우린 결국 다시 만날 운명이었지 (Destiny)"
    const a = titleParser.name.tryParse(title)
    expect(a).toStrictEqual({
      korean: "우린 결국 다시 만날 운명이었지",
      english: "Destiny",
    })
  })
  it("Should trim extra whitespace around hangul titles", () => {
    const title = "   고고베베    (gogobebe)"
    const a = titleParser.name.tryParse(title)
    expect(a).toStrictEqual({
      english: "gogobebe",
      korean: "고고베베",
    })
  })
  it("Should ignore extra parentheses at the end", () => {
    const title = "다 빛이나 (Gleam) (Inst.)"
    const a = titleParser.name.tryParse(title)
    expect(a).toStrictEqual({ korean: "다 빛이나", english: "Gleam" })
  })
})
