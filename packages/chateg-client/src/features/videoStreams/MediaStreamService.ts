import { produce } from "immer";
import { BaseStore } from "../store/BaseStore";

export type StreamData = {
  isVoiceOn: boolean;
  isVideoOn: boolean;
};

export class MediaStreamService extends BaseStore<StreamData> {
  private _mediaStream: MediaStream | undefined;

  constructor() {
    super({
      isVideoOn: true,
      isVoiceOn: true,
    });

    this.getMediaStream = this.getMediaStream.bind(this);
    this.toggleVoice = this.toggleVoice.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
  }

  async getMediaStream(): Promise<MediaStream> {
    if (!this._mediaStream) {
      this._mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
    }
    return this._mediaStream;
  }

  turnOffMediaStream() {
    if (this._mediaStream) {
      this._mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  toggleVoice() {
    // if (!this._mediaStream) return;

    this.update((state) => {
      const newValue = !state.isVoiceOn;
      state.isVoiceOn = newValue;
      // const audioTracks = this._mediaStream!.getAudioTracks();
      // audioTracks.forEach((track) => {
      //   track.enabled = newValue;
      // });
    });
  }

  toggleVideo() {
    // if (!this._mediaStream) return;

    this.update((state) => {
      const newValue = !state.isVideoOn;
      state.isVideoOn = newValue;
      // const videoTracks = this._mediaStream!.getVideoTracks();
      // videoTracks.forEach((track) => {
      //   track.enabled = newValue;
      // });
    });
  }

  private update(callback: (prev: StreamData) => void) {
    const result = produce(this._store, callback);
    this.set(result);
  }
}
