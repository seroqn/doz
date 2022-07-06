import { _parseHint } from "kind/hint/hint.ts";
import { assertEquals, describe, it } from "t/deps.ts";

describe("kinds/hint", () => {
  describe("_parseHint()", () => {
    it("skip empty string", () => {
      assertEquals(_parseHint(""), null);
      assertEquals(_parseHint(" "), null);
      assertEquals(_parseHint("  "), null);
    });
    it("beging `#`, regard it as comment", () => {
      assertEquals(_parseHint("# foo bar  baz"), "\t# foo bar  baz");
      assertEquals(_parseHint("# foo bar ::  baz"), "\t# foo bar ::  baz");
    });
    it("skip empty label", () => {
      assertEquals(_parseHint("::"), null);
      assertEquals(_parseHint(" ::"), null);
      assertEquals(_parseHint("::foo"), null);
      assertEquals(_parseHint(" :: foo"), null);
    });
    it("return only label when description is empty", () => {
      assertEquals(_parseHint("foo"), "foo");
      assertEquals(_parseHint(" foo  "), "foo");
      assertEquals(_parseHint("foo ::"), "foo");
      assertEquals(_parseHint(" foo ::"), "foo");
      assertEquals(_parseHint("foo :: "), "foo");
    });
    it("return rabel and description when both is given", () => {
      assertEquals(_parseHint(" foo  ::  FOO"), "foo\tFOO");
      assertEquals(_parseHint(" foo :: FOO :: FOOO"), "foo\tFOO :: FOOO");
    });
    it("invalid separator", () => {
      assertEquals(_parseHint("foo:: FOO"), "foo:: FOO");
      assertEquals(_parseHint("foo ::FOO"), "foo ::FOO");
      assertEquals(_parseHint("foo bar ::FOO  BAR"), "foo bar ::FOO  BAR");
    });
  });
});
