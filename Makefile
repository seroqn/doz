.DEFAULT_GOAL := help

SRCES := ./src ./t ./dozkind
ALLOW_FLG := --allow-env --allow-read --allow-write
TEST_FLG := --unstable --import-map=./t/import_map.json


.PHONY: fmt
fmt:
	deno fmt $(SRCES)


.PHONY: test
test:
	deno test $(TEST_FLG) $(ALLOW_FLG) --jobs --no-check


.PHONY: type-check
type-check:
	deno test --no-run $(TEST_FLG) $$(find $(SRCES) -name '*.ts' -not -name '.deno')


.PHONY: help
help:
	@cat $(MAKEFILE_LIST) | \
	  awk -F'(:.*?)?## *' 'BEGIN{i=1} /^([[:alnum:]_-]+:.*?)?##/{acc[i++]=$$2} /^[[:alnum:]_-]+:/{for (j=1; j==1 || j < i; j++){printf "\033[36m%-20s\033[0m %s\n", j==1 ? substr($$0, 1, index($$0, ":")-1) : "", acc[j]}; delete acc; i=1}'

