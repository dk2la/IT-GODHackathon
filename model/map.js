class Map {
  /* Класс, предоставляяющий вспомогательные методы работы с картой */
  constructor(game) {
    this.map = game;
    this.map = this.map.ResponseGameParametersArgs.Map;
    this.links = this.map.Links;
    // Вычисляем и добавляем расстояние между башнями
    this.links.map((link) => {
      link.Distance = this.__towers_distance(link.From, link.To);
    })
  }

  towers_distance = (from_id, to_id) => {
    /* Возвращает расстояние между башнями */
    let res = null;
    if (from_id > to_id)
      from_id = [to_id, to_id = from_id][0];
    this.links.forEach((link) => {
      if (link.From === from_id && link.To === to_id)
        res = link.Distance;
    });
    return res;
  };

  points_distance = (point1, point2) => {
    /* Вычиляет расстояние между двумя точками */
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
  };

  __towers_distance = (from_id, to_id) => {
    /* Вычисляет расстояние между двумя башнями */
    if (from_id === to_id)
      return 0;
    // массив точек в векторе__get_waypoints
    let waypoints = this.__get_waypoints(from_id, to_id);
    if (waypoints === null)
      return 0;
    let result = 0;
    for (let i = 0; i < waypoints.length - 1; i++)
      result += this.points_distance(waypoints[i], waypoints[i + 1]);
    return result;
  };

  __get_waypoints = (from_id, to_id) => {
    /* Извлекает массив точек маршрута между двумя башнями */
    let res = null;
    if (from_id > to_id)
      from_id = [to_id, to_id = from_id][0];
    this.links.forEach((link) => {
      if (link.From === from_id && link.To === to_id)
        res = link.Vectors;
    },
    );
    return res;
  };

  get_squad_center_position = (squad) => {
    /* Вычисляет координаты центра отряда */
    let from_id = squad.from_id;
    let to_id = squad.to_id;
    let part_of_path = squad.way.traveled / squad.way.total;
    let waypoints = this.__get_waypoints(from_id, to_id);
    let distance = this.towers_distance(from_id, to_id);
    let absolute_part = distance * part_of_path;
    distance = 0;
    if (from_id > to_id)
      waypoints.reverse();
    for (let i = 0; i < waypoints.length - 1; i++) {
      part_of_path = this.points_distance(waypoints[i], waypoints[i + 1]);
      distance += part_of_path;
      if (distance >= absolute_part) {
        let current_path = absolute_part - (distance - part_of_path);
        let current_part = current_path / part_of_path;
        let res = {
          "x": waypoints[i]["x"] + (waypoints[i + 1]["x"] - waypoints[i]["x"]) * current_part,
          "y": waypoints[i]["y"] + (waypoints[i + 1]["y"] - waypoints[i]["y"]) * current_part,
        };
        return res;
      }
    }
    return { "x": 0, "y": 0 };
  };

  get_nearest_towers = (from_id, towers) => {
    // Сортирует массив towers по расстояние до from_id
    let distances = [];
    towers.forEach((tower) => {
      distances = [...distances, {
        tower,
        "distance": this.towers_distance(from_id, tower.id),
      }]
    });
    distances.sort(function (a, b) {
      if (a.distance > b.distance) {
        return 1;
      }
      if (a.distance < b.distance) {
        return -1;
      }
      return 0;
    });
    let result = [];
    distances.forEach((item) => {
      result = [...result, item.tower];
    })
    return result;
  };

  get_tower_location = (tower_id) => {
    /* Возвращает location башни */
    this.links.forEach((link) => {
      if (link.From === tower_id)
        return {
          "x": link["Vectors"][0]["x"],
          "y": link["Vectors"][0]["y"],
        }
    })
  }
};

module.exports.Map = Map;
