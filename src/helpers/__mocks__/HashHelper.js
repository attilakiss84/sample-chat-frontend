class HashHelper {
  constructor() {
    this._hash = 'test';
  }

  generateThreadId() {
    return this._hash;
  }

  setHash(newHash) {
    this._hash = newHash;
  }
}

const instance = new HashHelper();
export default instance;
