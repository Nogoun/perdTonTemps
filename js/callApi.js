const https = require("https");

const TOKEN = "oqk3uy0uudg1wggj34ew6fr4oxdixa";
const CLIENT_ID = "umzjha43644any1oau4komgf4r6ppw";
const clipId = "id_du_clip"; // Remplacez ceci par l'ID du clip que vous souhaitez récupérer

const options = {
  hostname: "api.twitch.tv",
  path: `/helix/clips?id=${clipId}`,
  method: "GET",
  headers: {
    "Client-ID": CLIENT_ID,
    Authorization: `Bearer ${TOKEN}`,
  },
};

const req = https.request(options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    const clipInfo = JSON.parse(data);
    console.log(clipInfo);
    // Ici, vous pouvez traiter les informations du clip comme vous le souhaitez
  });
});

req.on("error", (e) => {
  console.error(e);
});

req.end();
