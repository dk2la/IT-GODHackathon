const Game = require('./model/game');
const { ArgumentParser } = require('argparse');

const IP = 'wss://gameapi.it-god.ru';
const USERID = 'af1696c8-b85f-4311-a83f-54de0408db04';
const BOTID = 'd6f42bc6-0b55-490c-9c28-f68875595daa';

if (typeof require !== 'undefined' && require.main === module) {
    const parser = new ArgumentParser({
        description: 'Runner for ITGod'
    });

    parser.add_argument('-i', '--ip', {
        type: 'str',
        nargs: '?',
        help: 'Server IP',
        default: IP
    });

    parser.add_argument('-b', '--bot', {
        type: 'str',
        nargs: '?',
        help: 'Bot Id',
        default: BOTID
    });

    parser.add_argument('-u', '--user', {
        type: 'str',
        nargs: '?',
        help: 'User Id',
        default: USERID
    });

    parser.add_argument('-g', '--game', {
        type: 'str',
        nargs: '?',
        help: 'Game Id'
    });

    parser.add_argument('-s', '--system', {
        action: 'store_true',
        help: 'Service argument'
    });

    const args = parser.parse_args();
    const wsUrl = `${args.ip}/game`;

    let userId, gameId;
    if (args.system) {
        userId = null;
        gameId = args.game;
    } else {
        userId = args.user;
        gameId = null;
    }
    new Game(wsUrl, userId, args.bot, gameId);
}
