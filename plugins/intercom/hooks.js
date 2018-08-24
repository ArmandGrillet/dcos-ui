import DOMUtils from "#SRC/js/utils/DOMUtils";

module.exports = {
  initialize(config) {
    const intercomScript = `
    var APP_ID = "${config.appId}";
    window.intercomSettings = { app_id: APP_ID }; (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',intercomSettings);}else{var d=document;var i=function(){i.c(arguments)};i.q=[];i.c=function(args){i.q.push(args)};w.Intercom=i;function l(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/' + APP_ID;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);}if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})()
    window.Intercom('boot', { app_id: APP_ID });`;

    DOMUtils.appendScript(global.document.head, intercomScript);
  }
};
