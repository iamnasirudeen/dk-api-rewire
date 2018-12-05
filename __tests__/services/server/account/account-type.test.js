const expect = require('expect');
const app = require('../../../../src/app');

describe('Account Types Service', () => {

  const testData = {
    name: 'Super Admin',
    published: true
  };

  afterEach(async function () {
    await app.service('/account-types').remove(null);
  });

  test('registered the service', () => {
    const service = app.service('account-types');
    expect(service);
  });

  test('should create an account type', async () => {
    const result = await app.service('/account-types').create(testData);
    expect(result).toEqual(expect.objectContaining(testData));
  });

  test('should throw when non valid schema is passed', () => {
    app.service('/account-types').create({}).catch(error => {
      expect(error.message).toEqual('Data does not match schema');
      expect(error.code).toEqual(400);
      expect(error.name).toEqual('BadRequest');
    });
  });

  test('should patch an account type', async () => {
    testData.name = 'Admin';
    const _new = await app.service('/account-types').create(testData);
    _new.name = 'Individual';
    const result = await app.service('/account-types').patch(_new._id, {
      name: 'Individual'
    });
    delete _new.updatedAt;
    expect(result.name).toBe(_new.name);
    expect(result).toEqual(expect.objectContaining(_new));
  });

  test('should update an account type', async () => {
    const _new = await app.service('/account-types').create(testData);
    _new.name = 'Individual';
    const result = await app.service('/account-types').update(_new._id, _new);
    expect(result.name).toBe(_new.name);
  });

  test('should remove an account type', async () => {
    const _new = await app.service('/account-types').create(testData);
    const result = await app.service('/account-types').remove(_new._id);
    expect(result.name).toBe(_new.name);
  });

  test('should get an account type', async () => {
    const _new = await app.service('/account-types').create(testData);
    const result = await app.service('/account-types').get(_new._id);
    expect(result.name).toBe(_new.name);
  });

  test('should find account type', async () => {
    await app.service('/account-types').create(testData);
    const result = await app.service('/account-types').find({});
    expect(result.total).toBeTruthy();
    expect(result.data).toBeDefined();
    expect(result.data.length).toBeTruthy();
  });
});
