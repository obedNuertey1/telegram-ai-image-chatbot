#!/bin/bash
echo "Enter commit message: \n"
read COMMIT_MESSAGE

git add .
git commit -m $COMMIT_MESSAGE
git push