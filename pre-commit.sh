#!/bin/bash

# pre-commit.sh

echo
echo "Stashing unstaged changes."
git stash -q --keep-index

# Run server tests with coverage

echo
echo "Running server tests..."
rm -rf coverage/server
rm -rf app-cov
mkdir -p coverage/server
node_modules/.bin/jscover app app-cov
mv app app-orig
mv app-cov app
NODE_ENV=test node_modules/.bin/mocha --require server.js app/tests/**/* -R mocha-lcov-reporter > coverage/server/lcov_temp.info
MOCHARESULT=$?
sed 's,SF:,SF:./app/,' coverage/server/lcov_temp.info > coverage/server/lcov.info
rm -f coverage/server/lcov_temp.info
rm -rf app
mv app-orig app
node_modules/.bin/grunt lcovMerge > /dev/null

# Check result of running server tests and bail if they failed

if [ $MOCHARESULT -ne 0 ]
    then
        echo "Server tests did not pass. Aborting commit and popping git stash."
        echo "Popping git stash."
        git stash pop -q
        echo
        exit 1
    else
        echo "All server tests passed."
        echo
fi

# Run client tests

echo "Running client tests..."
NODE_ENV=test node_modules/.bin/karma start --log-level disable --reporters none
KARMARESULT=$?

# Check result of running client tests and bail if they failed

if [ $KARMARESULT -ne 0 ]
    then
        echo "Client tests did not pass. Aborting commit and popping git stash."
        git stash pop -q
        echo
        exit 1
    else
        echo "All client tests passed."
        echo
fi

echo "Ready to commit--popping git stash."
git stash pop -q
echo

exit 0