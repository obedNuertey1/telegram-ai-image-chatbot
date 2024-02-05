@echo off
$COMMIT_MESSAGE = Read-Host "Enter commit message: \n"
call git add .
call git commit -m $COMMIT_MESSAGE
call git push