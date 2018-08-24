import PluginHooks from "./hooks";
import SDK from "./SDK";

module.exports = function(PluginSDK) {
  SDK.setSDK(PluginSDK);

  PluginHooks.initialize(PluginSDK.config);
};
