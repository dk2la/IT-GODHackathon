const { gzip, ungzip } = require('node-gzip');
const { Base64 } = require('js-base64');

class ParentsMessage {
  json = {};
  send_message = async (json = this.json) => {
    json = JSON.stringify(json);
    this.json = Buffer.from(json, 'utf8');
    const compressed = await gzip(this.json);
    return compressed.toString('base64');
  }
  to_string = () => {
    return (JSON.stringify(this.json));
  }
}

class Message extends ParentsMessage {
  json = {};

  constructor(strBase64) {
    super();
    this.strBase64 = strBase64;
    return (async () => {
      let utfstr = this.strBase64.toString();
      let decodeBase64 = Base64.atob(utfstr);

      let rawLength = decodeBase64.length;
      let array = new Uint8Array(new ArrayBuffer(rawLength));
      for (let i = 0; i < rawLength; i++) {
        array[i] = decodeBase64.charCodeAt(i);
      }
      let async_result = await ungzip(array);
      this.json = JSON.parse(async_result)
      if (this.json.ResponseGameParametersArgs && this.json.ResponseGameParametersArgs.Map)
        this.json.ResponseGameParametersArgs.Map = JSON.parse(this.json.ResponseGameParametersArgs.Map);
      if (this.json.ResponseGameParametersArgs && this.json.ResponseGameParametersArgs.Parameters)
        this.json.ResponseGameParametersArgs.Parameters = JSON.parse(this.json.ResponseGameParametersArgs.Parameters);
      this.msg_type = this.json.MsgType;
      if (this.json.GameId)
        this.game_id = this.json.GameId;
      else
        this.game_id = 0;
      this.value = await ungzip(array);
      return this;
    })();
  }
}

class RequestGame extends ParentsMessage {
  json = {
    "MsgType": 17,
    "RequestGameParametersArgs": {
      "BotId": "",
    },
  };

  constructor(user_id, bot_id, game_id) {
    super();
    if (user_id)
      this.json.RequestGameParametersArgs.UserId = user_id;
    if (bot_id)
      this.json.RequestGameParametersArgs.BotId = bot_id;
    if (game_id)
      this.json.RequestGameParametersArgs.GameId = game_id;
  }
}

class PlayerConnect extends ParentsMessage {
  json = {
    "MsgType": 8,
    "GameId": "",
    "Subscribers": [],
    "PlayerConnectArgs": {
      "PlayerId": "",
    },
  };

  constructor(game_server, game_id, bot_id) {
    super();
    this.json.Subscribers = [...this.json.Subscribers, game_server];
    this.json.GameId = game_id;
    this.json.PlayerConnectArgs.PlayerId = bot_id;
  }
}

class PlayerChangeHero extends ParentsMessage {
  json = {
    "MsgType": 22,
    "GameId": "",
    "Subscribers": [],
    "PlayerChangeHeroTypeArgs": {
      "PlayerId": "",
      "HeroType": 0,
    },
  };

  constructor(game_server, game_id, bot_id, hero_type) {
    super();
    this.json.Subscribers = [...this.json.Subscribers, game_server];
    this.json.GameId = game_id;
    this.json.PlayerChangeHeroTypeArgs.PlayerId = bot_id;
    this.json.PlayerChangeHeroTypeArgs.HeroType = hero_type;
  }
}

class PlayerChangeColor extends ParentsMessage {
  json = {
    "MsgType": 23,
    "GameId": "",
    "Subscribers": [],
    "PlayerChangeColorArgs": {
      "PlayerId": "",
      "PlayerColor": 2,
    },
  };

  constructor(game_server, game_id, bot_id, player_color) {
    super();
    this.json.Subscribers = [...this.json.Subscribers, game_server];
    this.json.GameId = game_id;
    this.json.PlayerChangeColorArgs.PlayerId = bot_id;
    this.json.PlayerChangeColorArgs.PlayerColor = player_color;
  }
}

class PlayerPrepared extends ParentsMessage {
  json = {
    "MsgType": 11,
    "GameId": "",
    "Subscribers": [],
    "PlayerPreparedArgs": {
      "PlayerId": "",
    },
  };

  constructor(game_server, game_id, bot_id) {
    super();
    this.json.Subscribers = [...this.json.Subscribers, game_server];
    this.json.GameId = game_id;
    this.json.PlayerPreparedArgs.PlayerId = bot_id;
  }
}

class PlayerReady extends ParentsMessage {
  json = {
    "MsgType": 13,
    "GameId": "",
    "Subscribers": [],
    "PlayerReadyArgs": {
      "PlayerId": "",
    },
  };

  constructor(game_server, game_id, bot_id) {
    super();
    this.json.Subscribers = [...this.json.Subscribers, game_server];
    this.json.GameId = game_id;
    this.json.PlayerReadyArgs.PlayerId = bot_id;
  }
}

class GameActions extends ParentsMessage {
  json = {
    "MsgType": 3,
    "GameId": "",
    "Subscribers": [],
    "GameActionsArgs": {
      "Action": {},
    },
  };

  constructor(game_server, game_id, action) {
    super();
    this.json.Subscribers = [...this.json.Subscribers, game_server];
    this.json.GameId = game_id;
    this.json.GameActionsArgs.Action = action;
  }
}

module.exports.Message = Message;
module.exports.PlayerChangeHero = PlayerChangeHero;
module.exports.PlayerChangeColor = PlayerChangeColor;
module.exports.GameActions = GameActions;
module.exports.PlayerPrepared = PlayerPrepared;
module.exports.PlayerReady = PlayerReady;
module.exports.RequestGame = RequestGame;
module.exports.PlayerConnect = PlayerConnect;
