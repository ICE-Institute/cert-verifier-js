import crypto from 'crypto';

Object.defineProperty(global.self, 'crypto', {
  value: {
    // use node 15.x
    subtle: crypto.webcrypto.subtle
  }
});
