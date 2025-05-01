const { customAlphabet } = require('nanoid');
const Url = require('../models/UrlModel');
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 6);

function parseUrl(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `http://${url}`;
    }
    return url;
}

async function saveUrl(longUrl, shortUrl, expirationDate) {
    try {
        console.log(`Saving shortUrl: ${shortUrl} of ${longUrl}...`);
        const newUrl = new Url({
            sourceUrl: longUrl,
            shortUrl: shortUrl,
            expirationDate: expirationDate
        });
        await newUrl.save();
        console.log('URL saved successfully!');
        console.log(await Url.find({}));
    } catch (error) {
        console.error('Error saving URL:', error);
        throw error;
    }
}

function generateUniqueId() {
    return nanoid()
}

async function getLongUrl(shortUrl) {
    const urlEntry = await Url.findOne({ shortUrl }).exec();
    if (!urlEntry) {
        return null;
    }
    return urlEntry.sourceUrl;
}

module.exports = {
    parseUrl,
    saveUrl,
    generateUniqueId,
    getLongUrl
};