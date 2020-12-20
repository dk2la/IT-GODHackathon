const { HeroType } = require('./model/hero');
const { AbilityType } = require('./model/abilites');
const { State } = require('./model/state');
const { Map } = require('./model/map');
const { Parameters } = require('./model/parameters');
const { Teams } = require('./model/teams');

let game_map = null;
let game_params = null;
let game_teams = null;
let count0 = 0;
let count1 = 0;
let count2 = 0;
let count3 = 0;
let count_f = 0;
let count_s = 0;
let count_t = 0;
let lastAttack = 0;

const Bot = (game, game_teams, game_params, game_map) => {
  try {
    /* Получение состояния игры */
    if (game && game_teams && game_params) {
      const state = new State(game, game_teams, game_params);
      const my_buildings = state.my_buildings();
      const my_squads = state.my_squads();

      // сортируем по остаточному пути
      my_squads.sort((a, b) => {
        if (a.way.left > b.way.left) {
          return 1;
        }
        if (a.way.left < b.way.left) {
          return -1;
        }
        return 0;
      });

      const enemy_buildings = state.enemy_buildings();
      const enemy_squads = state.enemy_squads();
      const neutral_buildings = state.neutral_buildings();
      const forges_buildings = state.forges_buildings();

      /* Играем за мага */
      if (game_teams.my_her.hero_type === HeroType.Mag) {
        // проверяем доступность абилки Обмен башнями
        if (state.ability_ready(AbilityType[6])) {
          // если враг применил абилку обмен башнями
          const build_exchange = state.enemy_active_abilities(AbilityType[6]);
          if (build_exchange.length > 0
            || (my_buildings[0] && my_buildings[0].creeps_count < 10))
            process.send(game_teams.my_her.exchange(enemy_buildings[0].id, my_buildings[0].id));
        }
        // проверяем доступность абилки Чума
        if (state.ability_ready(AbilityType[5])) {
          // для эффективности применяем ближе к башне
          if (my_squads.length > 1) {
            // сколько тиков первому отряду осталось до башни
            const left_to_aim = my_squads[0].way.left / my_squads[0].speed;
            // если первый отряд находится в зоне инициализации абилки
            const plague_parameters = game_params.get_ability_parameters(AbilityType[5]);
            if (plague_parameters.cast_time + 30 > left_to_aim
              && enemy_buildings[0] && enemy_buildings[0].id)
              process.send(game_teams.my_her.plague(enemy_buildings[0].id));
          }
        }
        // атакуем башню противника
        my_buildings.forEach((my_building) => {
          if (my_building.creeps_count > my_building.level.player_max_count)
            process.send(game_teams.my_her.move(my_building.id, enemy_buildings[0].id, 1));
        })
      }

      /* Играем за рунного кузнеца */
      if (game_teams.my_her.hero_type === HeroType.BlackSmith) {
        // Проверяем доступность абилки Щит
        if (state.ability_ready(AbilityType[7]))
          process.send(game_teams.my_her.armor(my_buildings[0].id));

        // Проверяем доступность абилки Разрушение
        if (enemy_squads.length > 4)
          if (state.ability_ready(AbilityType[4])) {
            location = game_map.get_squad_center_position(enemy_squads[2]);
            process.send(game_teams.my_her.area_damage(location));
          }
        // Upgrade башни
        if (my_buildings[0].level.id < game_params.tower_levels.length - 1) {
          // Если хватает стоимости на upgrade
          const update_coast = game_params.get_tower_level(my_buildings[0].level.id + 1).update_coast;
          if (update_coast < my_buildings[0].creeps_count) {
            process.send(game_teams.my_her.upgrade_tower(my_buildings[0].id));
            my_buildings[0].creeps_count -= update_coast;
          }
        }
        // Атакуем башню противника
        // определяем расстояние между башнями
        const distance = game_map.towers_distance(my_buildings[0].id, enemy_buildings[0].id);
        // определяем сколько тиков идти до нее со стандартной скоростью
        const ticks = distance / game_params.creep.speed;
        // определяем прирост башни в соответствии с ее уровнем
        let enemy_creeps = 0;
        if (enemy_buildings[0].creeps_count >= enemy_buildings[0].level.player_max_count)
          // если текущее количество крипов больше чем положено по уровню
          enemy_creeps = enemy_buildings[0].creeps_count;
        else {
          // если меньше - будет прирост
          const grow_creeps = ticks / enemy_buildings[0].level.creep_creation_time;
          enemy_creeps = enemy_buildings[0].creeps_count + grow_creeps;
          if (enemy_creeps >= enemy_buildings[0].level.player_max_count)
            enemy_creeps = enemy_buildings[0].level.player_max_count;
        }
        // определяем количество крипов с учетом бонуса защиты
        const enemy_defence = enemy_creeps * (1 + enemy_buildings[0].DefenseBonus);
        // если получается в моей башне крипов больше + 10 на червя - идем на врага всей толпой
        if (enemy_defence + 10 < my_buildings[0].creeps_count)
          process.send(game_teams.my_her.move(my_buildings[0].id, enemy_buildings[0].id, 1));
      }

      /* Играем за воина */
      if (game_teams.my_her.hero_type === HeroType.Warrior) {
        let kek = game_map.get_nearest_towers(my_buildings[0].id, neutral_buildings);
        count0 = kek[0].creeps_count + (game_map.towers_distance(my_buildings[0].id, kek[0].id) / game_params.creep.speed) / kek[0].creep_creation_time ;
        process.send(game_teams.my_her.move(my_buildings[0].id, kek[0].id, 0.66));
        count1 = kek[1].creeps_count + (game_map.towers_distance(my_buildings[0].id, kek[1].id) / game_params.creep.speed) / kek[1].creep_creation_time ;
        process.send(game_teams.my_her.move(my_buildings[0].id, kek[1].id, 0.9));
        count2 = kek[2].creeps_count + (game_map.towers_distance(my_buildings[0].id, kek[2].id) / game_params.creep.speed) / kek[2].creep_creation_time;
        process.send(game_teams.my_her.move(my_buildings[0].id, kek[2].id, 1));
        count3 = kek[3].creeps_count + (game_map.towers_distance(my_buildings[0].id, kek[3].id) / game_params.creep.speed) / kek[3].creep_creation_time;
        process.send(game_teams.my_her.move(my_buildings[0].id, kek[3].id, 1));

        // // проверяем доступность абилки Крик
        // if (state.ability_ready(AbilityType[3]))
        //   if (enemy_buildings.length > 0)
        //     process.send(game_teams.my_her.growl(enemy_buildings[0].id));
        // // атака сразу используя абилку Берсерк
        // if (my_buildings.length > 0)
        //   if (my_buildings[0].creeps_count > 16)
        //     process.send(game_teams.my_her.move(my_buildings[0].id, enemy_buildings[0].id, 1));
        // // проверяем доступность абилки Берсерк
        if (state.ability_ready(AbilityType[2])) {
          // для эффективности повышаем площадь, применяем на 5 отрядах
          if (my_squads.length > 4) {
            // сколько тиков первому отряду осталось до башни
            const left_to_aim = my_squads[0].way.left / my_squads[0].speed;
            // Если первый отряд находится в зоне инициализации абилки
            const berserk_parameters = game_params.get_ability_parameters(AbilityType[2]);
            if (berserk_parameters.cast_time + 50> left_to_aim) {
              location = game_map.get_squad_center_position(my_squads[2]);
              process.send(game_teams.my_her.berserk(location));
            }
          }
        }
        if (my_squads.length > 4) {
          const left_to_aim = my_squads[0].way.left / my_squads[0].speed;
          const speed_up_parameters = game_params.get_ability_parameters(AbilityType[0]);
          if (speed_up_parameters.cast_time + 50 > left_to_aim) {
            location = game_map.get_squad_center_position(my_squads[0]);
            process.send(game_teams.my_her.speed_up(location));
          }
        }
        // let lol = game_map.get_nearest_towers(my_buildings[0].id, enemy_buildings);
        // for (let i = 0; i <= lol.length - 1; ++i) {
        //   count0 = lol[i].creeps_count + (game_map.towers_distance(my_buildings[i].id, lol[i].id) / game_params.creep.speed ) / lol[i].creep_creation_time;
        //   process.send(game_teams.my_her.move(my_buildings[i].id, lol[i].id, 1));
        //   count1 = lol[i].creeps_count + (game_map.towers_distance(my_buildings[i + 2].id, lol[i].id) / game_params.creep.speed ) / lol[i].creep_creation_time;
        //   process.send(game_teams.my_her.move(my_buildings[i + 2].id, lol[i].id, 1));
        // }
        //
        let {usleep} = require('usleep');
        usleep(3000).then(() => {
          console.info('It slept for 300 milliseconds');
        });

        let first = game_map.get_nearest_towers((my_buildings[0].id), neutral_buildings);
        let second = game_map.get_nearest_towers((my_buildings[1].id), neutral_buildings);
        let third = game_map.get_nearest_towers((my_buildings[2].id), neutral_buildings);
        count_f = first[0].creeps_count + (game_map.towers_distance(my_buildings[0].id, first[0].id) / game_params.creep.speed) / first[0].creep_creation_time;
        process.send(game_map.my_her.move(my_buildings[0].id, first[0].id, 1));
        count_s = second[0].creeps_count + (game_map.towers_distance(my_buildings[1].id, second[0].id) / game_params.creep.speed) / second[0].creep_creation_time;
        process.send(game_map.my_her.move(my_buildings[0].id, second[0].id, 1));
        count_t = third[0].creeps_count + (game_map.towers_distance(my_buildings[2].id, third[0].id) / game_params.creep.speed) / third[0].creep_creation_time;
        process.send(game_map.my_her.move(my_buildings[0].id, third[0].id, 1));

        let {msleep} = require('usleep');
        msleep(3000).then(() => {
          console.info('It slept for 300 milliseconds');
        });
        let countBuild;
        if (enemy_squads.length > 2) {
          for (let i = 0; i < my_buildings.length - 1; ++i)
            countBuild[i] = my_buildings[i].creeps_count;
          countBuild.sort((a,b) => a-b);
        }
        let index = countBuild.lastIndex - 1;
        let lol = game_map.get_nearest_towers(my_buildings[0].id, enemy_buildings);
        for (let i = 0; i <= lol.length - 1; ++i) {
          count0 = lol[i].creeps_count + (game_map.towers_distance(my_buildings[index].id, lol[i].id) / game_params.creep.speed ) / lol[i].creep_creation_time;
          process.send(game_teams.my_her.move(my_buildings[index].id, lol[i].id, 1));
          count1 = lol[i].creeps_count + (game_map.towers_distance(my_buildings[index - 1].id, lol[i].id) / game_params.creep.speed ) / lol[i].creep_creation_time;
          process.send(game_teams.my_her.move(my_buildings[index - 1].id, lol[i].id, 1));
        }
      }
      }
      // Применение абилки ускорение

  }
  catch (e) {
    console.log('error', e);
  } finally {
    process.send('end');
  }
};

process.on('message', async (game) => {
  if (game.initial) {
    game_map = new Map(game.data);  // карта игрового мира
    game_params = new Parameters(game.data);  // параметры игры
    game_teams = new Teams(game.data);  // моя команда
  } else
    await Bot(game.data, game_teams, game_params, game_map);
});
