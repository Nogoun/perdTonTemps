// ### Gestion du bouton de recherche ###
view.rechercheBtn.addEventListener("click" , async function() {
    let accessToken = await getAccessToken();
    let pseudo = view.recherchaines.value;
    let userId = await getUserId(pseudo , accessToken);
    let clipId = await getClipIds(userId , accessToken);
    let clipsInfo = await getClipsInfo(clipId , accessToken);


    let coprs = view.body;
    for (let clipInfo of clipsInfo){
        let ligne = document.createElement("tr");
        
        //Création de la première colonne avec un lien
        let celluleLien = document.createElement("td")
        let lien = document.createElement("a");
        lien.href = clipInfo.url
        celluleLien.appendChild(lien);

        //Création de la deuxième colonne avec la durée de la vidéo
        let celluleTexte = document.createElement("td");
        celluleTexte.textContent = clipInfo.duration;
    }

    view.rechercheDiv.classList.add("hide");
    view.resultatDiv.classList.remove("hide");
})