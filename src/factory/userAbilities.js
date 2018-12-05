/* eslint-disable */
const {
  AbilityBuilder,
  Ability
} = require('casl');
// Aliases for feathers services method names.
Ability.addAlias('update', 'patch');
Ability.addAlias('read', ['get', 'find']);
Ability.addAlias('remove', 'delete');
Ability.addAlias('modify', ['update', 'patch']);
Ability.addAlias('create', 'add');
Ability.addAlias('moderate', ['update', 'remove', 'patch']);

// Define abilities from here
function defineAbilitiesFor(user, roles) {
  // Get the id of the roles
  const usersModerator = roles['Users Moderator'];
  const mediaModerator = roles['Media Moderator'];
  const postsModerator = roles['Posts Moderator'];
  const admin = roles['Admin'];
  const superAdmin = roles['Super Admin'];

  let abilityDefiner;
  if (user) {
    switch (user.roleId) {
      // Only have additional power to moderate users
      case usersModerator:
        abilityDefiner = usersModeratorAbilities;
        break;
      case mediaModerator:
        // Only have powers to moderate media
        abilityDefiner = mediaModeratorAbilities;
        break;
      case postsModerator:
        // Only have powers to moderate posts
        abilityDefiner = postsModeratorAbilities;
        break;
      case admin:
        // Should have powers of all the moderators and not the admin
        abilityDefiner = adminAbilities;
        break;
      case superAdmin:
        // Abilities for the super admin
        abilityDefiner = superAdminAbilities;
        break;
      default:
        // Basic permissions that all the users should have
        abilityDefiner = baseUserAbilities;
        break;
    }
  }
  abilityDefiner = abilityDefiner || (() => []);
  let {
    rules,
    can,
    cannot
  } = AbilityBuilder.extract();
  abilityDefiner(can, cannot, user);
  return new Ability(rules || []);
}

// Can do basic users and moderate users
const usersModeratorAbilities = (can, cannot, user, addUserAbilities = true) => {
  (addUserAbilities && baseUserAbilities(can, cannot, user));
  can('moderate', 'users'); // Update And Delete

};
// Can do basic users and moderate media
const mediaModeratorAbilities = (can, cannot, user, addUserAbilities = true) => {
  (addUserAbilities && baseUserAbilities(can, cannot, user));

};
// Can do basic users and moderate posts
const postsModeratorAbilities = (can, cannot, user, addUserAbilities = true) => {
  (addUserAbilities && baseUserAbilities(can, cannot, user));

};
// Combines all the moderators and basic user
const adminAbilities = (can, cannot, user, addUserAbilities = false) => {
  baseUserAbilities(can, cannot, user);
  usersModeratorAbilities(can, cannot, user, addUserAbilities);
  mediaModeratorAbilities(can, cannot, user, addUserAbilities);
  postsModeratorAbilities(can, cannot, user, addUserAbilities);
};
// Combines both basic user and admin, then adding extra feature
const superAdminAbilities = (can, cannot, user, addUserAbilities = false) => {
  baseUserAbilities(can, cannot, user);
  adminAbilities(can, cannot, user, addUserAbilities);
  can('read', 'all'); // Allow reading all subjects
  can('create', 'all');
  can('moderate', 'all');
  can('remove', 'all');
};

const baseUserAbilities = (can, cannot, user) => {
  // Only modify current user data
  can(['modify'], 'users', {
    _id: user._id
  });
  cannot(['modify'], 'users', ['roleId', 'deletedAt']);
  cannot('remove', 'users');
  // can('remove', 'users');
  can('read', 'users');
};

module.exports = defineAbilitiesFor;
