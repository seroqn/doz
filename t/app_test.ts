import { assertEquals, describe, it } from "./deps.ts"
import {_findTargEntry, _isExpantionMatched, _parseHint} from "src/app/app.ts";

describe('app', ()=>{
  const entry1 = {
    current: 'git',
    hints: [
      'add: Add file contents to the index',
      'mv: Move or rename a file, a directory, or a symlink',
      'restore: Restore working tree files',
      'rm: Remove files from the working tree and from the index',
      'sparse-checkout: Initialize and modify the sparse-checkout',
    ],
  }
  const entry2 = {
    current: 'git mv',
    hints: [
      '-f: Force renaming or moving of a file even if the target exists',
      '-k: Skip move or rename actions which would lead to an error condition. ',
      '-n: Do nothing; only show what would happen',
      '-v: Report the names of files as they are moved.',
    ],
  }
  const entry3 = {
    patterns: ['git a$'],
    hints: [
      'aa: -A',
      'ap: --patch',
      'au: --update',
    ],
  }
  const spec1 = [entry1, entry2, entry3]

  const xp_entry1 = {
    patterns: ['git'],
    expand: {org: 'origin', 'mas': 'master'},
  }
  const xp_entry2 = {
    expand: {'--h': '--help', '--v': '--version'},
  }
  const xp_spec = [xp_entry1, xp_entry2]

  describe('_findTargEntry()', ()=>{
    describe('current', ()=>{
      it('not found', ()=>{
        assertEquals(_findTargEntry(spec1, ''), undefined)
        assertEquals(_findTargEntry(spec1, 'foo'), undefined)
        assertEquals(_findTargEntry(spec1, 'gith'), undefined)
      })
      it('match `current`', ()=>{
        assertEquals(_findTargEntry(spec1, 'git'), entry1)
        assertEquals(_findTargEntry(spec1, 'git  '), entry1)
        assertEquals(_findTargEntry(spec1, 'foo git'), entry1)
        assertEquals(_findTargEntry(spec1, 'foo git '), entry1)
      })
      it('match subcmd', ()=>{
        assertEquals(_findTargEntry(spec1, 'git mv'), entry2)
        assertEquals(_findTargEntry(spec1, 'git mv '), entry2)
        assertEquals(_findTargEntry(spec1, 'git  mv '), undefined)
        assertEquals(_findTargEntry(spec1, 'git mva'), undefined)
      })
    })
    describe('patterns', ()=>{
      it('match pattern', ()=>{
        assertEquals(_findTargEntry(spec1, 'git a'), entry3)
      })
      it('not match pattern', ()=>{
        assertEquals(_findTargEntry(spec1, 'git a '), undefined)
        assertEquals(_findTargEntry(spec1, 'git  a'), undefined)
      })
    })
    describe('expand', ()=>{
      it('match anything when condition is not defined', ()=>{
        assertEquals(_findTargEntry(xp_spec, ''), xp_entry2)
        assertEquals(_findTargEntry(xp_spec, ' '), xp_entry2)
        assertEquals(_findTargEntry(xp_spec, ' aba '), xp_entry2)
      })
      it('match anything when condition is not defined', ()=>{
        assertEquals(_findTargEntry(xp_spec, 'git'), xp_entry1)
        assertEquals(_findTargEntry(xp_spec, ' git add'), xp_entry1)
        assertEquals(_findTargEntry(xp_spec, ' git log | less '), xp_entry1)
      })
    })
  })
  describe('_isExpantionMatched()', ()=>{
    const expantion = {'--h': '--help', '--v': '--version'}
    it('expantion not matched', ()=>{
      assertEquals(_isExpantionMatched(expantion, ''), false)
      assertEquals(_isExpantionMatched(expantion, 'git --h i'), false)
      assertEquals(_isExpantionMatched(expantion, 'git --h '), false)
    })
    it('expantion matched', ()=>{
      assertEquals(_isExpantionMatched(expantion, 'git --h'), true)
      assertEquals(_isExpantionMatched(expantion, 'git --v'), true)
      assertEquals(_isExpantionMatched(expantion, '--h'), true)
    })
  })
  describe('_parseHint()', ()=>{
    it('skip empty string', ()=>{
      assertEquals(_parseHint(''), null)
      assertEquals(_parseHint(' '), null)
    })
    it('skip empty label', ()=>{
      assertEquals(_parseHint(':'), null)
      assertEquals(_parseHint(' :'), null)
      assertEquals(_parseHint(' : foo'), null)
    })
    it('return only label when description is empty', ()=>{
      assertEquals(_parseHint('foo:'), 'foo\t')
      assertEquals(_parseHint(' foo:'), 'foo\t')
      assertEquals(_parseHint('foo: '), 'foo\t')
    })
    it('return rable and description when both is given', ()=>{
      assertEquals(_parseHint('foo: FOO'), 'foo\tFOO')
      assertEquals(_parseHint(' foo: FOO'), 'foo\tFOO')
      assertEquals(_parseHint('foo:FOO'), 'foo\tFOO')
    })
  })
})
