@echo off
$commitMessage = Read-Host "Enter commit message: "
git add .
git commit -m $COMMIT_MESSAGE
git push