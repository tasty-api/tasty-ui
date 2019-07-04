const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
  console.log('request: ',req);
  res.json({
      tests:{
        functional:{a:5,b:"abc",c:{a:[1,2,3,4,5]}},
        load:{load:true}
      }
  });
});
router.get('/types/',(req,res)=>{
  console.log('request: ',req);
  res.json({
    types:["functional","load"]
  })
});

module.exports = router;
