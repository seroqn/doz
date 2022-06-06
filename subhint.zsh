if ! whence -p deno> /dev/null; then
  return
fi

export SUBHINT_ROOT="${SUBHINT_ROOT:-${0:a:h}}"

function ___subhint-get-hints(){
  if [[ "$LBUFFER" =~ '^ *$' ]]; then
    return
  fi
  deno run --no-check --allow-env --allow-read "$SUBHINT_ROOT/src/cli.ts" "$LBUFFER"
  return $?
}
function ___subhint-print(){
  local out
  out="$(___subhint-get-hints)"
  if [[ $? -ne 0 ]]; then
    echo
  fi
  if [[ -n "$out" ]]; then
    echo
    echo "$out"
  fi
  zle reset-prompt
}
function ___subhint-fzf(){
  local out sel
  out="$(___subhint-get-hints)"
  if [[ $? -ne 0 ]]; then
    echo
  fi
  if [[ -n "$out" ]]; then
    sel=$(echo "$out" | fzf --prompt='subhint > ')
    if [[ -n "$sel" ]]; then
      if [[ ! "$LBUFFER" =~ ' $' ]]; then
        LBUFFER="$LBUFFER "
      fi
      LBUFFER="$LBUFFER$(echo "$sel" | cut -f 1) "
    fi
  fi
  zle reset-prompt
}
zle -N subhint-print ___subhint-print
zle -N subhint-fzf ___subhint-fzf

