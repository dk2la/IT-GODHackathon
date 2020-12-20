const { AbilityType } = require('./abilites');

const HeroType = {
  /* Типы героев */
  Nobody: 0,         // Не определен
  Warrior: 1,        // Воин
  BlackSmith: 2,     // Рунный кузнец
  Mag: 3,            // Маг
};

class Hero {
  /* Общий класс для всех героев. Содержит общий набор возможностей */
  hero_type = HeroType.Nobody;
  player_color = 0;

  constructor(game_parameters) {
    if (game_parameters.HeroType !== this.hero_type)
      new Error('Hero type in game parameters init hero type');
    this.player_color = game_parameters.PlayerColor;
  }

  /*
  Извлекает из параметров игры основные характеристики героя
  team_id - идентификатор команды для командной игры
  player_color - цвет команды игрока
  */

  // Проверка соответствия типа героя
  move = (source_tower_id, target_tower_id, part) => {
    /*
    Передвижение войск
    source_tower_id - идентификатор исходной башни
    target_tower_id - идентификатор целевой башни
    part - направляемая часть войск [0,1]
    */
    const action = {
      "FromId": source_tower_id,
      "ToId": target_tower_id,
      "Part": part,
      "PlayerColor": this.player_color,
      "Type": 1,
    };
    return JSON.stringify(action);
  };

  speed_up = (location) => {
    /* Ускорение союзных войск
    location - координата точки применения */
    const action = {
      "X": location.x,
      "Y": location.y,
      "FirstTowerId": 0,
      "SecondTowerId": 0,
      "AbilityId": AbilityType.indexOf('Speed_up'),
      "PlayerColor": this.player_color,
      "Type": 2,
    };
    return JSON.stringify(action);
  };

  upgrade_tower = (tower_id) => {
    /*
    Увеличивает уровень своей башни
    tower_id - идентификатор целевой башни
    */
    const action = {
      "TowerId": tower_id,
      "PlayerColor": this.player_color,
      "Type": 4,
    };
    return JSON.stringify(action);
  }
}

class Mag extends Hero {
  /* Возможности героя Маг */
  hero_type = HeroType.Mag;

  plague = (enemy_tower_id) => {
    /*
    Чума. Применяется на башню противника и убивает в нем войска
    enemy_tower_id - идентификатор целевой башни противника
    */
    const action = {
      "X": 0,
      "Y": 0,
      "FirstTowerId": enemy_tower_id,
      "SecondTowerId": 0,
      "AbilityId": AbilityType.indexOf('Plague'),
      "PlayerColor": this.player_color,
      "Type": 2,
    };
    return JSON.stringify(action);
  };

  exchange = (enemy_tower_id, my_tower_id) => {
    /*
    Обмен. Меняет башни местами и усредняет количество войск
    enemy_tower_id - идентификатор целевой башни противника
    my_tower_id - идентификатор вашей башни
    */
    const action = {
      "X": 0,
      "Y": 0,
      "FirstTowerId": enemy_tower_id,
      "SecondTowerId": my_tower_id,
      "AbilityId": AbilityType.indexOf('Build_exchange'),
      "PlayerColor": this.player_color,
      "Type": 2,
    };
    return JSON.stringify(action);
  }
}

class Warrior extends Hero {
  /* Возможности героя Воин */
  hero_type = HeroType.Warrior;

  berserk = (location) => {
    /*
    Берсерк. Усиливает движущиеся войска в заданной области
    location - координаты x, y
    */
    const action = {
      "X": location.x,
      "Y": location.y,
      "FirstTowerId": 0,
      "SecondTowerId": 0,
      "AbilityId": AbilityType.indexOf('Berserk'),
      "PlayerColor": this.player_color,
      "Type": 2,
    };
    return JSON.stringify(action);
  };

  growl = (enemy_tower_id) => {
    /*
    Рык. Распугивает соперника в башне. При применении войска соперника разбегаются по другим своим башням. Если других башен нет, останутся сидеть в этой башне
    enemy_tower_id - идентификатор целевой башни противника
    */
    const action = {
      "X": 0,
      "Y": 0,
      "FirstTowerId": enemy_tower_id,
      "SecondTowerId": 0,
      "AbilityId": AbilityType.indexOf('Growl'),
      "PlayerColor": this.player_color,
      "Type": 2,
    };
    return JSON.stringify(action);
  }
}

class BlackSmith extends Hero {
  /* Возможности героя Кузнец */
  hero_type = HeroType.BlackSmith;

  area_damage = (location) => {
    /*
    Урон по площади. Не действует на берсерков. Начинает дейстовать через секунду.
    location - координаты x, y
    */
    const action = {
      "X": location.x,
      "Y": location.y,
      "FirstTowerId": 0,
      "SecondTowerId": 0,
      "AbilityId": AbilityType.indexOf('Area_damage'),
      "PlayerColor": this.player_color,
      "Type": 2,
    };
    return JSON.stringify(action);
  };

  armor = (my_tower_id) => {
    /*
    Защита своей башни (или союзника)
    my_tower_id - идентификатор целевой башни
    */
    const action = {
      "X": 0,
      "Y": 0,
      "FirstTowerId": my_tower_id,
      "SecondTowerId": 0,
      "AbilityId": AbilityType.indexOf('Armor'),
      "PlayerColor": this.player_color,
      "Type": 2,
    };
    return JSON.stringify(action);
  }
};

module.exports.HeroType = HeroType;
module.exports.Hero = Hero;
module.exports.Warrior = Warrior;
module.exports.Mag = Mag;
module.exports.BlackSmith = BlackSmith;
