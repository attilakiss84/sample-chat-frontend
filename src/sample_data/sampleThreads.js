var threads = [];

function addThread(participants, name, profileImageUrl) {
  threads.push({
    participants: participants.map((userId) => { return userId + '@unity3d.im'; }).concat(['358449216979@unity3d.im']),
    name: name,
    isGroup: participants.length > 2,
    profileImageUrl: profileImageUrl
  });
}

// Results will be ["c9b3be03", "06db7dd8", "e4f67825", "dda17714", "e59b9196"]
for (let i = 1; i <= 5; i += 1) {
  addThread([i]);
}

addThread([1, 2, 3], 'Group 1-2-3', '/static/profile_red.png');
addThread([4, 5], 'Group 4-5');

export default threads;
