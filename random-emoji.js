const EMOJI = {
  /* 'emoticons' 1F600-1F64F https://apps.timwhitlock.info/unicode/inspect/hex/1F600-1F64F
   * 'food' 1F32D-1F37F  https://apps.timwhitlock.info/unicode/inspect/hex/1F32D-1F37F
   * 'animals' 1F400-1F4D3 https://apps.timwhitlock.info/unicode/inspect/hex/1F400-1F4D3
   * 'expressions' 1F910-1F92F https://apps.timwhitlock.info/unicode/inspect/hex/1F910-1F92F
   */
  emoticons: [0x1f600, 0x1f64f],
  food: [0x1f32d, 0x1f37f],
  animals: [0x1f400, 0x1f4d3],
  expression: [0x1f910, 0x1f92f]
};

module.exports = function randomEmoji(type = "emoticons") {
  let [max, min] = EMOJI[type];
  let codePoint = Math.floor(Math.random() * (max - min) + min);
  return String.fromCodePoint(codePoint);
};
