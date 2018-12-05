let adminUser = {
  username: 'admin',
  password: 'DAT1NG_K1NKY',
  fosta: true,
  dateOfBirth: '1980-01-01',
  email: 'admin@datingkinky.com',
  ip: '22.4.89.190'
};
// Devices for API KEYs
// ['mobile-android', 'mobile-ios', 'mobile-browser', 'desktop', 'generic']
const seeder = async (service, data, findParams = {}) => {
  let results = await service.find(findParams);
  // console.log(results); // eslint-disable-line
  if (!results.total) {
    results = await service.create(data);
  }
  return results.data || results;
};

module.exports = async (app) => {
  // Seeds Roles
  const roleData = await seeder(app.service('/roles'), app.get('supportedRoles'));
  // Get the admin role _id
  const {
    _id: adminRoleId
  } = await roleData.find((d) => d.name === 'Super Admin');

  // Seeds account types
  const accountTypeData = await seeder(app.service('/account-types'), app.get('supportedAccountTypes'));
  // Get the admin role _id
  const {
    _id: accountTypeId
  } = await accountTypeData.find((d) => d.name === 'Individual');

  adminUser.roleId = adminRoleId.toString();
  adminUser.accountTypeId = accountTypeId.toString();

  // Seed admin user
  await seeder(app.service('/users'), adminUser, {
    query: {
      username: 'admin',
      roleId: adminRoleId
    }
  });

  // Seed API KEY
  // const keyData = await seeder(app.service('/api-keys'), {
  //   device: 'generic',
  //   status: true
  // }, {
  //   query: {
  //     device: 'generic',
  //     status: true
  //   }
  // });
  // eslint-disable-next-line
  // console.log('Available Generic API KEY', keyData.key || keyData[0].key);
};
