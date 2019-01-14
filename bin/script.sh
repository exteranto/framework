#!/bin/bash

cd lib

for lib in support ioc aop events exceptions core storage messaging tabs cache compatibility management
do
  cd ${lib}
  # Start commands, use ${lib} to refer to the current package.
    # Links the package for local development.
    npm link

    npm i

    if ! npm run build || ! npm run test
    then
      exit 1
    fi

    # Linking depencendies.
    for package in $(grep -Po '@exteranto\/[a-z]+' package.json);
    do
      if [[ $package == *"$lib"* ]]
      then
        continue
      fi

      npm link ${package}
    done

  # End commands.
  cd ..
done
