module.exports = {
  /**
   * Checks if a path is protected
   * @param {string} path The path to be checked
   * @param {Array} paths Paths from the app configuration
   */
  isProtectedPath: (context) => {
    const unProtectedPaths = context.app.get('unProtectedPaths');
    return unProtectedPaths.some(p => p.includes(context.path));
  }
};
