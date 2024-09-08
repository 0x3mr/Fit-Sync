# FIT SYNC
![chill pill](images/README-CHILLPILL-BACKGROUND.png)
# Live
- [fit-sync-seven.vercel.app](https://fit-sync-seven.vercel.app/)

# Authors
Noor Amjad - [GitHub](https://github.com/Justxd22) / [Twitter](https://twitter.com/_xd222) / [LinkedIn](https://www.linkedin.com/in/noor-amjad-xd)  
Amr Abdelfattah - [GitHub](https://github.com/0x3mr) / [Twitter](https://twitter.com/an0n_amr) / [LinkedIn](https://www.linkedin.com/in/amrabdelfattah/)  
Ahmed Shalaby - [GitHub](https://github.com/Madiocre) / [Twitter](https://twitter.com/Ahmed_K_Shalaby) / [LinkedIn](https://www.linkedin.com/in/ahmed-shalaby-31a03a235/)  
## What is FIT SYNC
### Upgrade your lifestyle: FitSync to the rescue!
[desc]
### [Go to Chill Pill!!!](#Live)
### [Youtube demo](https://youtu.be/)
## File indexing and store
[desc]

## UI/UX
- Using tailwind css   
  
![ui mockup](<images/Screenshot 2024-05-11 200048.png>)
![Final UI](images/Ui.png)

## Framwork and backend
- using node Nextjs typescript
- Easier hot reloads
- fast compile times
- fast deploys
- modern enough to satisfy our dev needs
- mongodb

# Installation / Running locally
- git clone
- make sure u have node 18 and npm installed
- run `npm install` on the project folder
- run the app `npm run dev`

## Deploying
- We're using `pm2` to run a compiled build
- `pm2` helps to run/stop/restart and also auto-start on failure due to app error or system shutdown  
- To restart `pm2 restart chillpill`
### Updating a deploy
- Git pull `git pull`
- make new build `npm run build`
- restart the app `pm2 restart chillpill`
### Steps to deploy from Zero to Hero
- First u make a new build with latest code using npm (do git pull if needed) `npm run build`
- Now if it builds without any errors u will have a new folder called `.next`
- Now we configure pm2 with `pm2 start npm --name "chillpill" -- start`
- now that pm2 registered your app you can see logs with `pm2 logs`
- now the app is running on localhost on port 3000 
- we need outside access that's why we are going to conguire nginx proxy
- our proxy will forward "web2.domain.com/chillpill" to "127.0.0.1:3000"
- We already have nginx installed just copy the config from `nginx.conf` to `/etc/nginx/sites-available/default`
- restart nginx with `sudo nginx -s reload`
- test ur app with ur domain


# License
Copyright (C) 2024
Licensed under the GPLv3 License
