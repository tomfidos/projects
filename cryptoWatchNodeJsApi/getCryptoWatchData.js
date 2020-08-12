const fetch = require('node-fetch');
const moment = require('moment');
const fs = require('fs');

async function getData(asset, exchange, interval, fromDate, toDate) {
    const assetDetails = await getAssetsDetails(asset);
    const exchangeAssets = getExchangeAssets(assetDetails, exchange);
    const exchangeAssetsOhlc = await getExchangeAssetsOhlc(exchangeAssets, exchange, interval, fromDate, toDate);
    printExchangeAssetsOhlc(exchangeAssetsDataOhlc, fromDate, toDate, asset, exchange, interval);
}

async function getAssetsDetails(asset) {
    const response = await fetch('https://api.cryptowat.ch/assets/' + asset);
    return await response.json();
}

function getExchangeAssets(assetDetails, exchange) {
    return assetsDetails.result.markets.base.filter(x => {
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
                return !timestamp.isBefore(fromDate) && timestamp.isBefore(toDate)
            })
            .map(z => {
                return {
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

async function printExchangeAssetsOhlc(exchangeAssetsOhlc, fromDate, toDate, asset, exchange, interval) {
    const pathName =
	'out/' + fromDate.utc.format('YYYY-MM-DDTHH:mm:ss') + toDate.utc.format('YYYY-MM-DDTHH:mm:ss') + '_' +
	asset + '_' + exchange + '_' + interval + '.csv';
    fs.writeFileSync(
        pathName, 
        'closeDateTime' + ',' +
	    'openPrice' + ',' +
	    'highPrice' + ',' +
	    'lowPrice' + ',' +
        'closePrice' + ',' +
        'volumeInBtc' + '\n'
    );
    for (let i in exchangeAssetsOhlc) {
        const pairResult = await exchangeAssetsOhlc[i];
        pairResult.forEach(async x => {
            const result = await x;
            fs.appendFileSync(
                pathName,
                result.closeTime + ',' +
		        result.openPrice + ',' +
		        result.highPrice + ',' +
		        result.lowPrice + ',' +
                result.closePrice + ',' +
                result.volume + '\n'
            );
        });
    }
}
