var profiles = [];

function addProfile(id, profileImage) {
  profiles.push({
    id: id + '@unity3d.im',
    name: 'User ' + id,
    profileImageUrl: profileImage ? '/static/profile_' + profileImage + '.png' : undefined
  });
}

const profileImages = ['blue', 'cyan', 'magenta', 'orange', 'red', 'yellow'];
const numberOfProfiles = 5;

for (let i = 0; i < numberOfProfiles - 1 && i < profileImages.length; i += 1) {
  addProfile(i + 1, profileImages[i]);
}

addProfile(numberOfProfiles);

export default profiles;
