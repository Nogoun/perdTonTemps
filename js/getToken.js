const https = require("https");

const CLIENT_ID = "umzjha43644any1oau4komgf4r6ppw";
const CLIENT_SECRET = "la906lqfu37qwevq0w784bdqjfxsg1";
const REDIRECT_URI = "https://nogoun.github.io/perdTonTemps/clip.html";
const grant_type = "client_credentials"; // Type de l'authentification

const options = {
  hostname: "id.twitch.tv",
  path: `/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=${grant_type}&redirect_uri=${REDIRECT_URI}`,
  method: "POST",
};

const req = https.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    console.log(JSON.parse(data));
  });
});

console.log("requete envoyer");

req.on("error", (e) => {
  console.error(e);
});

req.end();

console.log("requete terminé");
