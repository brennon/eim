:: Backup EiM biosignal files

@echo off

:: Folder with data files
set dataFolder=C:\Users\Javier\Desktop\test\data

:: Destination folder
set backupFolder=C:\Users\Javier\Desktop\test\bak

:: Set deleteFlag to 1 to delete files after copying
set deleteFlag=1

:: Get Today's date
   FOR /f "tokens=1-4 delims=/-. " %%G IN ('date /t') DO (call :s_fixdate %%G %%H %%I %%J)
   goto :s_print_the_date   

   :s_fixdate
   if "%1:~0,1%" GTR "9" shift
   FOR /f "skip=1 tokens=2-4 delims=(-)" %%G IN ('echo.^|date') DO (
       set %%G=%1&set %%H=%2&set %%I=%3)
   goto :eof

   :s_print_the_date
   ENDLOCAL&SET mm=%mm%&SET dd=%dd%&SET yy=%yy%


echo Month:[%mm%]  Day:[%dd%]  Year:[%yy%]
mkdir %backupFolder%\EiM_%mm%-%dd%
echo Copying EiM files...
xcopy /C /Y /S %dataFolder% %backupFolder%\EiM_%mm%-%dd%

IF %deleteFlag% EQU 1 (
echo Deleting source files...
del /Q %dataFolder%
)
::pause