#!/bin/bash

cd lib

for lib in support ioc aop events exceptions core storage messaging tabs cache compatibility management
do
  cd ${lib}
  # Start commands, use ${lib} to refer to the current package.

    if ! npm i || ! npm run build || ! npm run test
    then
      exit 1
    fi

  # End commands.
  cd ..
done
