/* eslint-disable */
const { Ability } = require("@casl/ability");

const basicUserRules = require("./basic-user-rules");
const mediaModeratorRules = require("./media-moderator-rules");
const usersModeratorRules = require("./users-moderator-rules");
const postsModeratorRules = require("./posts-moderator-rules");
const adminRules = require("./admin-rules");
const superAdminRules = require("./super-admin-rules");

// Aliases for feathers services method names.
Ability.addAlias("update", "patch");
Ability.addAlias("read", ["get", "find"]);
Ability.addAlias("remove", "delete");
Ability.addAlias("modify", ["update", "patch"]);
Ability.addAlias("create", "add");
Ability.addAlias("manage", ["update", "remove", "patch"]);

// Define abilities from here
function defineAbilitiesFor(user, roles) {
  // Get the id of the roles
  const usersModerator = roles["Users Moderator"];
  const mediaModerator = roles["Media Moderator"];
  const postsModerator = roles["Posts Moderator"];
  const admin = roles["Admin"];
  const superAdmin = roles["Super Admin"];

  let rulesForRole = {
    rulesForActions: [],
    rulesForFields: []
  };

  if (user) {
    switch (user.roleId.toString()) {
      // Only have additional power to moderate users
      case usersModerator:
        rulesForRole = usersModeratorRules;
        break;
      case mediaModerator:
        // Only have powers to moderate media
        rulesForRole = mediaModeratorRules;
        break;
      case postsModerator:
        // Only have powers to moderate posts
        rulesForRole = postsModeratorRules;
        break;
      case admin:
        // Should have powers of all the moderators and not the admin
        rulesForRole = adminRules;
        break;
      case superAdmin:
        // Abilities for the super admin
        rulesForRole = superAdminRules;
        break;
      default:
        // Basic permissions that all the users should have
        rulesForRole = basicUserRules;
        break;
    }
  }

  return {
    actionsAbility: new Ability(rulesForRole.rulesForActions(user)),
    fieldsAbility: new Ability(rulesForRole.rulesForFields(user))
  };
}

module.exports = defineAbilitiesFor;
