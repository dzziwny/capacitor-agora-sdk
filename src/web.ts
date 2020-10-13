import { WebPlugin } from '@capacitor/core';
import { AgoraPlugin } from './definitions';
import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

export class AgoraWeb extends WebPlugin implements AgoraPlugin {

  private client: IAgoraRTCClient;
  private audioTrack: Promise<IMicrophoneAudioTrack>;
  private appId: Promise<string>;
  private appIdResolver: any;

  constructor() {
    super({
      name: 'Agora',
      platforms: ['web'],
    });

    this.appId = new Promise(resolve => this.appIdResolver = resolve);
    this.audioTrack = AgoraRTC.createMicrophoneAudioTrack();
    this.client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8', role: "host" });
    this.client.on('user-published', (user, mediaType) => {
      this.client
        .subscribe(user, mediaType)
        .then(() => {
          if (mediaType === 'audio') {
            const { audioTrack } = user;
            audioTrack!.play();
          }
        });
    });

    this.client.on('user-unpublished', user => {
      const uid = user.uid.toString();
      const playerContainer = document.getElementById(uid);
      if (playerContainer) {
        playerContainer.remove();
      } else {
        console.warn('nie ma player container dla uid ' + uid);
      }
    });

    this.client.on('user-joined', user => {
      this.notifyListeners('didJoin', user.uid.toString())
    })

    this.client.on('user-left', user => {
      this.notifyListeners('didLeave', user.uid.toString())
    })
  }

  initialize(options: { appId: string; }): Promise<void> {
    this.appIdResolver(options.appId);
    return Promise.resolve();
  }

  join(options: {
    channel: string;
    userId: number;
    token: string;
  }): Promise<void> {
    this.audioTrack = AgoraRTC.createMicrophoneAudioTrack();
    const { channel, token, userId } = options;
    return this.appId
      .then(appId => this.client.join(appId, channel, token, userId))
      .then(() => {})
  }

  talk(): Promise<void> {
    return this.audioTrack.then(audioTrack => this.client.publish(audioTrack));
  }

  mute(): Promise<void> {
    return this.audioTrack.then(audioTrack => this.client.unpublish(audioTrack));
  }

  leave(): Promise<void> {
    return this.audioTrack
      .then((audioTrack) => {
        audioTrack.close();
        this.client.remoteUsers.forEach(user => {
          const uid = user.uid.toString();
          const playerContainer = document.getElementById(uid);
          if (playerContainer)
            playerContainer.remove();
        });

        return this.client.leave();
      })
  }

}

const Agora = new AgoraWeb();

export { Agora };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(Agora);
