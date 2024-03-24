// ### Gestion du bouton de recherche ###
view.rechercheBtn.addEventListener("click" , async function() {
    const pseudoTwitch = document.getElementById('pseudoTwitch').value; // Récupère le pseudo entré
    let accessToken = await getAccessToken();
    let userId = await getUserId(pseudoTwitch , accessToken); // Utilise le pseudo entré
    let clipIds = await getClipIds(userId , accessToken);
    let clipsInfo = await getClipsInfo(clipIds , accessToken);

    let tcorps = document.getElementById("resultat_clips"); // Assurez-vous que cet ID correspond à votre <tbody>
    tcorps.innerHTML = ''; // Efface les résultats précédents avant d'afficher les nouveaux

    for (let clipInfo of clipsInfo){
        //Création de la ligne du tableau
        let ligne = document.createElement("tr");
        
        //Création de la première colonne avec un lien
        let celluleLien = document.createElement("td");
        let lien = document.createElement("a");
        lien.href = clipInfo.url;
        lien.textContent = clipInfo.url;
        lien.target = "_blank"; // Ouvre le lien dans un nouvel onglet
        celluleLien.appendChild(lien);

        //Création de la deuxième colonne avec la durée de la vidéo
        let celluleDuree = document.createElement("td");
        celluleDuree.textContent = clipInfo.duration + " secondes";

        //Ajout des deux cellules à la ligne
        ligne.appendChild(celluleLien);
        ligne.appendChild(celluleDuree);

        //Ajout de la ligne au tableau.
        tcorps.appendChild(ligne);
    }

    view.rechercheDiv.classList.add("hide");
    view.resultatDiv.classList.remove("hide");
})
