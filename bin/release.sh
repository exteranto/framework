#!/bin/bash

cd lib

for lib in exceptions core api utils
do
  cd ${lib}
  # Start commands, use ${lib} to refer to the current package.

  ## Login to the NPM registry.
  echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> ~/.npmrc

  ## Publish.
  npm publish --access public

  # End commands.
  cd ..
done
