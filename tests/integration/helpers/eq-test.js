import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('eq', 'helper:eq', {
  integration: true,
});

test('two values equals', function(assert) {
  this.render(hbs`{{eq '1' '1'}}`);

  assert.equal(
    this.$()
      .text()
      .trim(),
    'true'
  );
});

test('three values equals', function(assert) {
  this.render(hbs`{{eq '1' '1' '1'}}`);

  assert.equal(
    this.$()
      .text()
      .trim(),
    'true'
  );
});

// TODO: some bug
// test('three values equals', function(assert) {
//   this.render(hbs`{{eq undefined undefined}}`);

//   assert.equal(
//     this.$()
//       .text()
//       .trim(),
//     'true'
//   );
// });

test('two diff values not equals', function(assert) {
  this.render(hbs`{{eq '1' '2'}}`);

  assert.equal(
    this.$()
      .text()
      .trim(),
    'false'
  );
});

test('three diff values not equals', function(assert) {
  this.render(hbs`{{eq '1' '2' '1'}}`);

  assert.equal(
    this.$()
      .text()
      .trim(),
    'false'
  );
});
