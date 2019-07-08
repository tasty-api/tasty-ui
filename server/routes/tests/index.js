const express = require('express');
const path = require('path');
module.exports = function router(Router){
  const customRouter = express.Router();
  customRouter.get('/',(req,res)=>{
    //console.log('request: ',req);
    const mapFunc = (elt) =>{
        return {path:elt,name:path.basename(elt)};
    };
    Router.getTestFiles('func').then(resultFunc=>{
      Router.getTestFiles('load').then(resultLoad=>{
          res.json({
            functional:resultFunc.map(mapFunc),
            load: resultLoad.map(mapFunc)
          });
      });
    });
  });
  customRouter.get('/types/',(req,res)=>{
    //console.log('request: ',req);
    res.json({
      types:["functional","load"]
    })
  });
  customRouter.post('/run/',(req,res)=>{
    console.log('post request: ',req);
    setTimeout(()=>{
      console.log('executed tests!');
      res.json({done:true});
    },5000)
  });
  return customRouter;
};
