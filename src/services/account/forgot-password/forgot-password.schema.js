// Define the Feathers schema for service `forgotPassword`. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

// Define the model using JSON-schema
let schema = {
  // !<DEFAULT> code: schema_header
  title: "ForgotPassword",
  description: "ForgotPassword database.",
  // !end
  // !code: schema_definitions // !end

  // Required fields.
  required: [
    // !code: schema_required
    "email",
    "key"
    // !end
  ],
  // Fields with unique values.
  uniqueItemProperties: [
    // !code: schema_unique
    "key"
    // !end
  ],

  // Fields in the model.
  properties: {
    // !code: schema_properties
    status: { type: "boolean", enum: [true, false] },
    key: { minLength: 10, maxLength: 25 },
    email: {
      format: "email",
      faker: "internet.email"
    },
    username: {},
    deletedAt: {
      type: "number",
      chance: {
        integer: {
          min: -1,
          max: -1
        }
      }
    }
    // !end
  }
  // !code: schema_more // !end
};

// Define optional, non-JSON-schema extensions.
let extensions = {
  // GraphQL generation.
  graphql: {
    // !code: graphql_header
    name: "ForgotPassword",
    service: {
      sort: { _id: 1 }
    },
    // sql: {
    //   sqlTable: 'ForgotPassword',
    //   uniqueKey: '_id',
    //   sqlColumn: {
    //     __authorId__: '__author_id__',
    //   },
    // },
    // !end
    discard: [
      // !code: graphql_discard // !end
    ],
    add: {
      // !<DEFAULT> code: graphql_add
      // __author__: { type: '__User__!', args: false, relation: { ourTable: '__authorId__', otherTable: '_id' } },
      // !end
    }
    // !code: graphql_more // !end
  }
};

// !code: more // !end

let moduleExports = {
  schema,
  extensions
  // !code: moduleExports // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
