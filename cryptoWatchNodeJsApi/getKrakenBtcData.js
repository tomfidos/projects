const fetch = require('node-fetch');
const moment = require('moment');
const fs = require('fs');

async function getKrakenBtcData() {
    const assetsDetails = await getAssetsDetails();
    const krakenAssets = getKrakenAssets(assetsDetails);
    const krakenAssetsData = await getKrakenAssetsData(krakenAssets);
    printKrakenAssetsData(krakenAssetsData);
}

async function getAssetsDetails() {
    const response = await fetch('https://api.cryptowat.ch/assets/btc');
    return await response.json();
}

function getKrakenAssets(assetsDetails) {
    return assetsDetails.result.markets.base.filter(x => {
        if (x.exchange === 'kraken' && x.active) {
            return x;
        }
    });
}

async function getKrakenAssetsData(krakenAssets) {
    return krakenAssets.map(async x => {
        const response = await fetch('https://api.cryptowat.ch/markets/kraken/' + x.pair + '/ohlc');
        const content = await response.json();
        return content.result['86400']
            .filter(y => {
                const day = moment.utc((y[0].toString() + '000') * 1);
                return day.isAfter(moment.utc('2020-01-01')) && day.isBefore('2020-02-02')
            })
            .map(z => {
                return {
                    Pair: x.pair,
                    CloseTime: moment.utc((z[0].toString() + '000') * 1).format('YYYY-MM-DD HH:mm'),
                    ClosePrice: z[4],
                    Volume: z[5],
                }
            });
    });
}

async function printKrakenAssetsData(krakenAssetsData) {
    const pathName = 'assessment/out/btc_fiat_daily_mkt_jan2020.csv';
    fs.writeFileSync(
        pathName,
        'pair' + ',' +
        'closeDateTime' + ',' +
        'closePrice' + ',' +
        'volumeInBtc' + '\n'
    );
    for (let i in krakenAssetsData) {
        const pairResult = await krakenAssetsData[i];
        pairResult.forEach(async x => {
            const result = await x;
            fs.appendFileSync(
                pathName,
                result.Pair + ',' +
                result.CloseTime + ',' +
                result.ClosePrice + ',' +
                result.Volume + '\n'
            );
        });
    }
}

getKrakenBtcData();