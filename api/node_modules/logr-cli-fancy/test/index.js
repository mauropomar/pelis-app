const test = require('tape');
const Logr = require('logr');


let lastMessage;
const logger = function(msg) {
  lastMessage = msg;
  //use for debugging
  //console.log(msg); //eslint-disable-line no-console
};

test('string with no tag', (t) => {
  t.plan(1);

  const log = new Logr({
    logger,
    type: 'cli-fancy',
    reporters: {
      'cli-fancy': require('../')
    }
  });

  log('some string');
  t.equal(lastMessage, '               \x1b[2m  ::  \x1b[22msome string');
});

test('string with 1 tag', (t) => {
  t.plan(1);

  const log = new Logr({
    logger,
    type: 'cli-fancy',
    reporters: {
      'cli-fancy': require('../')
    }
  });

  log(['app'], 'some string');
  t.equal(lastMessage, '            \x1b[33mapp\x1b[39m\x1b[2m  ::  \x1b[22msome string');
});

test('string with 2 tags', (t) => {
  t.plan(1);

  const log = new Logr({
    logger,
    type: 'cli-fancy',
    reporters: {
      'cli-fancy': require('../')
    }
  });

  log(['app', 'debug'], 'some string');
  t.equal(lastMessage, '            \x1b[33mapp\x1b[39m [\x1b[2mdebug\x1b[22m]\x1b[2m  ::  \x1b[22msome string');
});

test('string with multiple tags', (t) => {
  t.plan(1);

  const log = new Logr({
    logger,
    type: 'cli-fancy',
    reporters: {
      'cli-fancy': require('../')
    }
  });

  log(['app', 'info', 'test'], 'some string');
  t.equal(lastMessage, '            \x1b[33mapp\x1b[39m [\x1b[2minfo\x1b[22m,\x1b[2mtest\x1b[22m]\x1b[2m  ::  \x1b[22msome string');
});


test('color error, warning, success tags', (t) => {
  t.plan(1);

  const log = new Logr({
    logger,
    type: 'cli-fancy',
    reporters: {
      'cli-fancy': require('../')
    }
  });

  log(['app', 'error', 'warning', 'success'], 'some string');
  t.equal(lastMessage, '            \x1b[33mapp\x1b[39m [\x1b[31merror\x1b[39m,\x1b[33mwarning\x1b[39m,\x1b[32msuccess\x1b[39m]\x1b[2m  ::  \x1b[22msome string');
});

test('json', (t) => {
  t.plan(1);

  const log = new Logr({
    logger,
    type: 'cli-fancy',
    reporters: {
      'cli-fancy': require('../')
    }
  });

  log(['app'], {
    message: 'this is some message',
    firstName: 'bob',
    lastName: 'smith',
    age: 100
  });
  t.equal(lastMessage, '            \x1b[33mapp\x1b[39m\x1b[2m  ::  \x1b[22m{\n          "message": "this is some message",\n          "firstName": "bob",\n          "lastName": "smith",\n          "age": 100\n}');
});
