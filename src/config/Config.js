export default class Config {
  constructor() {
    // Example 'http://yourdrupalsite.com/', <-- remember the trailing /
    this.config = {
      baceUrl: 'http://yourdrupalsite.com/',
      data:[],
    };
  }
  getBaceUrl() {
    return this.config.baceUrl;
  }
  getBaceData() {
    return this.config.data;
  }
}
