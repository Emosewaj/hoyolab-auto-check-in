# HoYoLab Auto Check-In

Tool to automatically check in on HoYoLab's daily Genshin Impact and Honkai: Star Rail check-in.

https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481  
https://act.hoyolab.com/bbs/event/signin/hkrpg/index.html?act_id=e202303301540311

Requires NodeJS version idfk, any? It only uses https ¯\\\_(ツ)\_/¯

## Setup

- (Optional) Configure discord webhook in `hoyolab-auto-check-in.js` to receive reports
- Configure accounts in an `accounts.json` file, see [`accounts.sample.json`](/accounts.sample.json) on what structure to follow
- Run as a scheduled task (like a [cronjob](https://crontab.guru/)) as `node hoyolab-auto-check-in.js`.

### When to run

The daily check-in resets every day at midnight China Standard Time (GMT+8). To make up for clock inaccuracies and runtime, I recommend setting the script up to run an five minutes after their midnight. Make sure to remember that China does not use daylight savings! If you're currently not in DST, run the script an hour and five minutes after their midnight instead to make up for the time difference.

### How to get `ltoken_v2` and `ltuid`

**WARNING:** Only give these to people you absolutely trust and store them responsibly! They can be used to gain full access to the person's account on HoYoLab!

1. Login to [HoYoLab](https://www.hoyolab.com/)
2. Open Dev Tools (F12, Ctrl + Shift + `i`, or Right-click -> Inspect Element) and find where the Cookies are
   - Firefox: Storage -> Cookies -> https://www.hoyolab.com/
   - Chrome/Opera (GX)/Edge: Application -> Cookies -> https://www.hoyolab.com/
   - Others: [Google it](https://google.com/search?q=How+to+see+cookie+values+insert+your+browser+here)
3. Find the cookies by the names of `ltoken_v2` and `ltuid_v2` and copy them to your `accounts.json` into the `ltoken_v2` and `ltuid` fields

`ltoken_v2` should be 125 or so characters, [A-Za-Z0-9_.].
`ltuid` should be 8+ numeric characters.
