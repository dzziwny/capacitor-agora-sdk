declare module '@capacitor/core' {
  interface PluginRegistry {
    Agora: AgoraPlugin;
  }
}

export interface AgoraPlugin {
  initialize(options: { appId: string }): Promise<void>;
  join(options: {
    channel: string;
    userId: number;
    token: string;
  }): Promise<void>;
  talk(): Promise<void>;
  mute(): Promise<void>;
  leave(): Promise<void>;
}
