#!/bin/bash

# Submit code coverage information to Coveralls

echo
echo "Submitting coverage information to Coveralls..."
node_modules/.bin/grunt coveralls > /dev/null
echo "Coverage information successfully submitted to Coveralls."
echo