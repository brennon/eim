:: Start Emotion in Motion in Windows Machine

:: Imports latest dataBase dump (mongod needs to be running)
mongorestore --port 27017 -d emotion-in-motion-dev --drop --noIndexRestore ./mongodb-dump/emotion-in-motion-dev
mongorestore --port 27017 -d emotion-in-motion-test --drop --noIndexRestore ./mongodb-dump/emotion-in-motion-test
mongorestore --port 27017 -d emotion-in-motion-production --drop --noIndexRestore ./mongodb-dump/emotion-in-motion-production

:: Start Node (not necessary in EiM terminals)
:: node server.js

pause
dd