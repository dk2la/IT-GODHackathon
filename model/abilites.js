const AbilityType = [
  // Типы абилок применяемых в игре
  'Speed_up',            // ускорение
  'Vision',              // видеть количество войск в башнях (для игроков)
  'Berserk',             // усиление войск (Warrior)
  'Growl',               // крик (Warrior)
  'Area_damage',         // урон по площади (BlackSmith)
  'Plague',              // чума (Mag)
  'Build_exchange',      // обмен башен с усреднением (Mag)
  'Armor',               // защита башни (BlackSmith)
  'Tremors',             // червь (общая)
  'Fair_wind',           // усорение всех войск (общая)
];

const AbilityInputType = [
  // Способы применения абилок
  'CommonAbility',       // общая абилка
  'AreaAbility',         //площадная абилка
  'OneTowerAbility',     // применяется к одной башне
  'TwoTowerAbility',     // применяется к двум башням
];

class Ability {
  constructor(Ability) {
    this.ability = AbilityType[Ability.Ability]; // тип абилки
    if (Ability.TargetTowerId)
      this.target_tower_id = Ability.TargetTowerId; // башня к которой применена (для input type 2)
    if (Ability.FirstTargetTowerId)
      this.first_target_tower_id = Ability.FirstTargetTowerId;  // башня к которой применена (для input type 3)
    if (Ability.SecondTargetTowerId)
      this.second_target_tower_id = Ability.SecondTargetTowerId; // башня к которой применена (для input type 3)
    if (Ability.X)
      this.x = Ability.X; // координаты (для абилок с input type 1)
    if (Ability.Y)
      this.y = Ability.Y;  // координаты (для абилок с type 1)
    this.ability_input_type = AbilityInputType[Ability.AbilityInputType];  // способ применения
    this.player_color = Ability.OwnerColor;  // кто применил
    this.initial_tick = Ability.InitialTick;  // в какой тик создана
    this.start_tick = Ability.StartTick;  // когда начала действовать
    this.end_tick = Ability.EndTick;  // когда закончит действовать
  }
}

class AbilityParameters {
  /* Класс, предоставляющий праматеры абилок по умолчанию, которые передаются в игровых параметрах при
  инициализации игры */

  constructor(params) {
    // тип абилки
    this.ability = AbilityType[params.Id];
    // тип действия 0 - общие, 1 - площадные, 2 - на 1 башню, 3 - на 2 башни
    this.input_type = AbilityInputType[params.InputType];
    // сколько длится в тиках
    this.duration = params.Duration;
    // через сколько будет доступна снова
    this.cooldown = params.Cooldown;
    // время для иницилизации обилки
    this.cast_time = params.CastTime;
    // для площадных не равен нулю
    this.radius = params.Radius;
    // кастомные параметры абилки
    this.ability_data = params.AbilityData;
  }
}

class GameEventParameters {
  /* Класс, предоставляющий праматеры глобальных событий игры,
  которые передаются в игровых параметрах при инициализации игры */

  constructor(params) {
    // с какого тика начинается
    this.StartTick = params.StartTick;
    // через сколько повторяется
    this.LoopInterval = params.LoopInterval;
    // повторяется или нет
    this.LoopMode = params.LoopMode;
    // 0 - на игрока, 1 - на всех
    this.UseMode = params.UseMode;
    // тип абилки
    this.Ability = AbilityType[params.Ability];
    // начальный цвет цели
    this.TargetColor = params.TargetColor;
  }
}

module.exports.AbilityType = AbilityType;
module.exports.AbilityInputType = AbilityInputType;
module.exports.Ability = Ability;
module.exports.AbilityParameters = AbilityParameters;
module.exports.GameEventParameters = GameEventParameters;
