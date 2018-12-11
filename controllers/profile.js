const router = require('express').Router();
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../models');
const Users = models.Users;
const Friends = models.Friends;
const Matches = models.MatchRelation;

var dict = {};

// returns value from array of dictionary
function mapper(array, field) {
	return array.map(x => x[field]);
}

// curl 'http://localhost:8000/profile/users/id/1'
router.get('/users/id/:id', (req, res) => {
    // if the request has the user object, go to the user page
    Users.findById(req.params.id).then(user => {
		Friends.findAll({attributes:['friendId'], where:{userId: req.params.id}, raw: true}).then(friendIds => {
			Matches.findAll({attributes: ['secondUserId'], where: {firstUserId: req.params.id}, raw: true}).then(matchIds => {
			
				dict.success = 1;
				dict.username = user.username;
		    	dict.email = user.email;
			
				if(friendIds.length){
					var friendIdArray = mapper(friendIds, 'friendId'); 
					Users.findAll({attributes:['id', 'username'], raw: true, where:{
		    			id: {[Op.in]: friendIdArray}
					}}).then(friends =>{
						dict.friends = friends;
					});
				} else {
					dict.friends = [{id: null, username: null}];
				}

				if(matchIds.length){
					var matchIdArray = mapper(matchIds, 'secondUserId');
					Users.findAll({attributes:['id', 'username'], raw: true, where:{
		    			id: {[Op.in]: matchIdArray}
					}}).then(matches =>{
						dict.matches = matches;
						res.json(dict);
					});
				} else {
					dict.matches = [{id: null, username: null}];
					res.json(dict);
				}

			}).catch((err)=>{
				res.json({success:0, username: null, friends:[], matches:[]});
			});
		}).catch((err)=>{
			res.json({success:0, username: null, friends:[], matches:[]});
		});
	}).catch((err)=>{
		res.json({success:0, username: null, friends:[], matches:[]});
	});
});

module.exports = router;
