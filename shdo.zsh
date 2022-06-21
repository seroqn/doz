if ! whence -p deno> /dev/null; then
  return
fi
export SHDO_ROOT="${SHDO_ROOT:-${0:a:h}}"

fpath+=("$SHDO_ROOT/zsh-functions")
autoload -Uz __shdo-wdg--do
autoload -Uz __shdo-wdg--fzf
zle -N shdo-do __shdo-wdg--do
zle -N shdo-fzf __shdo-wdg--fzf
