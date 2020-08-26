require("dotenv").config();
const server = require("express");
const asyncRoute = require("../async-route");
const SiteSearchClient = require("@elastic/site-search-node");

const router = server.Router();
const engine = process.env.APP_SWIFTYPE_ENGINE;

const errorResult = (message, error) => {
    return {
        errors: [error],
        message,
        isSuccess: false,
    };
};

const successResult = (data) => {
    return {
        data,
        errors: [],
        message: "",
        isSuccess: true,
    };
};

client = new SiteSearchClient({
    apiKey: process.env.APP_SWIFTYPE_KEY,
});

/**
 * Get search results
 * Accepted URL params:
 * 
 * @param q The search query
 * @param page Page of the query
 * @param per_page Number of results per page
 * 
 */
router.get("/results", asyncRoute(async (req, res, next) => {
    try {
        const q = req.query.q || "";
        
        let page = parseInt(req.query.page);
        if (isNaN(page))
            page = 1;

        let per_page = parseInt(req.query.per_page);
        if (isNaN(per_page))
            per_page = 20;

        client.search(
            {
                engine,
                q,
                page,
                per_page,
            },
            (err, results) => {
                if (err != null)
                    res.status(500)
                        .send(errorResult("Swiftype search results failed.", err));

                res.json(successResult(results));
            }
        );
    }
    catch (err) {
        res.status(500)
            .send(errorResult("Swiftype search results error.", err));
    }
}));

/**
 * Get search suggests
 * Accepted URL params:
 * 
 * @param q The search query
 */
router.get("/suggests", asyncRoute(async (req, res, next) => {
    try {
        const q = req.query.q || "";

        client.suggest(
            {
                engine,
                q,
            },
            (err, results) => {
                if (err != null)
                    res.status(500)
                        .send(errorResult("Swiftype search suggest failed.", err));

                res.json(successResult(results));
            }
        );
    }
    catch (err) {
        res.status(500)
            .send(errorResult("Swiftype search suggest error.", err));
    }
}));

module.exports = router;
