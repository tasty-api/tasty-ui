const config = require('./config');
const axios = require('axios');

class Request{
  constructor()
  {

  }
  getTypesOfTests(){
    const address = config.addresses.testing.types;
    return axios.get(address).then(response=>{
      return response.data;
    });
  }
  getTests(){
    const address = config.addresses.testing.tests;
    return axios.get(address).then(response=>{
      return response.data;
    });
  }
  getMain(){
    return Promise.resolve(1);
  }
  runTests({type,tests}){
      const address = config.addresses.testing.runTests;
      return axios.post(address,{type,tests}).then(response=>{
        return response.data;
      });
  }
}
module.exports = new Request();
