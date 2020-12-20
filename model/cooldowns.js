const { AbilityType } = require('./abilites');

class Cooldown {
  /* Фриз на применение абилок */
  constructor(cooldown) {
    this.ability = AbilityType[cooldown.Ability];  // тип абилки
    this.player_color = cooldown.PlayerColor;  // кто применил
    this.ticks_to_cooldown_end = cooldown.TicksToCooldownEnd; // сколько тиков осталось до повторного применения
  }
}

module.exports.Cooldown = Cooldown;
