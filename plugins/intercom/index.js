import PluginHooks from "./hooks";
import SDK from "./SDK";

module.exports = function(PluginSDK) {
  const { Hooks } = PluginSDK;
  SDK.setSDK(PluginSDK);

  PluginHooks.initialize(Hooks);
};
