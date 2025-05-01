const { parseUrl, generateUniqueId, saveUrl, getLongUrl } = require('../utils/UrlUtils');

module.exports = {
    create: (req, res) => {
        const longUrl = req.body.url;

        if (!longUrl) {
            return res.status(404).send({ error: 'URL not provided' });
        }

        const parsedUrl = parseUrl(longUrl);
        const expirationDate = req.body.expirationDate;
        const shortUrl = generateUniqueId();

        console.log(`ShortUrl ${shortUrl} created of ${parsedUrl}`);
        saveUrl(parsedUrl, shortUrl)
            .then(() => {
                res.status(200).send({ shortUrl: shortUrl });
            })
            .catch((error) => {
                console.error('Error saving URL:', error);
                res.status(500).send({ error: 'Internal Server Error' });
            });
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