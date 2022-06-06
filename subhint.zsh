if ! whence -p deno> /dev/null; then
  return
fi
export SUBHINT_ROOT="${SUBHINT_ROOT:-${0:a:h}}"

fpath+=("$SUBHINT_ROOT/zsh-functions")
autoload -Uz __subhint-get-hints
autoload -Uz __subhint-print-wdg
autoload -Uz __subhint-fzf-wdg
zle -N subhint-print __subhint-print-wdg
zle -N subhint-fzf __subhint-fzf-wdg
