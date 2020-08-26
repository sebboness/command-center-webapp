const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const next = require("next");
const path = require("path");
const routes = require("./src/routes");
const searchRoutes = require("./server/search/routes");

const dev = process.env.NODE_ENV !== "production";
const isProd = process.env.NODE_ENV === "production";

console.log("NODE_ENV =", process.env.NODE_ENV);

// setup next to look for pages under the src directory
const app = next({
    dev,
    dir: "./src",
});

// const handler = app.getRequestHandler();
const handler = routes.getRequestHandler(app);
const port = process.env.PORT || 3000;

app.prepare().then(() => {
    const server = express();
    server.use(bodyParser());
    server.use(cookieParser());

    // setting content and scripts folders to return static files so that templates work
    server.use("/content", express.static(path.join(__dirname, "/content")));
    server.use("/scripts", express.static(path.join(__dirname, "/scripts")));

    // setup custom swiftype search routes
    server.use("/_search", searchRoutes);

    server.get("/ping", (req, res) => {
        return res.send("OK!");
    });

    server.get("/article/:slug", (req, res) => {
        return app.render(req, res, "/article/details", { slug: req.params.slug });
    });
    
    server.get("*", (req, res) => {
        return handler(req, res);
    });

    server.listen(port, (err) => {
        if (err)
            throw err;
        console.log(`Ready on http://localhost:${port}`);
    });
})
.catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
});
