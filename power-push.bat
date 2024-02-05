echo "Enter commit message: \n"
read COMMIT_MESSAGE
call git add .
call git commit -m $COMMIT_MESSAGE
call git push