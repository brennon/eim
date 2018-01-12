REM Start Max patch
START "" "C:\Program Files\Cycling '74\Max Runtime 6.1\maxRT.exe" C:\eim\MaxMSP\EmotionInMotion\EmotionInMotion.maxproj

TIMEOUT 15

REM Set Node.js environment to production
SET NODE_ENV=production

REM Switch to EiM directory
CD c:\eim

REM Start Node.js server
:: C:\Users\EmotionInMotionV2\AppData\Roaming\npm\grunt default
node server.js
