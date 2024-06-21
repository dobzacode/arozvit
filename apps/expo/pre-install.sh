#!/bin/bash

if [[ "$EAS_BUILD_PLATFORM" == "android" ]]; then
    npm install -g pnpm@9.1.3
    pnpm -v
fi

