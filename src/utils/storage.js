import Console from './Console';

class Storage {

  constructor() {
    this.data = new Map();
  }

  save(key, value) {
    try {
      this.data.set(key, value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // downgrade to memory storage
      Console.error('Storage save error: ', e);
    }
    return value;
  }

  get(key) {
    if (this.data.has(key)) {
      return this.data.get(key);
    }
    const value = JSON.parse(window.localStorage.getItem(key));
    this.data.set(key, value);
    return value;
  }

  remove(key) {
    Console.info('Storage removed: ', key);
    this.data.delete(key);
    window.localStorage.removeItem(key);
  }

  clear() {
    this.data.clear();
    window.localStorage.clear();
  }

  // burn after reading
  getOnce(key) {
    const value = this.get(key);
    this.remove(key);
    return value;
  }
}

const storage = new Storage();

export default storage;
