#!/bin/bash

## Login to the NPM registry.
# echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> ~/.npmrc


### @exteranto/exceptions ###
cd lib/exceptions

npm version ${TRAVIS_TAG/v/^} --allow-same-version --no-git-tag-version
npm publish --access public

sleep 5
### @exteranto/core ###
cd ../core

npm version ${TRAVIS_TAG/v/^} --allow-same-version --no-git-tag-version
npm i @exteranto/exceptions@${TRAVIS_TAG/v/^}
npm run build
npm publish --access public

sleep 5
### @exteranto/api ###
cd ../api

npm version ${TRAVIS_TAG/v/^} --allow-same-version --no-git-tag-version
npm i @exteranto/exceptions@${TRAVIS_TAG/v/^} @exteranto/core@${TRAVIS_TAG/v/^}
npm run build
npm publish --access public

sleep 5
### @exteranto/utils ###
cd ../utils

npm version ${TRAVIS_TAG/v/^} --allow-same-version --no-git-tag-version
npm i @exteranto/exceptions@${TRAVIS_TAG/v/^} @exteranto/core@${TRAVIS_TAG/v/^} @exteranto/api@${TRAVIS_TAG/v/^}
npm run build
npm publish --access public
