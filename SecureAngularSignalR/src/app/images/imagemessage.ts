export class ImageMessage {
  public imageBinary = '';
  public imageHeaders = '';

  constructor() {}

  AddData(imageBinary: string, imageHeaders: string) {
    this.imageBinary = imageBinary;
    this.imageHeaders = imageHeaders;
  }
}
