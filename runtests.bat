@echo off
call rmdir /s /q "./dist"
call npm run build
call npm run test