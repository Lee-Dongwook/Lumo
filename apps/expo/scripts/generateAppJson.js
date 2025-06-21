const fs = require('fs');

const appConfig = {
  name: 'Lumo',
  displayName: 'Lumo',
};

fs.writeFileSync('app.json', JSON.stringify(appConfig, null, 2));
