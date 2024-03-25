// ### Gestion du bouton de recherche ###
view.rechercheBtn.addEventListener("click" , async function() {
    view.msgAttente.classList.remove("hide"); // On affiche un message d'attente pour l'utilisateur
    view.resultatTable.innerHTML = "";  // On met à 0 la table à chaque nouvelles recherche

    // Analyse et traitement de la ou les chaînes transmises
    const chainesSouhaitees = view.recherchaines.value; // Correspond aux chaînes saisi par l'utilisateur
    let nbClipsSouhaite = view.rechercheClipsSelect.value;  // Correspond au nombre de clips que l'utilisateur souhaite voir
    let tempsPerdu = 0; // Compteur pour déterminer le temps perdu par l'utilisateur

    if (!nbClipsSouhaite){
        nbClipsSouhaite = 15; // Si l'utilisateur ne choisis pas de nombre de clips par défaut ce sera 15 clips twitch.
    }

    let chaines;
    if (chainesSouhaitees != ""){
        chaines = chainesSouhaitees.split(","); // Sépare les chaînes par des virgules
    }else {
        chaines = ["Mastu","gotaga"];
    }

    let accessToken = await getAccessToken();

    for (let chaine  of chaines){
        // Mémorisation de la chaîne pour ne pas refaire les mêmes requetes
        let memoryString = chaine+nbClipsSouhaite;
        console.log(memoryString);
        let clipsInfo;
        if (localStorage.getItem(memoryString) != null){
            clipsInfo = JSON.parse(localStorage.getItem(memoryString));
        }else {
            let userId = await getUserId(chaine , accessToken); // Utilise le pseudo entré
            let clipIds = await getClipIds(userId , accessToken , nbClipsSouhaite);
            clipsInfo = await getClipsInfo(clipIds , accessToken);
        }
        let tcorps = view.resultatTable;

        for (let clipInfo of clipsInfo){
            //Création de la ligne du tableau
            let ligne = document.createElement("tr");
            
            //Création de la première colonne avec un lien
            let celluleLien = document.createElement("td");
            let lien = document.createElement("a");
            lien.href = clipInfo.url;
            lien.textContent = clipInfo.title;
            lien.target = "_blank"; // Ouvre le lien dans un nouvel onglet
            celluleLien.appendChild(lien);

            //Création de la deuxième colonne avec la durée de la vidéo
            let celluleDuree = document.createElement("td");
            celluleDuree.textContent = clipInfo.duration + " secondes";

            //Ajout des deux cellules à la ligne
            ligne.appendChild(celluleLien);
            ligne.appendChild(celluleDuree);
            ligne.classList.add("ligne_tableau");


            //Ajout de la ligne au tableau.
            tcorps.appendChild(ligne);
            console.log("fin de la boucle chaine");

            //Mise à jour de la  valeur du temps 
            tempsPerdu += clipInfo.duration;
        }
        
    }
    view.rechercheDiv.classList.add("hide");
    view.resultatDiv.classList.remove("hide");

        

    //Affichage du temps total perdu
    let tcorps = view.resultatTable; 
    //Création de la ligne du tableau
    let ligne = document.createElement("tr");
                    
    //Création de la première colonne avec un texte
    let celluleTexte = document.createElement("td");
    let texte = document.createElement("p");
    texte.textContent = "Le temps que vous avez perdu est de :";
    celluleTexte.appendChild(texte);

    //Création de la deuxième colonne avec la durée totale des clips
    let celluleDuree = document.createElement("td");
    celluleDuree.textContent = Math.trunc(tempsPerdu/60) + " minutes";

    //Ajout des deux cellules à la ligne
    ligne.appendChild(celluleTexte);
    ligne.appendChild(celluleDuree);
    ligne.classList.add("ligne_tableau");

    //Ajout de la ligne au tableau.
    tcorps.appendChild(ligne);
});



view.accueilBtn.addEventListener("click" , function() {
    view.rechercheDiv.classList.remove("hide");
    view.resultatDiv.classList.add("hide");
    view.msgAttente.classList.add("hide");
});


view.favorisBtn.addEventListener("click" , function () {

})
