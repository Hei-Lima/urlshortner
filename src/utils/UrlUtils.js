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
            expirationDate: Date.now() + (1000* 60 * expirationDate) 
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

async function getUrlInfo(shortUrl) {
    const urlEntry = await Url.findOne({ shortUrl }).exec();
    if (!urlEntry) {
        return null;
    }

    return urlEntry;
}
async function getLongUrl(shortUrl) {
    const urlEntry = await Url.findOne({ shortUrl }).exec();
    if (!urlEntry) {
        return null;
    }
    return urlEntry.sourceUrl;
}

async function deleteExpiredUrls() {
    try {
        const now = new Date();
        const result = await Url.deleteMany({ expirationDate: { $lt: now } });
        console.log(`Deleted ${result.deletedCount} expired URLs.`);
    } catch (error) {
        console.error('Error deleting expired URLs:', error);
    }
}

module.exports = {
    parseUrl,
    saveUrl,
    generateUniqueId,
    getLongUrl,
    getUrlInfo,
    deleteExpiredUrls
};