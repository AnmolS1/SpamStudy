@ECHO OFF
SETLOCAL
:: if python exists, move on, otherwise have the user install it
:while_1
IF EXIST "%LOCALAPPDATA%\Programs\Python\Python39" (
	ECHO Python 3.9 is installed, continuing...
	IF EXIST "python-3.9.10.exe" (DEL python-3.9.10.exe)
) ELSE (
	CALL :clearSpace 110000
	ECHO Please install Python before continuing
	ECHO Instructions for downloading and installing Python are available at https://anmols1.github.io/SpamStudy/
	curl -s https://www.python.org/ftp/python/3.9.12/python-3.9.12-amd64.exe -o python-3.9.10.exe
	START python-3.9.10.exe
	PAUSE
	GOTO :while_1
)

curl -s https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python get-pip.py > installation.log
DEL get-pip.py

:: if the user doesn't have the required packages then install them
:: simultaneously check to make sure the user has enough space
(pip list | findstr "selenium") >> installation.log
IF errorlevel 1 (
	CALL :clearSpace 11408
	pip --disable-pip-version-check install selenium >> installation.log
)
(pip list | findstr "undetected-chromedriver") >> installation.log
IF errorlevel 1 (
	CALL :clearSpace 16647
	pip --disable-pip-version-check install undetected_chromedriver >> installation.log
)
(pip list | findstr "ibmcloudant") >> installation.log
IF errorlevel 1 (
	CALL :clearSpace 1401
	pip --disable-pip-version-check install ibmcloudant >> installation.log
)
(pip list | findstr "python-dotenv") >> installation.log
IF errorlevel 1 (
	CALL :clearSpace 80
	pip --disable-pip-version-check install python-dotenv >> installation.log
)

curl -s https://raw.githubusercontent.com/AnmolS1/SpamStudy/main/app.zip -o studyapp-00.zip
:: TODO - UNZIP FOLDER OR ACCESS DIRECTLY

:: python process.py

:: TODO - DELETE ALL FILES

PAUSE
EXIT /B %ERRORLEVEL%

:: have the user clear up some space for whatever we need to install
:: unit used to check is kilobytes b/c windows has a dumb size limit
:clearSpace
	:: the first argument is the space required for the installation
	SET /A REQUIRED=%~1
	:: set FREESPACE to the amount of free space on the disk
	CALL :getFreeSpace FREESPACE
	:: run while we don't have enough space to install
	:while
	IF %FREESPACE% LEQ %REQUIRED% (
		:: get the amount of space that we need to remove
		SET NEEDTOREMOVE=%REQUIRED% - %FREESPACE% + 50
		ECHO Please free approximately %NEEDTOREMOVE%000 bytes of space
		PAUSE
		CALL :getFreeSpace FREESPACE
		:: head back up to the :while declaration
		GOTO :while
	)
EXIT /B 0

:: get the amount of free space in kilobytes
:getFreeSpace
	:: runs fsutil volume diskfree C:\ and gets the first line of output
	:: output will look like "Total quota free bytes  : x (x)
	@FOR /f "tokens=* usebackq" %%f IN (
		`fsutil volume diskfree C:\`
	) DO @SET "line=%%f"
	
	:: cut out everything up to the number
	SET line=%line:~26%
	
	:: instead of cutting out the parentheses, get the number
	:: this was just easier to write, not sure how to regex in batch
	FOR /f "tokens=1 delims= " %%i IN ("%line%") DO (SET FREESPACE=%%i)
	
	:: remove commas, cut out last 3 digits, return as number
	SET FREESPACE=%FREESPACE:,=%
	SET /A %~1=%FREESPACE:~0,-3%
EXIT /B 0