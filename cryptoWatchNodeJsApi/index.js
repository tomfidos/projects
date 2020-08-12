const commander = require('commander');
const cryptowatchDataScript = require('./getCryptoWatchData');

commander
    .option('-a, --asset <asset>', 'Cryptocurrency to get data for')
    .option('-e, --exchange <exchange>', 'Exchange to get data for')
    .option('-i, --interval <interval>', 'Data interval')
    .option('-f, --fromDate <fromDate>', 'Reported period start, YYYY-MM-DDTHH:mm:ssZ')
    .option('-t, --toDate <toDate>', 'Reported period end, YYYY-MM-DDTHH:mm:ssZ')
    .action(cmd => cryptowatchDataScript.getCryptoWatchData(cmd.asset, cmd.exchange, cmd.interval, cmd.fromDate, cmd.toDate))
    .parse(process.argv)
