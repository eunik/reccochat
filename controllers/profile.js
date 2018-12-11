const router = require('express').Router();
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../models');
const Users = models.Users;
const Friends = models.Friends;
const Matches = models.MatchRelation;
const UserInterests = models.UserInterests;

var dict = {};

// returns value from array of dictionary
function mapper(array, field) {
	return array.map(x => x[field]);
}

// curl -d "id=1" -X DELETE http://localhost:8000/profile/delete
router.delete('/delete', (req, res) => {
	Users.destroy({where: {id: req.body.id}
	}).catch(() => {
		console.log({success:0, message: 'no users'});
	});
  	UserInterests.destroy({where: {interestId: req.body.interestId}
	}).catch(() => {
		console.log({success:0, message: 'no interest'});
	});
  	Friends.destroy({
	    where: { [Op.or]: [
			{userId: req.body.id},
			{friendId: req.body.userId}
	    ]}
	}).catch(() => {
		console.log({success:0, message: 'no friends'});
	});
  	Matches.destroy({
    	where: { [Op.or]: [
      		{firstUserId: req.body.id},
      		{secondUserId: req.body.id}
		]}
  	}).catch(() => {
  		console.log({success:0, message: 'no matches'});
  	});
	res.json({success:1});
});

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
