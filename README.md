# doz
シェルのコマンドラインのコマンドやサブコマンドが、あらかじめ設定したパターンにマッチしたとき、設定したヒントを表示したりなどします。


## Introduction
オプションやサブコマンドが膨大なコマンドを使うのに辟易しますか？<br>
doz は自分が使うコマンドのみを厳選したリファレンスを提供します。<br>
ユーザーが作成した `yaml` ファイルを読み込んで、カーソルの前方の文脈に応じたコマンドを `echo` で表示させます。

今のところシェルは zsh にのみ対応。<br>
[Deno](https://deno.land/) に依存します。<br>


## Installation

### zinit
```zsh
zinit ice lucid depth"1" blockf
zinit light seroqn/doz
```

### git clone
```sh
$ git clone https://github.com/seroqn/doz.git
$ echo "source /path/to/dir/doz" >> ~/.zshrc
```


## Environment variables

`DOZ_HOME`
: default: `"$XDG_CONFIG_HOME/doz"`
  このディレクトリ以下の設定ファイルが読み込まれる。
  これが設定されていない場合、`"$XDG_CONFIG_HOME/doz"` がディレクトリとして使われる。
  Windows 環境の場合、`XDG_CONFIG_HOME` 環境変数が設定されていないと `%AppData%\xdg.config` が使われる。

`DOZ_DEFAULT_KIND`
: default: `"hint"`
  エントリに kind キーが指定されていない場合は、この変数の値の kind であると見なす。

`DOZ_KINDS_DIRS`
: default: `"$DOZ_ROOT/dozkind/*"`
  ディレクトリ名を指定する。このディレクトリの下の各ディレクトリ名を kind 名として使用する。
  改行区切りで複数指定できる。glob 記号 `*` や `**` を使うこともできる。
  ディレクトリ名の先頭が `$` で始まっている場合、そこから次のディレクトリ区切り文字までを環境変数名と見なし、それを展開する。
  例えば `"$DOZ_ROOT/kinds"` または `"${DOZ_ROOT}/kinds"` の場合、環境変数 `DOZ_ROOT` の値に展開される。
  `"$HOME/ghq/**/dozkind/*"` にこの値をセットして、`$HOME/ghq/` 以下に設置した dozkind を使用するということもできる。

`DOZ_ROOT`
: (自動生成)
  doz プラグインが読み込まれたときに自動生成され、このプラグインの本体のある場所のディレクトリがセットされる。



## Setting
事前にプラグインか何かで `doz.zsh` を `source` させてください。<br>
キーバインド `doz-do` をいずれかのキーに登録してください。このキーで doz を呼び出しコマンドラインの文脈に応じて何かします。

```zsh:.zshrc
if [[ -n $DOZ_ROOT ]]; then
  export DOZ_HOME="$HOME/doz" # default: "$XDG_CONFIG_HOME/doz"
  bindkey '^o' doz-do
fi
```

`$DOZ_HOME` ディレクトリ以下に `entries.yml` を作成します。<br>
このファイルに記述した内容を上からコマンドラインとマッチさせて初めに条件に合った内容が実行されます。


1エントリは以下の構造を持ちます。<br>
コマンドラインマッチ条件に `current` か `patterns` を指定し、`kind` で種類を決め、`what` でその kind 特有の詳細属性を決めます。
```typescript
type Entry = {
  current?: string;     // 条件。正規表現。このパターンの後に `\s*$` というパターンが隠されている
  patterns?: string[];  // 条件。正規表現での条件群。
  kind?: string;        // 省略すると $DOZ_DEFAULT_KIND が使われる。
  what?: unknown;       // kind 特有の属性
};
```

これらエントリを配列にして指定します。
```yaml:entries:yml
- current: find   # 条件 (ここではカーソル左に "find" があるということ)
  kind: hint      # kind を省略した場合 $DOZ_DEFAULT_KIND が使われる。デフォルトでは $DOZ_DEFAULT_KIND は "hint" なのでこの kind は省略可能
  what:           # what 以下にその kind 固有の要素を設定する(hint の kind では "hints")
    hints:
        # ここからは kind/hint の機能
        # 内容部分の文字列はクォーテーションで括ること推奨。特に記号を使うときには。
      - '# find [<DIR=.>] [<条件>] [<Action=-print>]' # "#" で始まる文字列は説明文。シグニチャなどを記述する
      - '-type {f|d} :: f:file, d:directory'          # "<対象> :: <説明>" の形式で要素を記述する。
      - '-name \*.dat -o -name "*.txt"'               # 説明を省略することも可能
      - '{-or|-o} <expl>...'
      - '{-not|!} <expl>...'

- current: git
  what:
    hints:  # 用途: オプションやサブコマンドやエイリアスなどの記述に
      - 'dc   :: diff --cached :: add されている部分'
      - 'd    :: diff :: add されていない部分'
      - 'wd   :: 文字単位で diff 表示'
      - 'b    :: branch [<new-branch>]'
      - 'cob  :: checkout -b <new-branch>'
      - 'mn   :: merge --no-ff <branch>'
      - 'mv [-nf] {<file> <newname> | <file>... <dir>}'
      - 'pu   :: push -u [origin [master/main]]'
      - 's    :: stash save'
      - 'sl   :: stash list'
      - 'sp   :: stash pop'

- patterns:       # patterns を使う場合、コマンドラインカーソルより左辺が正規表現にマッチしたら適用される。
    - git a$      # この場合、左辺の最後が "git a" なら適用される。
  what:
    hints:
      - 'aa   :: -A: 変更・新規・削除すべて追加'
      - 'a .  :: カレントディレクトリ以下についてのすべて'
      - 'au   :: -u: すでに追加されているもので更新があるものを追加する'
      - 'ap'

- patterns:
    - git
  kind: expand        # "hint" 以外の kind の場合は省略できない。
  what:
    expansion:        # kind/expand の場合、エントリがマッチしていても expansion がマッチしなければマッチしなかったという扱いで以降のエントリも検索される。
      org: origin     # 例えばカーソルの左辺末が "org" なら "origin" に展開する。
      mas: master
      ms: master
      H: HEAD
      OH: ORIG_HEAD

# `current` や `patterns` を持たないエントリーは全てにマッチする。
- kind: expand
  what:
    expansion:
      --h: --help
      --v: --version
      t: test
```

標準で用意されている kind は `hint` と `expand` である。


### kind/hint
コマンドライン左辺がある状態のときに呼び出すと、そのコマンドに関するヒントを標準出力に書き出す。

what: hints
: 文字列の配列。
  先頭が `"#"` で始まる文字列はコマンドの構文や説明文としての扱いを受ける。
  通常文字列は `":: "` で区切ることで以降を説明として扱う。
  `"::"` の後に文字が続く場合は空白が必要。すなわち `"TARGET:: DESCRIPTION"` や `"TARGET :: DESCRIPTION"` は許容されるが、 `"TARGET ::DESCRIPTION"` は許容されない。
  `"::"` の前後の空白は除去される。
  2つ目以降の `"::"` にこの効果はなく通常の文字列として扱われる。


### kind/expand
コマンドライン左辺がある状態のときに呼び出すと、キーワードを展開する。

what: expansion
: 文字列の連想配列。
  キーが展開前のキーワード、値が展開後の結果である。


## Command (試験中)
`$ doz list [topics]`
: 登録されているエントリを一覧する
  \-i 結果を `<word>` に含むものに絞り込む

`$ doz list kinds`
: エントリに存在する kind を一覧する

`$ doz query [<args>...]`
: コマンドラインが `<args>...` のときの出力を表示する。
