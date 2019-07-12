const express = require('express');
const path = require('path');
module.exports = function router(Router) {
  const customRouter = express.Router();
  customRouter.get('/', (req, res) => {
    //console.log('request: ',req);
    const mapFunc = (elt) => {
      return {path: elt, name: path.basename(elt)};
    };
    Router.getTestFiles('func').then(resultFunc => {
      Router.getTestFiles('load').then(resultLoad => {
        res.json({
          functional: resultFunc.map(mapFunc),
          load: resultLoad.map(mapFunc)
        });
      });
    });
  });
  customRouter.get('/types/', (req, res) => {
    //console.log('request: ',req);
    res.json({
      types: ["functional", "load"]
    })
  });
  customRouter.post('/run/', (req, res) => {
    //@TODO this is a stub!!!
    //@todo set different reports for functional and load tests
    const {type} = req.body;
    console.log('type:--->', type);
    //@todo custom logic based on type of test
    let strF = '';
    switch (type) {
      case 'functional':
        strF='func';
        break;
      case 'load':
        strF='load';
        break;
      default:
        break;
    }
    // simulation of test duration
    setTimeout(() => {
      //console.log('executed tests!');
      //res.json({done:true});
      console.log('file to send: ',path.resolve(path.join(process.cwd(), 'logs', strF+'_log.html')));
      res.sendFile(path.resolve(path.join(process.cwd(), 'logs', strF+'_log.html')));
    }, 1000);
  });
  return customRouter;
};
