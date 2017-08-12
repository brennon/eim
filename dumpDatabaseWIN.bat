:: Start Emotion in Motion in Windows Machine

:: Imports latest dataBase dump (mongod needs to be running)
mongodump --port 27017 -d emotion-in-motion-dev --out ./mongodb-dump/emotion-in-motion-dev
mongodump --port 27017 -d emotion-in-motion-test --out ./mongodb-dump/emotion-in-motion-test
mongodump --port 27017 -d emotion-in-motion-production --out ./mongodb-dump/emotion-in-motion-production

:: Start Node (not necessary in EiM terminals)
:: node server.js

pause
