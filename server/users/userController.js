var User = require('./userModel.js');
Q = require('q');

var findUser = Q.nbind(User.findOne, User);
var createUser = Q.nbind(User.create, User);

module.exports = {

  createOrFindOne: function (profile, cb) {
    var fbId = profile.id;
    var name = profile.displayName;
    var picture = profile.photos[0].value;
    var friends = profile._json.friends.data.map(function(friend) {
      return {fbId: friend.id}; 
    });

    findUser({fbId: fbId})
      .then(function (match) {
        //if there's no match, we want to create a new user 
        if (match === null) {
          var newUser = {
            name: name,
            fbId: fbId,
            picture: picture,
            friends: friends
          };
          createUser(newUser)
          .then(function(user){
            cb(null, user);
          })
          .catch(function(err){
            cb(err);
          })
        } else {// if user already exists, update user's friends and prof pic in the database
          match.friends = friends;
          match.picture = picture;
          match.save(function (err) {
              if (err){
                return handleError(err);
              } 
            });
          cb(null, match);
        }
      })
      .catch(function (error) {
        cb(error);
      });
    }

};
