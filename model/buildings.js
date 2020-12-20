/* Типы башен */
const BuildingType = {
  1: 'Tower',  // обычная башня
  2: 'Forge',  // кузница
};

class Building {
  /* Состояние башен. Передается в игровом стейте */
  constructor(building, parameters) {
    this.id = building.Id; // идентификатор башни
    this.type = BuildingType[building.Type]; // тип башни 1 - башня, 2 - кузница
    this.creeps_count = building.CreepsCount;  // текущее количество крипов
    this.player_color = building.PlayerColor;  // принадлежность игроку
    this.creep_creation_time = building.CreepCreationTime;  // сколько тиков создается крип
    this.buff_mask = building.BuffMask;  // побитовая маска i-й бит growl-1, plague-2, exchange-3, invision-4
    this.DefenseBonus = building.DefenseBonus; /* текущая защита */

    // уровень от 0 до 3 определяет текущие значения башни, нужно их подтягивать откуда-то и как-то - из параметров
    this.level = parameters.get_tower_level(building.Level); // текущий уровень башни
  }
  add_defence = (defence_bonus) => {
    this.DefenseBonus += defence_bonus;
  }
};

class TowerLevelParameters {
  /*
  Класс предоставляющий праматеры башен по уровням, которые передаются в игровых параметрах при
  инициализации игры
  */
  constructor(id, params) {
    // номер уровня
    this.id = id;
    // цена перехода
    this.update_coast = params.UpdateCoast;
    // бонус защиты в абсолютном значении + 1
    this.defense_bonus = params.DefenseBonus;
    // время в тиках за котрое создается 1 крип
    this.creep_creation_time = params.CreepCreationTime;
    // начальное дефолтное занчение количества крипов для игрока
    this.default_player_count = params.DefaultPlayerCount;
    // начальное дефолтное занчение количества крипов для нейтрального
    this.default_neutral_count = params.DefaultNeutralCount;
    // максимальное количество крипов для игрока после которого останавливается рост
    this.player_max_count = params.PlayerMaxCount;
    // максимальное количество крипов для нейтрального игрока после которого останавливается рост
    this.neutral_max_count = params.NeutralMaxCount;
  }
};

class ForgeParameters {
  /*
  Класс предоставляющий праматеры кузницы, которые передаются в игровых параметрах при
  инициализации игры
  */
  constructor(params) {
    // дает бонус к защите башен
    this.defence_bonus = params.DefenseBonus;
    // начальное дефолтное занчение количества крипов для игрока
    this.default_player_count = params.DefaultPlayerCount;
    // начальное дефолтное занчение количества крипов для нейтрального
    this.default_neutral_count = params.DefaultNeutralCount;
    // максимальное количество крипов для игрока после которого останавливается рост
    this.player_max_count = params.PlayerMaxCount;
    // максимальное количество крипов для нейтрального игрока после которого останавливается рост
    this.neutral_max_count = params.NeutralMaxCount;
  }
};

module.exports.BuildingType = BuildingType;
module.exports.Building = Building;
module.exports.ForgeParameters = ForgeParameters;
module.exports.TowerLevelParameters = TowerLevelParameters;
