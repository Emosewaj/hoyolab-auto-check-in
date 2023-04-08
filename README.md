# Genshin Impact Auto Check-In

Tool to automatically check in on HoYoLab's daily Genshin check-in.

https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481

Requires NodeJS version idfk, any? It only uses https ¯\\\_(ツ)\_/¯

## Setup

- (Optional) Configure discord webhook in `genshin-impact-auto-check-in.js` to receive reports
- Configure accounts in an `accounts.json` file, see [`accounts.sample.json`](/accounts.sample.json) on what structure to follow
- Run as a scheduled task (like a [cronjob](https://crontab.guru/)) as `node genshin-impact-auto-check-in.js`.

### When to run

The daily check-in resets every day at midnight China Standard Time (GMT+8). To make up for clock inaccuracies and runtime, I recommend setting the script up to run an five minutes after their midnight. Make sure to remember that China does not use daylight savings! If you're currently not in DST, run the script an hour and five minutes after their midnight instead to make up for the time difference.

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
