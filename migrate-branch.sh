git_origin_branch=$1
git_origin_repo=$2
git_module_destination=$3

if [ -z "$git_origin_repo" ]
then
    echo "\$git_origin_repo is empty"
    exit
fi

if [ -z "$git_module_destination" ]
then
    echo "\$git_module_destination is empty"
    exit
fi

git_origin="https://github.com/"$git_origin_repo'.git'
git_destination_server="https://github.com/"$git_module_destination'.git'


echo 'Git clone source repo'
git clone -b $git_origin_branch $git_origin	 #Clone the project if the directory does not exist
#Before going into the folder, we copy the extra files needed

node index.js $git_origin_repo $git_module_destination
#Go to the project
cd $git_origin_repo
#stage extra files
echo 'Stage new files'
git add .
echo 'Commit new files -m "Adding mta files"'
git commit -m 'Adding mta files'
echo 'git branch -M main'
git branch -M main

#Exectue the git commands to change the repository
echo 'Removing old origin'
git remote rm origin
echo 'Adding new origin'
git remote add origin $git_destination_server
echo 'Git Fetch'
git fetch origin
echo 'Allow unrelated histories'
git merge --allow-unrelated-histories origin main
echo 'Set the new upstream'
git push --set-upstream origin main

# echo 'Pushing to the new origin'      moved to the end of the script
git push origin


#----------------------------------

$SHELL