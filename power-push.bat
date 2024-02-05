# Prompt for commit message
$commitMessage = Read-Host "Enter commit message"

# Stage all changes
git add .

# Commit changes with the specified message
git commit -m $commitMessage

# Push changes to the remote repository
git push
