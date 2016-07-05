import { Transform } from 'stream';

class Timestamp extends Transform {
  _transform(data, encoding, done) {
    const string = data.toString().replace(/\r?\n|\r/gm, ' ');
    this.push(`${new Date().toISOString()} ${string}\n`);
    done();
  }
}

export default Timestamp;
