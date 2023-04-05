# Genshin Impact Auto Check-In

Tool to automatically check in on HoYoLab's daily Genshin check-in.

https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481

- (Optional) Configure discord webhook in `genshin-impact-auto-check-in.js` to receive reports
- Configure accounts in an `accounts.json` file, see [`accounts.sample.json`](/accounts.sample.json) on what structure to follow
- Run as a scheduled task (like a [cronjob](https://crontab.guru/)) as `node genshin-impact-auto-check-in.js`.

Time zones for daily server resets:
- Asia: GMT+8
- Europe: GMT+1
- America: GMT-5 
