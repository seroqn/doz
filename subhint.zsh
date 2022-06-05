if ! whence -p deno> /dev/null; then
  return
fi

export SUBHINT_ROOT="${SUBHINT_ROOT:-${0:a:h}}"

function ___subhint-core(){
  if [[ "$LBUFFER" =~ '^\s*$' ]]; then
    return
  fi
  deno run --no-check --allow-env --allow-read "$SUBHINT_ROOT/src/cli.ts" "$LBUFFER"
  return $?
}
function ___subhint-echo(){
  local out
  out="$(___subhint-core)"
  if [[ $? -ne 0 ]]; then
    echo
  fi
  if [[ -n $out ]]; then
    echo
    echo "$out"
  fi
  zle reset-prompt
}
zle -N subhint-echo ___subhint-echo

