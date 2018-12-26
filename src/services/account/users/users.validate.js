/* eslint quotes: 0 */
// Validation definitions for validateSchema hook for service `users`. (Can be re-generated.)
const { validateSchema } = require("feathers-hooks-common");
const merge = require("lodash.merge");
const ajv = require("ajv");
// !code: imports // !end
// !code: init // !end

// !<DEFAULT> code: set_id_type
// eslint-disable-next-line no-unused-vars
const ID = "string";
// !end

let base = merge(
  {},
  // !<DEFAULT> code: base
  {
    title: "Users",
    description: "Users database.",
    required: [
      "username",
      "email",
      "password",
      "roleId",
      "emailConfirmId",
      "accountTypeId",
      "fosta",
      "dateOfBirth"
    ],
    uniqueItemProperties: ["username", "email"],
    properties: {
      username: {
        minLength: 4,
        maxLength: 10,
        faker: "internet.userName",
        type: "string"
      },
      email: {
        format: "email",
        faker: "internet.email",
        type: "string"
      },
      password: {
        faker: "internet.password",
        minLength: 5,
        type: "string"
      },
      dateOfBirth: {
        format: "date",
        type: "string"
      },
      ip: {
        format: "ipv4",
        faker: "internet.ip",
        type: "string"
      },
      roleId: {
        ref: "roles",
        type: ID,
        faker: {
          fk: "roles:random"
        }
      },
      emailConfirmId: {
        ref: "emailConfirmation",
        type: ID,
        faker: {
          fk: "emailConfirmation:random"
        }
      },
      accountTypeId: {
        ref: "accountTypes",
        type: ID,
        faker: {
          fk: "accountTypes:random"
        }
      },
      fosta: {
        type: "boolean",
        chance: {
          bool: {
            likelihood: 65
          }
        }
      },
      deletedAt: {
        type: "number",
        chance: {
          integer: {
            min: -1,
            max: -1
          }
        }
      }
    }
  }
  // !end
  // !code: base_more // !end
);
// !code: base_change // !end

let create = merge(
  {},
  base
  // !code: create_more // !end
);

let update = merge(
  {},
  base
  // !code: update_more // !end
);

let patch = merge(
  {},
  base,
  { required: undefined }
  // !code: patch_more // !end
);
// !code: all_change
patch.required = [];
// !end

let validateCreate = options => {
  // !<DEFAULT> code: func_create
  return validateSchema(create, ajv, options);
  // !end
};

let validateUpdate = options => {
  // !<DEFAULT> code: func_update
  return validateSchema(update, ajv, options);
  // !end
};

let validatePatch = options => {
  // !<DEFAULT> code: func_patch
  return validateSchema(patch, ajv, options);
  // !end
};

let quickValidate = (method, data, options) => {
  try {
    if (method === "create") {
      validateCreate(options)({ type: "before", method: "create", data });
    }
    if (method === "update") {
      validateCreate(options)({ type: "before", method: "update", data });
    }
    if (method === "patch") {
      validateCreate(options)({ type: "before", method: "patch", data });
    }
  } catch (err) {
    return err;
  }
};
// !code: validate_change // !end

let moduleExports = {
  create,
  update,
  patch,
  validateCreate,
  validateUpdate,
  validatePatch,
  quickValidate
  // !code: moduleExports // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
