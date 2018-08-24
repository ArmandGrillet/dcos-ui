import DOMUtils from "#SRC/js/utils/DOMUtils";
import MetadataStore from "#SRC/js/stores/MetadataStore";
import AuthStore from "#SRC/js/stores/AuthStore";
import EventTypes from "#SRC/js/constants/EventTypes";

const SDK = require("./SDK").getSDK();

module.exports = {
  actions: ["pluginsConfigured", "userLoginSuccess", "userLogoutSuccess"],

  initialize(configuration) {
    this.configuration = configuration;

    this.actions.forEach(action => {
      SDK.Hooks.addAction(action, this[action].bind(this));
    });

    this.bootIntercom = this.bootIntercom.bind(this);

    const intercomScript = [
      `var APP_ID = "${this.configuration.appId}";`,
      `window.intercomSettings = {app_id: APP_ID};`,
      `(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/' + APP_ID;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()`
    ].join("");

    DOMUtils.appendScript(global.document.head, intercomScript);
  },

  pluginsConfigured() {
    if (AuthStore.isLoggedIn) {
      this.bootIntercom();
    }
  },

  userLoginSuccess() {
    this.bootIntercom();
  },

  userLogoutSuccess() {
    window.Intercom("shutdown");
  },

  bootIntercom() {
    const boot = () => {
      window.Intercom("boot", {
        app_id: this.configuration.appId,
        dcosVersion: MetadataStore.version,
        dcosVariant: MetadataStore.variant,
        email: AuthStore.getUser().email,
        name: AuthStore.getUser().name
      });
    };

    if (!MetadataStore.version) {
      MetadataStore.addChangeListener(EventTypes.DCOS_METADATA_CHANGE, boot);
    } else {
      this.boot();
    }
  }
};
