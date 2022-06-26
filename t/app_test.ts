import {_nextEntryIdx, _ejectEvaledPath} from "src/app/app.ts";
import { assertEquals, afterEach, describe, it } from "t/deps.ts"
import {Helper, setEnv} from "t/helper.ts";

describe('app', ()=>{
  describe('_nextEntryIdx()', ()=>{
    describe('current', ()=>{
      const spec = [
        {current: 'git'},
        {current: 'git mv'},
        {patterns: ['git a$']},
      ]
      it('not found', ()=>{
        assertEquals(_nextEntryIdx(spec, '', 0), -1)
        assertEquals(_nextEntryIdx(spec, 'foo', 0), -1)
        assertEquals(_nextEntryIdx(spec, 'gith', 0), -1)
      })
      it('match `current`', ()=>{
        assertEquals(_nextEntryIdx(spec, 'git', 0), 0)
        assertEquals(_nextEntryIdx(spec, 'git  ', 0), 0)
        assertEquals(_nextEntryIdx(spec, 'foo git', 0), 0)
        assertEquals(_nextEntryIdx(spec, 'foo git ', 0), 0)
      })
      it('match subcmd', ()=>{
        assertEquals(_nextEntryIdx(spec, 'git mv', 0), 1)
        assertEquals(_nextEntryIdx(spec, 'git mv ', 0), 1)
        assertEquals(_nextEntryIdx(spec, 'git  mv ', 0), -1)
        assertEquals(_nextEntryIdx(spec, 'git mva', 0), -1)
      })
    })
    describe('patterns', ()=>{
      const spec = [
        {current: 'git'},
        {current: 'git mv'},
        {patterns: ['git a$']},
      ]
      it('match pattern', ()=>{
        assertEquals(_nextEntryIdx(spec, 'git a', 0), 2)
      })
      it('not match pattern', ()=>{
        assertEquals(_nextEntryIdx(spec, 'git a ', 0), -1)
        assertEquals(_nextEntryIdx(spec, 'git  a', 0), -1)
      })
    })

    describe('no-condition', ()=>{
      const spec = [
        {patterns: ['git']},
        {},
        {current: 'awk'},
        {},
      ]
      it('match anything when condition is not defined', ()=>{
        assertEquals(_nextEntryIdx(spec, '', 0), 1)
        assertEquals(_nextEntryIdx(spec, ' ', 0), 1)
        assertEquals(_nextEntryIdx(spec, ' aba ', 0), 1)
      })
      it('match anything when condition is not defined', ()=>{
        assertEquals(_nextEntryIdx(spec, 'git', 0), 0)
        assertEquals(_nextEntryIdx(spec, ' git add', 0), 0)
        assertEquals(_nextEntryIdx(spec, ' git log | less ', 0), 0)
      })
      it('giving index argument, search next entry', ()=>{
        assertEquals(_nextEntryIdx(spec, 'git', 1), 1)
        assertEquals(_nextEntryIdx(spec, 'git', 2), 3)
      })
    })
  })

  describe('_ejectEvaledPath()', ()=>{
    const helper = new Helper()
    afterEach(()=>{
      helper.restore()
    })
    it('パスが `$` から始まっていれば環境変数と見なして置換し,`file://` を先頭に加える', ()=>{
      setEnv('SHDO_HOME', '/tmp/foo')
      const kind2pth = {foo: {raw: '$SHDO_HOME/bar/baz.ts', evaled: null}}
      assertEquals(_ejectEvaledPath(kind2pth, 'foo'), 'file:///tmp/foo/bar/baz.ts')
      assertEquals(kind2pth.foo.evaled, 'file:///tmp/foo/bar/baz.ts')
    })
    it('evaled にすでに展開された文字列がある場合はそのまま `file://` を先頭に加える', ()=>{
      setEnv('SHDO_HOME', '/tmp/foo')
      const kind2pth = {foo: {raw: '$SHDO_HOME/bar/baz.ts', evaled: 'file:///hoge/fuga'}}
      assertEquals(_ejectEvaledPath(kind2pth, 'foo'), 'file:///hoge/fuga')
    })
  })

})
