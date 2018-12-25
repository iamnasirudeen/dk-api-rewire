// Define the Feathers schema for service `optionValues`. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

// Define the model using JSON-schema
let schema = {
  // !<DEFAULT> code: schema_header
  title: "OptionValues",
  description: "OptionValues database.",
  // !end
  // !code: schema_definitions // !end

  // Required fields.
  required: [
    // !code: schema_required
    "name",
    "author",
    "accountTypes"
    // !end
  ],
  // Fields with unique values.
  uniqueItemProperties: [
    // !code: schema_unique // !end
  ],

  // Fields in the model.
  properties: {
    // !code: schema_properties
    name: {},
    shortName: {},
    longName: {},
    option: { faker: { fk: "options:random" }, type: "ID", ref: "options" },
    author: { faker: { fk: "users:random" }, type: "ID", ref: "users" },
    accountTypes: {
      type: "array",
      items: { type: "ID" },
      ref: "accountTypes",
      uniqueItems: true,
      maxItems: 5,
      minItems: 1
    },
    displayOrder: { type: "number" },
    deletedAt: { type: "number", chance: { integer: { min: -1, max: -1 } } }
    // !end
  }
  // !code: schema_more // !end
};

// Define optional, non-JSON-schema extensions.
let extensions = {
  // GraphQL generation.
  graphql: {
    // !code: graphql_header
    name: "OptionValue",
    service: {
      sort: { _id: 1 }
    },
    // sql: {
    //   sqlTable: 'OptionValues',
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
