export class MediaStreamService {
  private _mediaStream: MediaStream | undefined;

  async getMediaStream(): Promise<MediaStream> {
    this._mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    return this._mediaStream;
  }
}
