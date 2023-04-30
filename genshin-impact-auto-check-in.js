const https = require("https");

// Leave empty to disable reports
const discordWebhookUrl = "";
const awardStore = [];

/**
 * See accounts.sample.json to see how to set up accounts for this tool.
 * 
 * @typedef {Object} Account
 * @property {string} identifier
 * @property {string} ltoken
 * @property {number} ltuid
 * @property {boolean} announce
 */

/**
 * @typedef {Object} Award
 * @property {string} icon
 * @property {string} name
 * @property {number} count
 */

/**
 * @type {Account[]}
 */
const accounts = require("./accounts.json");

const api = {
    genshinImpact: {
        baseUrl: "https://sg-hk4e-api.hoyolab.com/event/sol/",
        actId: "e202102251931481",
        awards: "home",
        signInInfo: "info",
        signIn: "sign"
    },
    honkaiStarRail: {
        baseUrl: "https://sg-public-api.hoyolab.com/event/luna/os/",
        actId: "e202303301540311",
        awards: "home",
        signInInfo: "info",
        signIn: "sign"
    }
};

async function main() {
    let report = [];

    console.log("Fetching awards...");
    let awardsInfo = await get("https://sg-hk4e-api.hoyolab.com/event/sol/home?lang=en-us&act_id=e202102251931481");
    let awardsInfoJson = JSON.parse(awardsInfo.bodyData);

    if (awardsInfo && awardsInfoJson.retcode == 0)
        setAwards(awardsInfoJson.data.awards);

    console.log(awardStore.length + " awards fetched");

    for (const account of accounts) {
        // Auth Headers used for every request. I have no idea if these expire eventually or if they're valid permanently. We'll see.
        let headers = {
            Cookie: `ltoken=${account.ltoken};ltuid=${account.ltuid}`
        }

        // This whole part is optional, but nice to have as to not rely on error messages of the POST request
        console.log(`Checking sign info for ${account.identifier}...`);
        let signInInfo = await get("https://sg-hk4e-api.hoyolab.com/event/sol/info?act_id=e202102251931481", headers);
        let signInInfoJson = JSON.parse(signInInfo.bodyData);

        if (!signInInfo || signInInfoJson.retcode != 0) {
            let warning = `Failed to get sign info for ${account.identifier}: `;

            if (!signInInfo)
                warning += "Request error, see previous error";
            else
                warning += signInInfoJson.message;

            console.warn(warning);
            report.push(`${account.identifier}: Failed getting sign-in info`);

            continue;
        }

        if (signInInfoJson.data.is_sign) {
            console.warn(`${account.identifier} has already been signed in!`);
            report.push(`${account.identifier}: Already signed in today`);

            continue;
        }

        // Mandatory part starts here
        console.log(`Signing in as ${account.identifier}...`);
        let postData = {
            act_id: "e202102251931481"
        };
        let signInResult = await postJson("https://sg-hk4e-api.hoyolab.com/event/sol/sign", headers, postData);
        let signInResultJson = JSON.parse(signInResult.bodyData);

        if (!signInResult || signInResultJson.retcode != 0) {
            let warning = `Failed to sign in as ${account.identifier}: `;

            if (!signInResult)
                warning += "Request error, see previous error";
            else
                warning += signInResultJson.message;

            console.warn(warning);
            report.push(`${account.identifier}: Failed to sign in`);

            continue;
        }

        let award = getAward(signInInfoJson.data.sign_cnt);
        report.push(`${account.identifier}: Signed in! Got ${award.name} x${award.count}`);
    }

    if (!discordWebhookUrl)
        return;

    // Filter out accounts that shouldn't be announced (I was too lazy to do this beforehand so we're doing it here now lol)
    report = report.filter(line => {
        for (const account of accounts) {
            if (!account.announce && line.startsWith(account.identifier)) {
                return false;
            }
        }

        return true;
    });

    headers = {
        "Content-Type": "application/json"
    };
    let webhookResponse = await postJson(discordWebhookUrl, headers, {
        username: "HoYoLAB - Genshin Impact Auto Sign-In Report",
        avatar_url: "https://www.google.com/s2/favicons?sz=256&domain=hoyolab.com",
        content: report.join("\n")
    });

    console.log("Webhook reported " + webhookResponse.statusCode);
}

/* ========== Helper functions ========== */

function get(url, headers) {
    return new Promise(resolve => {
        let request = https.get(url, {
            headers
        }, response => {
            response.bodyData = "";
            response.on("data", chunk => response.bodyData += chunk);
            response.on("end", () => resolve(response));
            response.on("error", err => {
                console.error(err);
                resolve(false);
            });
        });
        request.end();
    });
}

function postJson(url, headers, bodyDataObject) {
    return new Promise(resolve => {
        let request = https.request(url, {
            method: "POST",
            headers
        }, response => {
            response.bodyData = "";
            response.on("data", chunk => response.bodyData += chunk);
            response.on("end", () => resolve(response));
            response.on("error", err => {
                console.error(err);
                resolve(false);
            });
        });
        request.write(JSON.stringify(bodyDataObject));
        request.end();
    })
}

function setAwards(items) {
    for (const item of items) {
        awardStore.push({
            icon: item.icon,
            name: item.name,
            count: item.cnt
        });
    }
}

/**
 * 
 * @param {number} dayIndex 
 * @returns {Award}
 */
function getAward(dayIndex) {
    let item = awardStore[dayIndex];

    if (!item) {
        item = {
            icon: "",
            name: "Unknown",
            count: 0
        }
    }

    return item;
}

main();