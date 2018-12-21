#!/bin/bash

libs=(support ioc aop events exceptions core storage messaging tabs cache compatibility management)

for lib in ${libs[@]}; do
    cd ${lib}
    # Start commands, use ${lib} to refer to the current package.

    npm i 

    # End commands.
    cd ..
done