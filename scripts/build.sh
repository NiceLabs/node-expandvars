#!/bin/bash
PATH="$(npm bin):$PATH"
set -x
rimraf cjs esm
tsc
tsc -p tsconfig.esm.json
