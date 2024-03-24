const axios = require("axios");
const express = require("express");
const { url } = require("inspector");

const CLIENT_ID = "umzjha43644any1oau4komgf4r6ppw";
const CLIENT_SECRET = "la906lqfu37qwevq0w784bdqjfxsg1";
const userName = "Etoiles"; // Le nom d'utilisateur Twitch pour lequel vous souhaitez récupérer l'ID

// Fonction pour obtenir un token d'accès
async function getAccessToken() {
  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("grant_type", "client_credentials");

  try {
    const response = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      params
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Erreur lors de la récupération du token:", error);
  }
}

// Fonction pour obtenir l'ID d'un utilisateur
async function getUserId(userName, accessToken) {
  try {
    const response = await axios.get(
      `https://api.twitch.tv/helix/users?login=${userName}`,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data[0].id;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'ID d'utilisateur:",
      error
    );
  }
}

// Fonction pour obtenir l'ID d'un clip
async function getClipId(broadcasterId, accessToken) {
  try {
    const response = await axios.get(
      `https://api.twitch.tv/helix/clips?broadcaster_id=${broadcasterId}`,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.data.length > 0 ? response.data.data[0].id : null; // Retourne l'ID du premier clip trouvé
  } catch (error) {
    console.error("Erreur lors de la récupération de l'ID du clip:", error);
  }
}

// Fonction pour obtenir les informations d'un clip
async function getClipInfo(clipId, accessToken) {
  try {
    const response = await axios.get(
      `https://api.twitch.tv/helix/clips?id=${clipId}`,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    url = response.data.data[0].url;
    duree = response.data.data[0].duration;
    info = [url, duree];
    return info;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations du clip:",
      error
    );
  }
}

async function main() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    console.log("Token d'accès non obtenu.");
    return;
  }

  const userId = await getUserId(userName, accessToken);
  if (!userId) {
    console.log(`ID d'utilisateur non trouvé pour ${userName}.`);
    return;
  }

  const clipId = await getClipId(userId, accessToken);
  if (!clipId) {
    console.log(`Aucun clip trouvé pour l'utilisateur ${userName}.`);
    return;
  }

  await getClipInfo(clipId, accessToken);
}

main();
