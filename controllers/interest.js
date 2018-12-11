const router = require('express').Router();
const models = require('../models');
const Interests = models.Interests;
const UserInterests = models.UserInterests;

// curl -d "userId=1&interestCategory=artist&interest=Micheal+Jackson" -X POST http://localhost:8000/interest/create
router.post('/create', (req, res) => {
  Interests.findOrCreate({where: {
    interest: req.body.interest,
    interestCategory: req.body.interestCategory
  }});

  Interests.findOne({where:{interest: req.body.interest}}).then(interest => {
    UserInterests.findOrCreate({where:{
      userId: req.body.userId,
      interestId: interest.id
    }}).spread((userInterest, created) => {
      if(created){
        res.json({success:1, message:'Initialized interest'});
      } else{
      res.json({success:0, message:'Could not initialize interest'});
      }
    });
  });
});

// curl -d "interestCategory=artist&interest=Micheal+Jackson" -X POST http://localhost:8000/interest/add
router.post('/add', (req, res) => {
  Interests.findOrCreate({where: {
    interest: req.body.interest,
    interestCategory: req.body.interestCategory
  }}).spread((interest, created) => {
    if(created){
      res.json({success:1, id:interest.id});
    } else{
      res.json({success:0, id:null});
    };
  });
});

// curl 'http://localhost:8000/interest/get/id/1'
router.get('/get/id/:id', (req, res) => {
   Interests.findOne({where:{interest: req.params.id}}).then(interest => {
    res.json({success:1, id:interest.id, interest:interest.interest, interestCategory:interest.interestCategory})
    }). catch(() => {
      res.json({success:0, id:null, interest:null, interestCategory: null});
  });
});

module.exports = router;