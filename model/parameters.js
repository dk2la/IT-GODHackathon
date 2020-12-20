const { AbilityParameters, GameEventParameters } = require('./abilites');
const { TowerLevelParameters, ForgeParameters } = require('./buildings');
const { CreepParameters } = require('./squads');

class Parameters {
    // Класс, предоставляющий доступ к параметрам игры
    constructor(game) {
        let parameters = game;
        parameters = parameters.ResponseGameParametersArgs.Parameters;
        // максимальная продолжительность игры в тиках
        this.duration = parameters.Duration;
        // защита башен по умолчанию
        this.default_defence_parameters = parameters.DefaultDefenseParameter;
        // уровни башен
        this.tower_levels = [];
        for (let tower in parameters.Towers) {
            this.tower_levels = [...this.tower_levels, new TowerLevelParameters(+tower,
                parameters.Towers[tower])];
        }
        // параметры кузницы
        this.forge = new ForgeParameters(parameters.Forges);
        // параметры крипов
        this.creep = new CreepParameters(parameters.Creeps);
        // параметры абилок
        this.abilities = [];
        parameters.AbilitiesParameters.abilities.forEach((ability) => {
            // параметры глобальных игровых событий
            this.abilities = [...this.abilities, new AbilityParameters(ability)];
        });
        this.game_events = [];
        parameters.GameEventsParameters.forEach((game_event) =>
            this.game_events = [...this.game_events, new GameEventParameters(game_event)]
        )
    }

    get_tower_level = (level) => {
        // Возвращает параметры уровня башни level
        let res = null;
        this.tower_levels.forEach((tower_level) => {
            if (tower_level.id === level)
                res = tower_level;
        });
        return res;
    };

    get_ability_parameters = (Ability) => {
        // Возвращает параметры уровня башни level
        let res = null;
        this.abilities.forEach((item) => {
            if (item.ability === Ability)
                res = item;
        });
        return res;
    }
}

module.exports.Parameters = Parameters;
