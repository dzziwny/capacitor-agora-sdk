#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(AgoraIos, "AgoraIos",
           CAP_PLUGIN_METHOD(initialize, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(join, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(leave, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(talk, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(mute, CAPPluginReturnPromise);
)
