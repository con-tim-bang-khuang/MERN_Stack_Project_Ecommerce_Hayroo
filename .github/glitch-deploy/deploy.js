const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://c7b41603-e65a-4788-b3fd-5b9e27760bf1@api.glitch.com/git/ahead-river-rubidium|https://c7b41603-e65a-4788-b3fd-5b9e27760bf1@api.glitch.com/git/military-hungry-pumpkin|https://c7b41603-e65a-4788-b3fd-5b9e27760bf1@api.glitch.com/git/thirsty-carnation-riverbed|https://c7b41603-e65a-4788-b3fd-5b9e27760bf1@api.glitch.com/git/skillful-concise-dirigible|https://c7b41603-e65a-4788-b3fd-5b9e27760bf1@api.glitch.com/git/boulder-majestic-glade|https://c7b41603-e65a-4788-b3fd-5b9e27760bf1@api.glitch.com/git/literate-zany-sauce|https://c7b41603-e65a-4788-b3fd-5b9e27760bf1@api.glitch.com/git/resisted-paper-theory|https://c7b41603-e65a-4788-b3fd-5b9e27760bf1@api.glitch.com/git/adorable-field-throne|https://c7b41603-e65a-4788-b3fd-5b9e27760bf1@api.glitch.com/git/windy-lime-pyrite|https://c7b41603-e65a-4788-b3fd-5b9e27760bf1@api.glitch.com/git/quark-fate-ferryboat|https://c7b41603-e65a-4788-b3fd-5b9e27760bf1@api.glitch.com/git/octagonal-wandering-mass|https://c7b41603-e65a-4788-b3fd-5b9e27760bf1@api.glitch.com/git/scratch-marmalade-bank|https://c7b41603-e65a-4788-b3fd-5b9e27760bf1@api.glitch.com/git/marble-purrfect-roof|https://c7b41603-e65a-4788-b3fd-5b9e27760bf1@api.glitch.com/git/scented-massive-mink`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();