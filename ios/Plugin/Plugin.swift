import Foundation
import Capacitor
import AgoraRtcKit

@objc(Agora)
public class Agora: CAPPlugin {

    var agoraKit: AgoraRtcEngineKit!

    @objc func initialize(_ call: CAPPluginCall) {
      let appId = call.getString("appId") ?? "";
      agoraKit = AgoraRtcEngineKit.sharedEngine(withAppId: appId, delegate: nil);
      agoraKit.enableWebSdkInteroperability(true);
      agoraKit.setChannelProfile(AgoraChannelProfile.liveBroadcasting);
      agoraKit.setClientRole(AgoraClientRole.broadcaster);
      call.resolve();
    }

    @objc func join(_ call: CAPPluginCall) {
        let channel = call.getString("channel") ?? "";
        let userId = UInt(call.getString("userId") ?? "") ?? 0;
        let token = call.getString("token") ?? "";
        agoraKit.joinChannel(byToken: token, channelId: channel, info:nil, uid: userId) {[unowned self] (sid, uid, elapsed) -> Void in
            self.agoraKit.setEnableSpeakerphone(true);
            call.resolve();
        }
    }

    @objc func leave(_ call: CAPPluginCall) {
        agoraKit.leaveChannel(nil);
        call.resolve();
    }

    @objc func talk(_ call: CAPPluginCall) {
        agoraKit.muteLocalAudioStream(false);
        call.resolve();
    }

    @objc func mute(_ call: CAPPluginCall) {
        agoraKit.muteLocalAudioStream(true);
        call.resolve();
    }
}

extension Agora: AgoraRtcEngineDelegate {

    public func rtcEngine(_ engine: AgoraRtcEngineKit, didJoinedOfUid uid: UInt, elapsed: Int) {
        self.notifyListeners("didJoin", data: ["uid": uid])
  }

    public func rtcEngine(_ engine: AgoraRtcEngineKit, didOfflineOfUid uid: UInt, reason: AgoraUserOfflineReason) {
      self.notifyListeners("didLeave", data: ["uid": uid])
  }

}
