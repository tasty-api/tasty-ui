const exp = require('./index.js');

let eexp = new exp('../../myTestsStub');
eexp.getTestFiles('load').then(res=>{
  console.log(res);
});
