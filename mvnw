#!/bin/sh
if command -v mvn >/dev/null 2>&1; then
  mvn "$@"
else
  echo "Maven not found. Please install Maven to proceed." >&2
  exit 1
fi
