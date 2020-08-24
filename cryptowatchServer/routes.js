const express = require('express');
const router = express.Router();
const moment = require('moment');
const { Parser } = require('json2csv');
const cryptowatchDataScript = require('./getCryptowatchData');

router.get('/', async (req, res, next) => {
    const queryParameters = req.query;
    const cryptowatchData =
        await cryptowatchDataScript.getData(
            queryParameters.asset, 
            queryParameters.exchange, 
            queryParameters.interval, 
            moment(queryParameters.start), 
            moment(queryParameters.end)
        );
    const dataForEachPair = await Promise.all(cryptowatchData.map(async x => {return await x}));
    const fields = ['pair', 'closeTime', 'openPrice', 'highPrice', 'lowPrice', 'closePrice', 'volume'];
    const json2csv = new Parser({fields});
    const dataForCsv = json2csv.parse(JSON.parse(JSON.stringify(dataForEachPair.flat())));
    res.attachment('cryptowatchData.csv');
    res.set({'Content-Disposition': 'attachment; filename=cryptowatchData.csv', 'Content-Type': 'text/csv'});
    res.status(200).send(dataForCsv);
});

module.exports = router;
