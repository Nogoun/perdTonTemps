// ### Gestion du bouton de recherche ###
view.rechercheBtn.addEventListener("click" , async function() {
    let accessToken = await getAccessToken();
    let userId = await getUserId("Etoiles" , accessToken);
    let clipId = await getClipIds(userId , accessToken);
    let clipsInfo = await getClipsInfo(clipId , accessToken);


    let tcorps = view.resultatTable;
    for (let clipInfo of clipsInfo){
        //Création de la ligne du tableau
        let ligne = document.createElement("tr");
        
        //Création de la première colonne avec un lien
        let celluleLien = document.createElement("td");
        let lien = document.createElement("a");
        lien.href = clipInfo.url;
        lien.textContent = clipInfo.url;
        celluleLien.appendChild(lien);

        //Création de la deuxième colonne avec la durée de la vidéo
        let celluleTexte = document.createElement("td");
        celluleTexte.textContent = clipInfo.duration;

        //Ajout des deux cellules à la ligne
        ligne.appendChild(celluleLien);
        ligne.appendChild(celluleTexte);

        //Ajout de la ligne au tableau.
        tcorps.appendChild(ligne);
    }

    view.rechercheDiv.classList.add("hide");
    view.resultatDiv.classList.remove("hide");
})