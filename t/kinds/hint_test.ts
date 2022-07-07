import { _hintIntoHPair } from "kind/hint/hint.ts";
import { assertEquals, describe, it } from "t/deps.ts";

describe("kinds/hint", () => {
  describe("_hintIntoHPair()", () => {
    it("skip empty string", () => {
      assertEquals(_hintIntoHPair(""), null);
      assertEquals(_hintIntoHPair(" "), null);
      assertEquals(_hintIntoHPair("  "), null);
    });
    it("beging `#`, regard it as comment", () => {
      assertEquals(_hintIntoHPair("# foo bar  baz"), ["", "#  foo bar  baz"]);
      assertEquals(_hintIntoHPair("# foo bar ::  baz"), [
        "",
        "#  foo bar ::  baz",
      ]);
    });
    it("beging `##`, regard it as comment", () => {
      assertEquals(_hintIntoHPair("## foo bar  baz"), [
        "",
        "#  # foo bar  baz",
      ]);
      assertEquals(_hintIntoHPair("### foo bar  baz"), [
        "",
        "#  ## foo bar  baz",
      ]);
    });
    it("skip empty label", () => {
      assertEquals(_hintIntoHPair("::"), null);
      assertEquals(_hintIntoHPair(" ::"), null);
      assertEquals(_hintIntoHPair(" :: foo"), null);
    });
    it("return only label when description is empty", () => {
      assertEquals(_hintIntoHPair("foo"), ["foo", ""]);
      assertEquals(_hintIntoHPair(" foo  "), ["foo", ""]);
      assertEquals(_hintIntoHPair("foo ::"), ["foo", ""]);
      assertEquals(_hintIntoHPair(" foo ::"), ["foo", ""]);
      assertEquals(_hintIntoHPair("foo :: "), ["foo", ""]);
      assertEquals(_hintIntoHPair("foo::"), ["foo", ""]);
    });
    it("return rabel and description when both is given", () => {
      assertEquals(_hintIntoHPair(" foo  ::  FOO"), ["foo", "FOO"]);
      assertEquals(_hintIntoHPair(" foo :: FOO :: FOOO"), [
        "foo",
        "FOO :: FOOO",
      ]);
      assertEquals(_hintIntoHPair(" ::foo:: bar ::"), ["::foo", "bar ::"]);
    });
    it("non-spaced-separator", () => {
      assertEquals(_hintIntoHPair("foo:: FOO"), ["foo", "FOO"]);
      assertEquals(_hintIntoHPair("foo ::FOO"), ["foo ::FOO", ""]);
    });
    it("including colon", () => {
      assertEquals(_hintIntoHPair("::foo"), ["::foo", ""]);
      assertEquals(_hintIntoHPair(":foo :: FOO"), [":foo", "FOO"]);
      assertEquals(_hintIntoHPair("::foo :: FOO"), ["::foo", "FOO"]);
      assertEquals(_hintIntoHPair("::foo:: FOO"), ["::foo", "FOO"]);
      assertEquals(_hintIntoHPair(":: foo:: FOO"), null);
    });
    it("invalid separator", () => {
      assertEquals(_hintIntoHPair("foo::FOO"), ["foo::FOO", ""]);
      assertEquals(_hintIntoHPair("foo bar ::FOO  BAR"), [
        "foo bar ::FOO  BAR",
        "",
      ]);
    });
  });
});
