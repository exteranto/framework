#!/bin/bash

cd lib

for lib in support ioc aop exceptions events core storage messaging tabs cache compatibility management
do
  cd ${lib}
  # Start commands, use ${lib} to refer to the current package.
    if ! npm i
    then
      exit 1
    fi

    # Links the package for local development.
    npm link

    # Linking depencendies.
    for package in $(grep -Po '@exteranto\/[a-z]+' package.json);
    do
      if [[ $package == *"$lib"* ]]
      then
        echo ${lib}
        continue
      fi

      npm link ${package}
    done

    if ! npm run build || ! npm run test
    then
      exit 1
    fi

  # End commands.
  cd ..
done
