const routes = module.exports = require("next-routes")()
const _ = require("lodash");

routes.Home = "home",
routes.Login = "login",
routes.Logout = "logout",

// Example
//routes.ExampleDetails = "exampleDetails",
//routes.ExampleDetailsLink = (slug, section) => ({ route: routes.ExampleDetails, params: { slug, section }}),

// Finds a route by name
routes.get = (name) => {
    return _.find(routes.routes, (x) => x.name === name);
};
 
// define the routes
routes
.add(routes.Home, "/#:slug?", "")
.add(routes.Login, "/login", "login")
.add(routes.Logout, "/logout", "logout");
// Example
//.add(routes.ExampleDetails, "/example/:slug#:section?", "example/details")