REM Start Max patch
start "" "C:\Program Files\Cycling '74\Max Runtime 6.1\maxRT.exe" C:\eim\EiMpatch\EmotionInMotion.maxproj

REM Set Node.js environment to production
set NODE_ENV=production

REM Switch to EiM directory
cd c:\eim

REM Start Node.js server
C:\Users\EmotionInMotionV2\AppData\Roaming\npm\grunt default
