class Way {
  // Путь отряда
  constructor(total, traveled) {
    this.total = total; // какой путь нужно пройти
    this.traveled = traveled;  // сколько уже прошел
    this.left = total - traveled;  // сколько осталось
  }
}

class Squad {
  // Состояние отрядов. Передается в игровом стейте
  constructor(squad) {
    this.id = squad.Id;  // идентификатор отряда
    this.from_id = squad.FromId;  // откуда вышел
    this.to_id = squad.ToId;  // куда идет
    this.player_color = squad.PlayerColor;  // кому принадлежит
    this.creeps_count = squad.CreepsCount;  // сколько крипов в отряде
    this.speed = squad.Speed;  // скорость передвижения
    this.way = new Way(squad.Way.Total, squad.Way.Traveled);  // путь отряда
    this.buff = squad.BuffMask;  // побитовая маска - каждый байт - крип, в каждом байте бит соответствует бафу
    // - берсерк 0, чума 1, убийство червяком -2
  }
}

class CreepParameters {
  // Класс предоставляющий праматеры крипов по умолчанию, которые передаются в игровых параметрах при инициализации игры
  constructor(params) {
    //скорость в единицах расстояния карты
    this.speed = params.Speed;
    // время между шеренгами в тиках
    this.wave_delay = params.WaveDelay;
    // максимальное количество крипов в шеренге
    this.max_wave_creeps_count = params.MaxWaveCreepsCount;
    // интервал между крипами в шеренге
    this.creep_in_wave_distance = params.CreepInWaveDistance;
  }
}

module.exports.Squad = Squad;
module.exports.CreepParameters = CreepParameters;
