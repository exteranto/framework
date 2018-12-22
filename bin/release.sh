#!/bin/bash

cd lib

for lib in support ioc aop events exceptions core storage messaging tabs cache compatibility management
do
  cd ${lib}
  # Start commands, use ${lib} to refer to the current package.

  ## Replace all local dependencies with the current version.
  sed -i -e 's/file:\.\.[^"]*/'"${TRAVIS_TAG/v/^}"'/g' package.json package-lock.json

  ## Login to the NPM registry.
  echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> ~/.npmrc

  ## Publish.
  npm publish --access public

  # End commands.
  cd ..
done
