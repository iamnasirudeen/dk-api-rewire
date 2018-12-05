const expect = require('expect');
const app = require('../../../../src/app');

describe('Roles Service', () => {

  const testData = {
    username: 'Rocio.Stol',
    email: 'Kelsi7@yahoo.com',
    password: 'ncE8a29AeGHa2AB',
    roleId: '',
    accountTypeId: '',
    fosta: true,
    dateOfBirth: '2013-01-29',
    ip: '156.130.112.155',
    deletedAt: -1,
  };
  const updateUser = async () => {
    // Generate role
    const {
      _id: roleId
    } = await app.service('/roles').create({
      name: 'Admin'
    });
    // Generate Account Type
    const {
      _id: accountTypeId
    } = await app.service('/account-types').create({
      name: 'Admin',
      published: true
    });
    testData.roleId = roleId.toString();
    testData.accountTypeId = accountTypeId.toString();
  };
  beforeAll(async () => {
    await app.service('/roles').remove(null);
    await app.service('/account-types').remove(null);
    await updateUser();
  });

  afterEach(async function () {
    await app.service('/users').remove(null);
  });

  test('registered the service', () => {
    const service = app.service('roles');
    expect(service);
  });

  test('should create a user', async () => {
    const result = await app.service('/users').create(testData);
    expect(testData.username).toBe(result.username);
    expect(testData.email).toBe(result.email);
    expect(testData.roleId.toString()).toBe(result.roleId);
    expect(testData.accountTypeId.toString()).toBe(result.accountTypeId);
  });

  test('should throw when non valid schema is passed', () => {
    app.service('/users').create({}).catch(error => {
      expect(error.message).toEqual('Data does not match schema');
      expect(error.code).toEqual(400);
      expect(error.name).toEqual('BadRequest');
    });
  });

  test('should patch a user', async () => {
    testData.name = 'Admin';
    const _new = await app.service('/users').create(testData);
    _new.username = 'Individual';
    const result = await app.service('/users').patch(_new._id, {
      username: 'Individual'
    });
    delete _new.updatedAt;
    // console.debug(result); // eslint-disable-line
    expect(result.username).toBe(_new.username);
    expect(result).toEqual(expect.objectContaining(_new));
  });

  test('should update a user', async () => {
    const _new = await app.service('/users').create(testData);
    _new.username = 'Individual';
    const result = await app.service('/users').update(_new._id, _new);
    expect(result.username).toBe(_new.username);
  });

  test('should remove a user', async () => {
    const _new = await app.service('/users').create(testData);
    const result = await app.service('/users').remove(_new._id);
    expect(result.username).toBe(_new.username);
  });

  test('should get a user', async () => {
    const _new = await app.service('/users').create(testData);
    const result = await app.service('/users').get(_new._id);
    expect(result.username).toBe(_new.username);
  });

  test('should find user', async () => {
    await app.service('/users').create(testData);
    const result = await app.service('/users').find({});
    expect(result.total).toBeTruthy();
    expect(result.data).toBeDefined();
    expect(result.data.length).toBeTruthy();
  });
});
