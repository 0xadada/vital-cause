const test = require("ava");
const { slugify } = require("./utils");

// Slugify tests
test("Slugify remove whitespaces", t => {
  // Remove Symbols
  t.is(
    slugify(" no extra spaces  "),
    "no-extra-spaces"
  )
});

test("Slugify replace spaces with dashes", t => {
  // Replaces Spaces
  t.is(
    slugify("this is a test of creating a slug of a sentence"),
    "this-is-a-test-of-creating-a-slug-of-a-sentence"
  )
});

test("Slugify all lowercase", t => {
  // Remove Symbols
  t.is(
    slugify("ALL LOWERCASE"),
    "all-lowercase"
  )
});

test("Slugify remove symbols (except dash)", t => {
  // Remove Symbols
  t.is(
    slugify("no $ymbols allowed!@#$%^&*()=-"),
    "no-ymbols-allowed-"
  )
});

test("Slugify replace slashes", t => {
  // Remove Symbols
  t.is(
    slugify("slashes are replaced 2019/10/02"),
    "slashes-are-replaced-20191002"
  )
});

// Allowed string values
test("Slugify alphabet allowed", t => {
  // Remove Numbers
  t.is(
    slugify("abcdefghijklmnopqrstuvwxyz"),
    "abcdefghijklmnopqrstuvwxyz"
  )
});

test("Slugify numbers allowed", t => {
  // Remove Numbers
  t.is(
    slugify("0123456789"),
    "0123456789"
  )
});

test.todo('Add tests for formatDate');
test.todo('Add test for formatTime')
