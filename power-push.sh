#!/bin/bash
echo "Enter commit message: "
read COMMIT_MESSAGE

git add .
git commit -m $COMMIT_MESSAGE
git push