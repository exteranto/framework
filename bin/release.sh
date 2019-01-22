#!/bin/bash

## Login to the NPM registry.
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" >> ~/.npmrc

### @exteranto/exceptions ###
cd lib/exceptions

npm version ${TRAVIS_TAG/v/} --allow-same-version --no-git-tag-version
npm publish --access public

sleep 5
### @exteranto/core ###
cd ../core

npm version ${TRAVIS_TAG/v/} --allow-same-version --no-git-tag-version
npm i @exteranto/exceptions@${TRAVIS_TAG/v/} || exit 1
npm run build
npm publish --access public

sleep 5
### @exteranto/api ###
cd ../api

npm version ${TRAVIS_TAG/v/} --allow-same-version --no-git-tag-version
npm i @exteranto/exceptions@${TRAVIS_TAG/v/} @exteranto/core@${TRAVIS_TAG/v/} || exit 1
npm run build
npm publish --access public

sleep 5
### @exteranto/utils ###
cd ../utils

npm version ${TRAVIS_TAG/v/} --allow-same-version --no-git-tag-version
npm i @exteranto/exceptions@${TRAVIS_TAG/v/} @exteranto/core@${TRAVIS_TAG/v/} @exteranto/api@${TRAVIS_TAG/v/} || exit 1
npm run build
npm publish --access public

# Push back to the repository

# cd ../..
# echo "$GITHUB_KEY" >> github_key
# chmod 600 github_key
# eval `ssh-agent -s`
# ssh-add github_key

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

git add lib/**/*.json
git commit -m "$TRAVIS_TAG"
git push origin HEAD:master
