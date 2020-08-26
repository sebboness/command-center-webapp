declare var process: any;

const Settings = {
    AppName: "Command Center",
    AppID: process.env.APP_ID as number,
    BetaAppID: process.env.APP_BETA_ID as number,
    ApiUrl: process.env.APP_API_URL as string,
    ServicesUrl: process.env.APP_SERVICES_URL as string,
    BetaUrl: process.env.APP_BETASITE_URL as string,
    ClientUrl: process.env.APP_CLIENT_URL as string,

    ClientId: process.env.APP_CLIENT_ID as string,
    ClientSecret: process.env.APP_CLIENT_SECRET as string,

    ClientName: process.env.APP_CLIENT_NAME as string,
    ClientNameAbbreviation: process.env.APP_CLIENT_NAME_SHORT as string,

    /** Used to automatically created asana tasks when reporting a bug */
    AsanaAccessToken: "",

    /** For any items stored in local storage, use this prefix for the key name */
    LocalStorageKeyPrefix: "",

    ResponsiveAdminBreakpointWidth: 900,
    ResponsiveBreakpointWidth: 970,

    TokenCookie: "",
    LegacyAuthCookie: "",
    CookieDomain: process.env.APP_COOKIE_DOMAIN as string,
    GATrack: process.env.APP_TRACK === "true",

    debug: false,

    ContentTextID_About: 1781,
    ContentTextID_Contributors: 1782,
};

export default Settings;
