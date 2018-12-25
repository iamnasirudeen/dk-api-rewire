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
  adminUser.role = adminRoleId.toString();
  adminUser.accountType = accountTypeId.toString();

  // Seed admin user
  const adminUserData = await seeder(app.service("/users"), adminUser, {
    query: {
      username: "admin",
      role: adminRoleId
    }
  });
  app
    .service("/email-confirmation")
    .find({ email: adminUser.email }) // find the user token from the db
    .then(async res => {
      const data = res.data[0];
      // Set the query params to update it
      const _params = {
        query: { email: data.email, key: data.key }
      };
      // do a patch call to set the status to confirmed
      await app
        .service("/email-confirmation")
        .patch(null, { status: true }, _params);
    });
  let adminUserId = (Array.isArray(adminUserData)
    ? adminUserData[0]
    : adminUserData
  )._id.toString();
  const optionTypeRecords = await app.service("/options").find();
  if (optionTypeRecords.total === 0) {
    await seedOptionList(app, adminUserId);
  }

  // Seed API KEY
  const apiKeyData = { deviceName: "generic" };
  const keyData = await seeder(app.service("/api-keys"), apiKeyData, {
    query: apiKeyData
  });
  // eslint-disable-next-line
  console.log("Available Generic API KEY", keyData.key || keyData[0].key);
};

const oldOptionList = require("./factory/oldOptionList.json");

async function seedOptionList(app, userId) {
  const changeCase = require("change-case");
  let displayOrder = 1;
  let optionTypeList = [];
  for (const optionType in oldOptionList) {
    if (oldOptionList.hasOwnProperty(optionType)) {
      const _t = changeCase.sentenceCase(optionType);
      optionTypeList.push({
        name: changeCase.lowerCase(_t),
        shortName: changeCase.upperCaseFirst(_t),
        longName: changeCase.upperCaseFirst(_t),
        author: userId,
        deletedAt: -1,
        type: "multi",
        displayOrder
      });
      displayOrder++;
    }
  }
  // eslint-disable-next-line
  let optionRecords = await seeder(app.service("/options"), optionTypeList);

  optionRecords.map(async option => {
    const optionId = option._id.toString();
    const camelCaseOptionName = changeCase.camelCase(option.name);
    const optionValues = oldOptionList[camelCaseOptionName];
    optionValues.map(val => {
      const name = val.name;
      val.shortName = changeCase.upperCaseFirst(name);
      val.longName = changeCase.upperCaseFirst(name);
      val.author = userId;
      val.option = optionId;
      val.deletedAt = -1;
      return val;
    });
    const url = "/option/:optionId/values";
    const params = { route: { optionId } };
    // eslint-disable-next-line
    let optionValueRecords = await seeder(
      app.service(url),
      optionValues,
      params,
      params
    );
    // console.log(optionValueRecords); // eslint-disable-line
  });
  // eslint-disable-next-line
  // const typeValue = oldOptionList[optionType];
  // element.forEach(async () => {
  //   await seeder(app.service("/option-values"))
  // });
}
