var userId = '';

module.exports = {
  getSettings: () => {
    return {
      userId: userId
    };
  },
  setUserId: (newUserId) => {
    userId = newUserId;
  }
};
