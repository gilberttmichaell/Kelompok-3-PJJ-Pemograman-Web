const test = require('node:test');
const assert = require('node:assert/strict');

const { validateStore: validateUser } = require('../validation/userValidation');
const { validateStore: validateCustomer } = require('../validation/customerValidation');
const { validateStore: validateContact } = require('../validation/contactValidation');
const { validateStore: validateActivity } = require('../validation/activityValidation');
const { validateStore: validateLead } = require('../validation/leadValidation');
const { validateStore: validateDeal } = require('../validation/dealValidation');
const authorize = require('../middleware/authorize');

test('payload CRUD yang valid lolos validasi', () => {
  assert.equal(validateUser({
    name: 'Admin', email: 'admin@example.com', password: 'secret1', role: 'admin'
  }), null);
  assert.equal(validateCustomer({ name: 'PT Contoh', email: 'crm@example.com' }), null);
  assert.equal(validateContact({
    customer_id: 1, name: 'Budi', email: 'budi@example.com'
  }), null);
  assert.equal(validateActivity({
    customer_id: 1, type: 'Call', activity_date: '2026-06-28 10:00:00'
  }), null);
  assert.equal(validateLead({ customer_id: 1, title: 'Implementasi CRM', status: 'New' }), null);
  assert.equal(validateDeal({
    lead_id: 1, title: 'Implementasi CRM', value: 1000000, stage: 'Open'
  }), null);
});

test('payload CRUD yang tidak valid ditolak', () => {
  assert.ok(validateUser({ name: '', email: 'salah', password: '1', role: 'owner' }));
  assert.ok(validateContact({ customer_id: null, name: '' }));
  assert.ok(validateActivity({ customer_id: null, type: 'Chat' }));
  assert.ok(validateLead({ customer_id: null, title: '', status: 'Unknown' }));
  assert.ok(validateDeal({ lead_id: null, title: '', value: -1, stage: 'Unknown' }));
});

test('middleware authorization membedakan admin dan staff', () => {
  let nextCalled = false;
  const response = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };

  authorize('admin')({ user: { role: 'staff' } }, response, () => { nextCalled = true; });
  assert.equal(response.statusCode, 403);
  assert.equal(nextCalled, false);

  authorize('admin')({ user: { role: 'admin' } }, response, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
});
