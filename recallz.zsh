if ! whence -p deno> /dev/null; then
  return
fi
export RECALLZ_ROOT="${RECALLZ_ROOT:-${0:a:h}}"
export RECALLZ_DEFAULT_KIND="${RECALLZ_DEFAULT_KIND:-hint}"

fpath+=("$RECALLZ_ROOT/zsh-functions")
autoload -Uz __recallz-wdg--do
#autoload -Uz __recallz-wdg--fzf
zle -N recallz-do __recallz-wdg--do
#zle -N recallz-fzf __recallz-wdg--fzf

autoload -Uz recallz
