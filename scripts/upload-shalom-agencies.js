const fs = require('fs');
const axios = require('axios');

const data = JSON.parse(fs.readFileSync('./data/agencias-shalom.json', 'utf8'));

async function uploadAgencies() {
  for (const agency of data) {
    try {
      await axios.post('http://localhost:1337/api/shaloms', {
        data: agency
      }, {
        headers: {
          'Authorization': 'Bearer 2cd7f25701565024411266d9f410d2f365669ce314bb606a9c42f2b9f2f57ea4f600cf0561e5e45fd10cc46041e47b77005de3fcf67a568a6c1c7420e453b45a9f19dca493bac8801d6c07eafef0688b94d2587172a5ff9b342accae529dda5283f2c3c70857d707492f79bdd4278c0f7e3cda51dfd6b32f846f74d87467db5c'
        }
      });
      console.log(`Uploaded agency: ${agency.nombre}`);
    } catch (error) {
      console.error(`Error uploading agency ${agency.nombre}:`, error.message);
    }
  }
}

uploadAgencies();
