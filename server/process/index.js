const recursive = require('recursive-readdir');
const path = require('path');

/*recursive(path.resolve('../../myTestsStub/func/')).then(result=>{
  console.log(result);
});*/

class Processor{
  constructor(workingDir){
    this.workDirectory = workingDir;
  }
  getTestFiles(type){
    return recursive(path.resolve(path.join(this.workDirectory,type)))//@todo catch section!!!!!
  }
}
module.exports = Processor;
