import { assert } from 'chai';
import 'mocha';
import { expandUser, expandVars } from './index';
import { homedir } from 'os';

describe('expanduser', () => {
  const fakeHome = '/home/example';

  it('unbound', () => {
    assert.equal(expandUser('~'), homedir());
  });

  it('$HOME', () => {
    const expand = expandUser.bind({ HOME: fakeHome });
    assert.equal(expand('~'), fakeHome);
  });

  it('$USERPROFILE', () => {
    const expand = expandUser.bind({ USERPROFILE: fakeHome });
    assert.equal(expand('~'), fakeHome);
  });
});

describe('expandvars', () => {
  it('constants', () => {
    assert.equal(expandVars('FOO'), 'FOO');
    assert.equal(expandVars('$'), '$');
    assert.equal(expandVars('BAR$'), 'BAR$');
  });

  it('empty', () => {
    assert.equal(expandVars(''), '');
    assert.equal(expandVars('$FOO'), '$FOO');
  });

  it('simple', () => {
    const expand = expandVars.bind({ FOO: 'bar' });
    assert.equal(expand('$FOO'), 'bar');
    assert.equal(expand('${FOO}'), 'bar');
  });

  it('combo', () => {
    const expand = expandVars.bind({ FOO: 'bar', BIZ: 'buz' });
    assert.equal(expand('${FOO}:$BIZ'), 'bar:buz');
    assert.equal(expand('$FOO$BIZ'), 'barbuz');
    assert.equal(expand('${FOO}$BIZ'), 'barbuz');
    assert.equal(expand('$FOO${BIZ}'), 'barbuz');
    assert.equal(expand('$FOO-$BIZ'), 'bar-buz');
    assert.equal(expand('boo$BIZ'), 'boobuz');
    assert.equal(expand('boo${BIZ}'), 'boobuz');
  });
});
