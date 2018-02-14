const AD = require('ad');

console._oldLog = console.log;
console.log = (arg1, ...args) => {
    if(arg1 === 'AUTH USER' || arg1 === 'BACK FROM AUTH') {
        return;
    }
    console._oldLog(arg1, ...args);
};

const config = {
    url: process.env.LDAP_URL,
    user: `${process.env.LDAP_USERNAME}@${process.env.LDAP_DOMAIN}`,
    pass: process.env.LDAP_PASSWORD,
    baseDN: process.env.LDAP_BASEDN
};

const ad = new AD(config);
const VALID_AD_ROLLE = "0000-GA-STDAPPS"; // "0000-GA-STASH-USERS"; // eventuelt annen rolle som treffer kun utviklere

function isSuccess(name) {
    return (success) => {
        return success ? Promise.resolve() : Promise.reject({ type: name, message: "did not return success" });
    }
}

function authenticateUser(username, password) {
    return ad.user(username).authenticate(password)
        .then(isSuccess("auth"))
        .then(() => ad.user(username).isMemberOf(VALID_AD_ROLLE))
        .then(isSuccess("ad_rolle"))
        .then(() => ad.user(username).get())
}

module.exports = authenticateUser;