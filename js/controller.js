// ### Gestion du bouton de recherche ###
view.rechercheBtn.addEventListener("click" , async function() {
    let accessToken = await getAccessToken();
    let userId = await getUserId("Etoiles" , accessToken);
    let clipId = await getClipId(userId , accessToken);
    let clipInfo = await getClipInfo(clipId , accessToken);


    view.rechercheDiv.classList.add("hide");
    view.resultatDiv.classList.remove("hide");
})