if ! whence -p deno> /dev/null; then
  return
fi
export EXHINT_ROOT="${EXHINT_ROOT:-${0:a:h}}"

fpath+=("$EXHINT_ROOT/zsh-functions")
autoload -Uz __exhint-get-hints
autoload -Uz __exhint-print-wdg
autoload -Uz __exhint-fzf-wdg
zle -N exhint-print __exhint-print-wdg
zle -N exhint-fzf __exhint-fzf-wdg
