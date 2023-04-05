# Genshin Impact Auto Check-In

Tool to automatically check in on HoYoLab's daily Genshin check-in.

https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481

- (Optional) Configure discord webhook in `genshin-impact-auto-check-in.js` to receive reports
- Configure accounts in an `accounts.json` file, see [`accounts.sample.json`](/accounts.sample.json) on what structure to follow
- Run as a scheduled task (like a [cronjob](https://crontab.guru/)) as `node genshin-impact-auto-check-in.js`.

Server reset is always at 4am local time. Time zones for daily server resets are as follows:
- Asia: GMT+8
- Europe: GMT+1
- America: GMT-5 

### How to get `ltoken` and `ltuid`

**WARNING:** Only give these to people you absolutely trust and store them responsibly! They can be used to gain full access to the person's account on HoYoLab!

1. Login to [HoYoLab](https://www.hoyolab.com/)
2. Open Dev Tools and find where the Cookies are
   - Firefox: Storage -> Cookies -> https://www.hoyolab.com/
   - Chrome/Opera (GX)/Edge: Application -> Cookies -> https://www.hoyolab.com/
   - Others: https://google.com/
3. Find the cookies by the names of `ltoken` and `ltuid` and copy them to your `accounts.json`

`ltoken` should be 40 characters, [A-Za-Z0-9].  
`ltuid` should be 8+ numeric characters.
