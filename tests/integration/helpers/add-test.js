import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('add', 'helper:add', {
  integration: true,
});

test('it adds 2 numbers', function(assert) {
  this.render(hbs`{{add 1 2}}`);

  assert.equal(
    this.$()
      .text()
      .trim(),
    '3'
  );
});

test('it adds 3 numbers', function(assert) {
  this.render(hbs`{{add 1 2 3}}`);

  assert.equal(
    this.$()
      .text()
      .trim(),
    '6'
  );
});

test('it adds strings', function(assert) {
  this.render(hbs`{{add '1' '2'}}`);

  assert.equal(
    this.$()
      .text()
      .trim(),
    '12'
  );
});

test('it adds strings and numbers', function(assert) {
  this.render(hbs`{{add '1' '2' 3}}`);

  assert.equal(
    this.$()
      .text()
      .trim(),
    '123'
  );
});
