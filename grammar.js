module.exports = grammar({
  name: 'test',

  word: $ => $.identifier,

  extras: $ => [/[\s\p{Zs}\uFEFF\u2060\u200B]/],

  rules: {
    source_file: $ => repeat($._item),

    _item: $ => choice(
      $.module,
      ';'
    ),

    module: $ => seq(
      'module',
      field('path', $.path),
    ),

    path: $ => seq(
      $.identifier,
      repeat(seq('::', $.identifier))
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
  }
})