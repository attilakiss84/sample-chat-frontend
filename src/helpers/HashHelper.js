import md5 from 'md5';

const HashHelper = {
  generateThreadId: function(participants, currentUserId) {
    var otherParticipants = participants.filter(userId => currentUserId !== userId);
    var hash;

    if (otherParticipants.length === 1) {
      hash = md5(otherParticipants[0]);
    } else {
      let currentTime = new Date().getTime();
      hash = md5(participants.join('') + currentTime);
    }

    return hash.substring(0, 8);
  }
};

export default HashHelper;
