const { parseUrl, generateUniqueId, saveUrl, getLongUrl, getUrlInfo } = require('../utils/UrlUtils');

module.exports = {
    create: (req, res) => {
        // expirationDate will be provided in minutes to simplify timezone handling
        const longUrl = req.body.url;

        if (!longUrl) {
            return res.status(404).send({ error: 'URL not provided' });
        }

        const parsedUrl = parseUrl(longUrl);
        const expirationDate = req.body.expirationDate;
        const shortUrl = generateUniqueId();

        console.log(`ShortUrl ${shortUrl} created of ${parsedUrl}`);
        saveUrl(parsedUrl, shortUrl, expirationDate)
            .then(() => {
                res.status(200).send({ shortUrl: shortUrl });
            })
            .catch((error) => {
                console.error('Error saving URL:', error);
                res.status(500).send({ error: 'Internal Server Error' });
            });
    },

    get: async (req, res) => {
        try {
            const shortUrl = req.query.shortUrl;
    
            const info = await getUrlInfo(shortUrl);
    
            if (!info) {
                return res.status(404).send({ error: 'URL not found' });
            }
    
            const responseObject = {
                shortUrl: info.shortUrl,
                longUrl: info.sourceUrl,
                expirationDate: info.expirationDate,
                createdAt: info.createdAt
            } 

            res.status(200).send(responseObject);
        } catch (error) {
            console.error('Error during search:', error);
            res.status(500).send({ error: 'Internal Server Error' });
        }
    },

    redirect: async (req, res) => {
        try {
            const shortUrl = req.params.shortUrl;
    
            const longUrl = await getLongUrl(shortUrl);
    
            if (!longUrl) {
                res.redirect("notfound.html");;
            }
    
            res.redirect(longUrl);
        } catch (error) {
            console.error('Error during redirection:', error);
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }
};