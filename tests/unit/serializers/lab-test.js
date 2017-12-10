import { moduleForModel, test } from 'ember-qunit';

moduleForModel('labs', 'Unit | Serializer | labs', {
  // Specify the other units that are required for this test.
  needs: ['serializer:labs']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
