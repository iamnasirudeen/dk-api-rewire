// Devices for API KEYs
// ['mobile-android', 'mobile-ios', 'mobile-browser', 'desktop', 'generic']
const seeder = async (service, data, findParams = {}, saveParams = {}) => {
  let results = await service.find(findParams);
  // console.log(results); // eslint-disable-line
  if (!results.total) {
    results = await service.create(data, saveParams);
  }
  return results.data || results;
};

module.exports = async app => {
  // Seeds Roles
  const roleData = await seeder(
    app.service("/roles"),
    app.get("supportedRoles")
  );
  // Get the admin role _id
  const { _id: adminRoleId } = await roleData.find(
    d => d.name === "Super Admin"
  );

  // Seeds account types
  const accountTypeData = await seeder(
    app.service("/account-types"),
    app.get("supportedAccountTypes")
  );
  // Get the administrator account type role _id
  const { _id: accountTypeId } = await accountTypeData.find(
    d => d.name === "Administrator"
  );
  let adminUser = app.get("adminUser");
  adminUser.roleId = adminRoleId.toString();
  adminUser.accountTypeId = accountTypeId.toString();

  // Seed admin user
  const adminUserData = await seeder(app.service("/users"), adminUser, {
    query: {
      username: "admin",
      roleId: adminRoleId
    }
  });
  // Confirm adminUser if not confirmed before (usually done on first run)
  app
    .service("/email-confirmation")
    .find({ email: adminUser.email }) // find the user token from the db
    .then(async res => {
      const data = res.data[0];
      if (!data.status) {
        // Set the query params to update it
        const _params = {
          query: { email: data.email, key: data.key }
        };
        // do a patch call to set the status to confirmed
        await app
          .service("/email-confirmation")
          .patch(null, { status: true }, _params);
      }
    });
  let adminUserId = (Array.isArray(adminUserData)
    ? adminUserData[0]
    : adminUserData
  )._id.toString();
  // Test if we have options seeded and seed them if not
  const optionTypeRecords = await app.service("/options").find();
  if (optionTypeRecords.total === 0) {
    await seedOptionList(app, adminUserId);
  }

  // Seed API KEY
  const apiKeyData = { deviceName: "generic" };
  const keyData = await seeder(app.service("/api-keys"), apiKeyData, {
    query: apiKeyData
  });
  // Always log an API key for us to use
  // eslint-disable-next-line
  console.log("Available Generic API KEY", keyData.key || keyData[0].key);
};

const oldOptionList = require("./factory/oldOptionList.json");

async function seedOptionList(app, userId) {
  const changeCase = require("change-case");
  // Display order for the option types
  let displayOrder = 1;
  // Holds objects of option types
  let optionTypeList = [];
  for (const optionType in oldOptionList) {
    if (oldOptionList.hasOwnProperty(optionType)) {
      const _t = changeCase.sentenceCase(optionType);
      // Pushes modified option types into the array. Setting required fields
      optionTypeList.push({
        name: changeCase.lowerCase(_t),
        shortName: changeCase.upperCaseFirst(_t),
        longName: changeCase.upperCaseFirst(_t),
        userId: userId,
        deletedAt: -1,
        type: "multi",
        displayOrder
      });
      // Increments the display order
      displayOrder++;
    }
  }
  // Finally seeds the option types
  // eslint-disable-next-line
  let optionRecords = await seeder(app.service("/options"), optionTypeList);

  // Goes through all the ooption records returned after seeding the optionTypes
  optionRecords.map(async option => {
    // Get the id of the option type
    const optionId = option._id.toString();
    // turns the name to camel case`
    const camelCaseOptionName = changeCase.camelCase(option.name);
    // Get the values for the option types
    const optionValues = oldOptionList[camelCaseOptionName];
    // Map through the values setting the required fields
    optionValues.map(val => {
      const name = val.name;
      val.shortName = changeCase.upperCaseFirst(name);
      val.longName = changeCase.upperCaseFirst(name);
      val.userId = userId;
      val.optionId = optionId;
      val.accountTypeIds = val.accountTypes;
      val.deletedAt = -1;
      return val;
    });
    // The raw path for the option values service
    const url = "/option/:optionId/values";
    // Params to use when saving, holds the needed user optionId
    const params = { route: { optionId } };
    // Finally seeds the optionValues
    // eslint-disable-next-line
    let optionValueRecords = await seeder(
      app.service(url),
      optionValues,
      params,
      params
    );
    // console.log(optionValueRecords); // eslint-disable-line
  });
}
