@echo off
SETLOCAL EnableDelayedExpansion
set argcount=0
set cmdcount=0

for %%i in (%*) do (
	set /a argcount+=1
	
	if /i "%%i" == "validate" (
		set /a cmdcount+=1
			call :dockercmd "data validate"
	)
	if /i "%%i" == "train" (
		set /a cmdcount+=1
			call :dockercmd train
	)
	if /i "%%i" == "test" (
		set /a cmdcount+=1
			call :dockercmd test
	)
	if /i "%%i" == "shell" (
		set /a cmdcount+=1
			call :dockercmd shell
	)
	if /i "%%i" == "nlu" (
		set /a cmdcount+=1
			call :dockercmd "shell nlu"
	)

	REM Need delayed expansion to read var set in loop.
	if !cmdcount! lss !argcount! (
		echo.
		echo ERROR: [ %%i ] is not a supported argument
		goto :printusage
	)
)

if %argcount%==0 (
	goto :printusage
) else (
	goto :end
)

REM dockercmd %1=command
:dockercmd
SETLOCAL
	echo.
	echo [rasa-dev] running %~1 ...
	docker run -it -v "%cd%"/rasa:/app --name rasa-dev rasa/rasa:3.4.1-full %~1
	echo.
	echo [rasa-dev] removing container...
	docker rm rasa-dev
ENDLOCAL
goto :eof

:printusage
echo.
echo [rasa-dev] Usage:
echo.
echo 	rasa-dev ^<arg 1^> ^<arg 2^> ... ^<arg n^>
echo 	executes supported arguments sequentually
echo.
echo Supported arguments:
echo.
echo		validate	- validate training data
echo 	train		- train the chatbot
echo		test		- run unit tests
echo		shell		- open a Rasa shell
echo		nlu		- open a Rasa shell nlu session
echo.	
:end