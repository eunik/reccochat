const router = require('express').Router();
const models = require('../models');
const Friends = models.Friends;

// curl -d "userId=1&friendId=4" -X POST http://localhost:8000/friend/add
router.post('/add', (req, res) => {
  Friends.findOrCreate({where: {
    userId: req.body.userId,
    friendId: req.body.friendId
  }}).spread((entryId1, created) => {
    if(created){
      Friends.findOrCreate({where: {
        userId: req.body.friendId,
        friendId: req.body.userId
      }}).spread((entryId2, created) => {
        if(created){
          res.json({success:1, entryId1:entryId1.id, entryId2:entryId2.id});
        } else{
          res.json({success:0, entryId1:null, entryId2: null});
        };
      });
    } else{
          res.json({success:0, entryId1:null, entryId2: null});
    };
  });
});

// curl 'http://localhost:8000/friend/get/id/1'
router.get('/get/id/:id', (req, res) => {
   Friends.findAll({attributes: ['friendId'], where:{userId: req.params.id}, raw: true}).then(friends => {
    res.json({success:1, id:req.params.id, friends:friends})
    }). catch(() => {
      res.json({success:0, id:null, interest:null});
  });
});

module.exports = router;