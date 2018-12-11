const router = require('express').Router();
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../models');
const Users = models.Users;
const Friends = models.Friends;
const Interests = models.Interests;
const UserInterests = models.UserInterests;
const Matches = models.MatchRelation;

var ids = [];

// returns value from array of dictionary
function mapper(array, field) {
	return array.map(x => x[field]);
}

// curl -X POST http://localhost:8000/match/generate
router.post('/generate', (req, res) => {
	Matches.destroy({truncate: true, restartIdentity: true});
	// First get all possible users
	Users.findAll({attributes: ['id'], raw: true}).then(users => {
		// must have at least 2 people to match
		if(users.length > 1){
	    	users.forEach(function(user) {
    			// Then get their interests
	        	UserInterests.findAll({attributes: ['interestId'], where:{userId : user.id}, raw: true}).then(myInterest =>{
	        		// must have an interest
	        		if(myInterest.length > 0){
		        		// Then get all their friends
		    			Friends.findAll({attributes: ['friendId'], where:{userId: user.id}, raw: true}).then(myFriend =>{
		    				// Find everyone with that interest, except himself or his friends
		        			var interestArray = mapper(myInterest, 'interestId');
		        			var friendArray = mapper(myFriend, 'friendId');
			        		UserInterests.findAll({attributes: ['userId'], raw: true, where:{
			        			interestId: {[Op.in]: interestArray},
			        			userId: {
			        				[Op.and]: {
				        				[Op.ne]: user.id,
									    [Op.notIn]: friendArray
									}
								}
							}}).then(matchedIds =>{
								if(matchedIds){
									// We want to find amount of matched interest of the matching person
									matchedIds.forEach(function(myMatchedId) {
										UserInterests.findAll({
											attributes: ['interestId'],
											raw: true,
											where:{
												userId : myMatchedId.userId,
												interestId: {[Op.in]: interestArray},
											}
										}).then((matchPercent) => {
											// We want to create the matched interest
											console.log(matchPercent.length, myInterest.length);
											Matches.create({
												matchPercentage: (matchPercent.length/myInterest.length)*100,
												firstUserId: user.id,
												secondUserId: myMatchedId.userId
											}).catch(() => {
												res.json({success: 0, message: 'something went wrong creating new matched instance'});
											});
										});
									});
								} else{
									console.log({success: 0, message: 'No matches'});
								};
							}).catch((err) => {
								console.log(err,{success: 0, message: 'something went wrong with searching for new match ids'});
							});
						}).catch((err) => {
							console.log({err,success: 0, message: 'something went wrong with finding your interests'});
						});
	    			} else{
			    		console.log({success: 0, message: 'needs at least 1 interest'});
			    	};
		        });
    		});
	    } else{
    		res.json({success: 0, message: 'needs more people'});
    	};
    });
    res.json({success: 1, message: 'matching run has been successful'});
});
  
// curl 'http://localhost:8000/match/get/id/1'
var name = "";
var matchArray = [];

router.get('/get/id/:id', (req, res) => {
	Matches.findAll({ where: {firstUserId: req.params.id}}).then(matches => {
		if(matches.length){
			matches.id.forEach(function(myMatchIds) {
				Users.findById(myMatchIds.id).then(match => {
	    			name = match.username;
				});
				matchArray.push({
	 				id: myMatchIds.secondUserId,
	 				username: name
				});
			});
		} else {matchArray = [{id: null, username: null}];};
		res.json({success: 1, matches: matchArray});
	}).catch(()=>{
		res.json({success: 0, matches: null})
	});
});


module.exports = router;
