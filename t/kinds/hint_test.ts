import {_parseHint} from "kinds/hint/hint.ts";
import { assertEquals, afterEach, describe, it } from "t/deps.ts"

describe('kinds/hint', ()=>{
  describe('_parseHint()', ()=>{
    it('skip empty string', ()=>{
      assertEquals(_parseHint(''), null)
      assertEquals(_parseHint(' '), null)
      assertEquals(_parseHint('  '), null)
    })
    it('skip empty label', ()=>{
      assertEquals(_parseHint('::'), null)
      assertEquals(_parseHint(' ::'), null)
      assertEquals(_parseHint('::foo'), null)
      assertEquals(_parseHint(' :: foo'), null)
    })
    it('return only label when description is empty', ()=>{
      assertEquals(_parseHint('foo'), 'foo\t')
      assertEquals(_parseHint(' foo  '), 'foo\t')
      assertEquals(_parseHint('foo ::'), 'foo\t')
      assertEquals(_parseHint(' foo ::'), 'foo\t')
      assertEquals(_parseHint('foo :: '), 'foo\t')
    })
    it('return rabel and description when both is given', ()=>{
      assertEquals(_parseHint('foo ::FOO'), 'foo\tFOO')
      assertEquals(_parseHint(' foo  ::  FOO'), 'foo\tFOO')
      assertEquals(_parseHint('foo bar ::FOO  BAR'), 'foo bar\tFOO  BAR')
    })
    it('beging `#`, regard it as comment', ()=>{
      assertEquals(_parseHint('# foo bar  baz'), '\t- foo bar  baz')
    })
  })
})
