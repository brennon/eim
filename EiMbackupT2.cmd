:: Backup EiM biosignal files

@echo off

:: Folder with bio files
set dataFolder="C:\eim\MaxMSP\EmotionInMotion\data"

:: Folder with trial files
set trialFolder="C:\eim\trials"

:: Destination folder
set backupFolder="C:\Google Drive\T2"

:: Set deleteFlag to 1 to delete files after copying
set deleteFlag=1

:: Get Today's date (date result will depend on region of computer (eg. US 01-22-2014, UK 22-01-2014)
set yyyy=%DATE:~6,4%
set mm=%DATE:~3,2%
set dd=%DATE:~0,2%

echo Month:[%mm%]  Day:[%dd%]  Year:[%yyyy%]
mkdir %backupFolder%\EiM_%yyyy%-%mm%-%dd%
echo Copying EiM bio files...
xcopy /C /Y /S %dataFolder% %backupFolder%\EiM_%yyyy%-%mm%-%dd%
echo Copying EiM trial files...
xcopy /C /Y /S %trialFolder% %backupFolder%\EiM_%yyyy%-%mm%-%dd%

IF %deleteFlag% EQU 1 (
echo Deleting source files...
del /Q %dataFolder%
del /Q %trialFolder%
)
::pause