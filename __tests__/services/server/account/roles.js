const expect = require('expect');
const app = require('../../../../src/app');

describe('Roles Service', () => {

  const testData = {
    name: 'Super Admin'
  };

  afterEach(async function () {
    await app.service('/roles').remove(null);
  });

  test('registered the service', () => {
    const service = app.service('roles');
    expect(service);
  });

  test('should create a role', async () => {
    const result = await app.service('/roles').create(testData);
    expect(result).toEqual(expect.objectContaining(testData));
  });

  test('should throw when non valid schema is passed', () => {
    app.service('/roles').create({}).catch(error => {
      expect(error.message).toEqual('Data does not match schema');
      expect(error.code).toEqual(400);
      expect(error.name).toEqual('BadRequest');
    });
  });

  test('should patch a role', async () => {
    testData.name = 'Admin';
    const _new = await app.service('/roles').create(testData);
    _new.name = 'Individual';
    const result = await app.service('/roles').patch(_new._id, {
      name: 'Individual'
    });
    delete _new.updatedAt;
    // console.debug(result); // eslint-disable-line
    expect(result.name).toBe(_new.name);
    expect(result).toEqual(expect.objectContaining(_new));
  });

  test('should update a role', async () => {
    const _new = await app.service('/roles').create(testData);
    _new.name = 'Individual';
    const result = await app.service('/roles').update(_new._id, _new);
    expect(result.name).toBe(_new.name);
  });

  test('should remove a role', async () => {
    const _new = await app.service('/roles').create(testData);
    const result = await app.service('/roles').remove(_new._id);
    expect(result.name).toBe(_new.name);
  });

  test('should get a role', async () => {
    const _new = await app.service('/roles').create(testData);
    const result = await app.service('/roles').get(_new._id);
    expect(result.name).toBe(_new.name);
  });

  test('should find role', async () => {
    await app.service('/roles').create(testData);
    const result = await app.service('/roles').find({});
    expect(result.total).toBeTruthy();
    expect(result.data).toBeDefined();
    expect(result.data.length).toBeTruthy();
  });
});
