const should = require('chai').should();
const cryptowatchDataScript = require('./getCryptowatchData');

describe('getExchangeAssets function', () => {

    let exchangeAssets = [];
    const assetDetails = {
        "result": {
            "id": 22,
            "symbol": "bch",
            "name": "Bitcoin Cash",
            "fiat": false,
            "markets": {
                "base": [
                    {
                        "id": 396,
                        "exchange": "bittrex",
                        "pair": "bchbtc",
                        "active": true,
                        "route": "https://api.cryptowat.ch/markets/bittrex/bchbtc"
                    },
                    {
                        "id": 397,
                        "exchange": "bittrex",
                        "pair": "bcheth",
                        "active": true,
                        "route": "https://api.cryptowat.ch/markets/bittrex/bcheth"
                    },
                    {
                        "id": 398,
                        "exchange": "coinone",
                        "pair": "bchbtc",
                        "active": true,
                        "route": "https://api.cryptowat.ch/markets/bittrex/bchbtc"
                    },
                    {
                        "id": 399,
                        "exchange": "bittrex",
                        "pair": "bchusd",
                        "active": false,
                        "route": "https://api.cryptowat.ch/markets/bittrex/bchusd"
                    },
                    {
                        "id": 400,
                        "exchange": "bittrex",
                        "pair": "bchdai",
                        "active": true,
                        "route": "https://api.cryptowat.ch/markets/bittrex/bchdai"
                    },
                ],
                "quote": [
                    {
                        "id": 645,
                        "exchange": "bittrex",
                        "pair": "ethbch",
                        "active": false,
                        "route": "https://api.cryptowat.ch/markets/wex/ethbch"
                    }
                ]
            }
        },
        "allowance": {
            "cost": 410718,
            "remaining": 3991837587,
            "upgrade": "For unlimited API access, create an account at https://cryptowat.ch"
        }
    }

    before(() => {
        exchangeAssets = exchangeAssets.concat(cryptowatchDataScript.getExchangeAssets(assetDetails, 'bittrex'));
    });

    it('returns array with all requested exchange asset pairs and only those', () => {
        exchangeAssets.length.should.equal(3);
        exchangeAssets[0].pair.should.equal('bchbtc');
        exchangeAssets[1].pair.should.equal('bcheth');
        exchangeAssets[2].pair.should.equal('bchdai');
    });

    it('returns array with active asset pairs only', () => {
        //when
        const pairStates = exchangeAssets.map(x => { return x.active === true });
        //then
        pairStates.length.should.equal(3);
    });

    it('returns array with asset as a pair base only', () => {
        //when
        const pairBases = exchangeAssets.map(x => { return x.pair.slice(0,3) });
        //then
        pairBases[0].should.equal('bch');
        pairBases[1].should.equal('bch');
        pairBases[2].should.equal('bch');
    });

});
