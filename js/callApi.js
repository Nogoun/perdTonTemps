
  const CLIENT_ID = "umzjha43644any1oau4komgf4r6ppw";
  const CLIENT_SECRET = "la906lqfu37qwevq0w784bdqjfxsg1"; 
  const userName = "Etoiles";

  // Fonction pour obtenir un token d'accès
  async function getAccessToken() {
    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("grant_type", "client_credentials");

    try {
      const response = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        body: params,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du token");
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Erreur lors de la récupération du token:", error);
    }
  }

  // Fonction pour obtenir l'ID d'un utilisateur
  async function getUserId(userName, accessToken) {
    try {
      const response = await fetch(`https://api.twitch.tv/helix/users?login=${userName}`, {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de l'ID d'utilisateur");
      }

      const data = await response.json();
      return data.data[0].id;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'ID d'utilisateur:", error);
    }
  }

  // Fonction pour obtenir les ID de plusieurs clips
  async function getClipIds(broadcasterId, accessToken , nbClips)  {
    try {
      const response = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${broadcasterId}&first=${nbClips}`, { // Récupère jusqu'à 100 clips
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des ID des clips");
      }

      const data = await response.json();
      return data.data.map(clip => clip.id); // Retourne un tableau des ID de clips
    } catch (error) {
      console.error("Erreur lors de la récupération des ID des clips:", error);
    }
  }


  // Fonction pour obtenir les informations de plusieurs clips
  async function getClipsInfo(clipIds, accessToken) {
    const clipsInfo = [];

    for (const clipId of clipIds) {
      try {
        const response = await fetch(`https://api.twitch.tv/helix/clips?id=${clipId}`, {
          headers: {
            "Client-ID": CLIENT_ID,
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des informations du clip");
        }

        const data = await response.json();
        const clip = data.data[0];
        if (clip) {
          clipsInfo.push({ url: clip.url, duration: clip.duration , title: clip.title});
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des informations des clips:", error);
      }
    }

    return clipsInfo; // Retourne un tableau contenant les informations de chaque clip
  }


  async function main() {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.error("Token d'accès non obtenu.");
      return;
    }

    const broadcasterId = await getUserId(userName, accessToken);
    if (!broadcasterId) {
      console.error(`ID d'utilisateur non trouvé pour ${userName}.`);
      return;
    }

    const clipIds = await getClipIds(broadcasterId, accessToken);
    if (clipIds.length === 0) {
      console.error(`Aucun clip trouvé pour l'utilisateur ${userName}.`);
      return;
    }

    const clipsInfo = await getClipsInfo(clipIds, accessToken);
    console.log(clipsInfo); // Affiche les informations de tous les clips récupérés
  }

  main();
