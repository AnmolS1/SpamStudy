@echo off
SETLOCAL
CALL :clearSpace "-m" , 100
cmd /k
EXIT /B %ERRORLEVEL%

:: inform the user that more space is required to install something
:clearSpace
set UNIT=%~1
set /A REQUIRED=%~2
set READABLE=%UNIT:~-1%b
:: figure out how to get clear space in disk
EXIT /B 0