const fetch = require('node-fetch');
const moment = require('moment');

async function getData(asset, exchange, interval, fromDate, toDate) {
    const assetDetails = await getAssetsDetails(asset);
    const exchangeAssets = getExchangeAssets(assetDetails, exchange);
    return await getExchangeAssetsOhlc(exchangeAssets, exchange, interval, fromDate, toDate);
}

async function getAssetsDetails(asset) {
    const response = await fetch('https://api.cryptowat.ch/assets/' + asset);
    return await response.json();
}

function getExchangeAssets(assetDetails, exchange) {
    return assetDetails.result.markets.base.filter(x => {
        if (x.exchange === exchange && x.active) {
            return x;
        }
    });
}

async function getExchangeAssetsOhlc(exchangeAssets, exchange, interval, fromDate, toDate) {
    return exchangeAssets.map(async x => {
        const response = await fetch('https://api.cryptowat.ch/markets/' + exchange + '/' + x.pair + '/ohlc');
        const content = await response.json();
        return content.result[interval]
            .filter(y => {
                const timestamp = moment.utc((y[0].toString() + '000') * 1);
                return !timestamp.isBefore(fromDate) && !timestamp.isAfter(toDate)
            })
            .map(z => {
                return {
                    pair: x.pair,
                    closeTime: moment.utc((z[0].toString() + '000') * 1).format('YYYY-MM-DDTHH:mm:ss'),
		            openPrice: z[1],
		            highPrice: z[2],
		            lowPrice: z[3],
                    closePrice: z[4],
                    volume: z[5],
                }
            });
    });
}

exports.getData = getData;
