import JsonToEventArrayUtil from "../utils/JsonToEventArrayUtil";
import MesosEventTypes from "../constants/MesosEventTypes";

const translate = function(event) {
  event = event["task_added"];

  return JsonToEventArrayUtil.flatten(event, MesosEventTypes.ADD);
};

module.exports = translate;