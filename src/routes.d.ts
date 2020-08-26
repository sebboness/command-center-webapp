/// <reference types="next-routes" />
import { EventChangeOptions, LinkProps, Registry, RouteParams } from "next-routes";

interface NextRoute {
    keyNames: string[];
    keys: string[];
    name: string;
    pattern: string;
    page: string;
    regex: string;
    toPath: (data?: RouteParams, options?: EventChangeOptions) => string;
}

interface Routes {
    Home: string,
    Login: string,
    Logout: string,

    get: (name: string) => NextRoute;
}

var routes: Registry & Routes & { routes: NextRoutes[] };
export default routes;