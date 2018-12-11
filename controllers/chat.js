const router = require('express').Router();
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

const models = require('../models');
const Chats = models.Chats;

// curl 'http://localhost:8000/chat
router.get('/', (req, res) => {
  res.send('OK');
});

// curl -d "firstUserId=1&secondUserId=4&message=MAMA" -X POST http://localhost:8000/chat/add
router.post('/add', (req, res) => {
  Chats.create({
    firstUserId: req.body.firstUserId,
    secondUserId: req.body.secondUserId,
    message: req.body.message
  }).then(entryId=> {
    res.json({success:1, id:entryId.id});
  }).catch(() =>{
    res.json({success:0, id:null});
  });
});

// curl 'http://localhost:8000/chat/get/firstUserId/1/secondUserId/4'
router.get('/get/firstUserId/:id1/secondUserId/:id2', (req, res) => {
  Chats.findAll({order:[['createdAt', 'ASC']], raw: true, where:{
    [Op.or]: [
      {
        firstUserId: req.params.id1,
        secondUserId: req.params.id2
      },
      {
        firstUserId: req.params.id2,
        secondUserId: req.params.id1
      }
    ]
  }}).then(chat => {
    res.json({success:1, chat:chat})
  }).catch(() => {
    res.json({success:0, chat:null});
  });
});

module.exports = router;