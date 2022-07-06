if ! whence -p deno> /dev/null; then
  return
fi
export DOZ_ROOT="${DOZ_ROOT:-${0:a:h}}"
export DOZ_DEFAULT_KIND="${DOZ_DEFAULT_KIND:-hint}"

fpath+=("$DOZ_ROOT/zsh-functions")
autoload -Uz __doz-wdg--do
#autoload -Uz __doz-wdg--fzf
zle -N doz-do __doz-wdg--do
#zle -N doz-fzf __doz-wdg--fzf

autoload -Uz doz
