// ### Gestion du bouton de recherche ###
view.rechercheBtn.addEventListener("click", async function () {
    document.getElementById("spinner").classList.remove("hide");
    document.getElementById("spinner").classList.add("spinner"); // Assurez-vous d'ajouter la classe spinner
    view.msgAttente.classList.remove("hide"); // On affiche un message d'attente pour l'utilisateur
    view.resultatTable.innerHTML = ""; // On met à 0 la table à chaque nouvelles recherche

    // Analyse et traitement de la ou les chaînes transmises
    const chainesSouhaitees = view.recherchaines.value; // Correspond aux chaînes saisi par l'utilisateur
    let nbClipsSouhaite = view.rechercheClipsSelect.value; // Correspond au nombre de clips que l'utilisateur souhaite voir
    let tempsPerdu = 0; // Compteur pour déterminer le temps perdu par l'utilisateur

    if (!nbClipsSouhaite) {
        nbClipsSouhaite = 15; // Si l'utilisateur ne choisis pas de nombre de clips par défaut ce sera 15 clips twitch.
    }

    let chaines;
    if (chainesSouhaitees != ""){
        chaines = chainesSouhaitees.split(","); // Sépare les chaînes en un tableau.
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
            let ligne = creationLigne(clipInfo.url , clipInfo.title , clipInfo.duration);
            
            //Ajout de la ligne au tableau.
            tcorps.appendChild(ligne);
            console.log("fin de la boucle chaine");

            //Mise à jour de la  valeur du temps 
            tempsPerdu += clipInfo.duration;
        }

        if (localStorage.getItem(memoryString) == null){
            localStorage.setItem(memoryString , JSON.stringify(clipsInfo));
        }
        
    }


    //Affichage du temps total perdu
    let tcorps = view.resultatTable;
    //Création de la ligne du tableau
    let ligne = document.createElement("tr");

    //Création de la première colonne avec un texte
    let celluleTexte = document.createElement("td");
    let texte = document.createElement("p");
    texte.textContent = "Le temps que vous pouvez perdre est de :";
    celluleTexte.appendChild(texte);

    //Création de la deuxième colonne avec la durée totale des clips
    let celluleDuree = document.createElement("td");
    celluleDuree.textContent = Math.trunc(tempsPerdu / 60) + " minutes";

    //Ajout des deux cellules à la ligne
    ligne.appendChild(celluleTexte);
    ligne.appendChild(celluleDuree);
    ligne.classList.add("ligne_tableau");

    //Ajout de la ligne au tableau.
    tcorps.appendChild(ligne);
    // Une fois la recherche terminée, cache le spinner
    document.getElementById("spinner").classList.add("hide");
    document.getElementById("spinner").classList.remove("spinner"); // Retire la classe spinner pour arrêter l'animation

    view.rechercheDiv.classList.add("hide");
    view.resultatDiv.classList.remove("hide");
});

view.favorisBtn.addEventListener("click", function() {
    afficherFavoris();
});


/**
 * Prends en paramètre le lien d'un clip , le titre du clip et le temps du clip.
 * Renvoie une ligne qui est composé d'un lien qui a pour texte le titre du clip et dans une autre colonne la durée de la vidéo
 */
function creationLigne(href , textContent1 , textContent2){
    //Création de la ligne du tableau
    let ligne = document.createElement("tr");
            
    //Création de la première colonne avec un lien
    let celluleLien = document.createElement("td");
    let lien = document.createElement("a");
    lien.href = href;
    lien.textContent = textContent1;
    lien.target = "_blank"; // Ouvre le lien dans un nouvel onglet
    celluleLien.appendChild(lien);

    //Création de la deuxième colonne avec la durée de la vidéo
    let celluleDuree = document.createElement("td");
    celluleDuree.textContent = textContent2 + " secondes";

    //Création de la troisième colonne pour le bouton des favoris
    let celluleFavoris = document.createElement("td");
    let favorisBtn = document.createElement("button");
    favorisBtn.classList.add("favoris_btn");
    favorisBtn.textContent = "+";
    favorisBtn.value = href;
    favorisBtn.addEventListener("click" , favorisClickListenner);
    celluleFavoris.appendChild(favorisBtn);

    //Ajout des deux cellules à la ligne
    ligne.appendChild(celluleLien);
    ligne.appendChild(celluleDuree);
    ligne.appendChild(celluleFavoris);
    ligne.classList.add("ligne_tableau");
    return ligne;
}

function afficherFavoris() {
    console.log("Affichage des favoris");
    let favorisString = localStorage.getItem('favoris');
    let favoris = favorisString ? favorisString.split(",").filter(Boolean) : []; // Sépare la chaîne en un tableau et filtre les valeurs vides
    view.resultatTable.innerHTML = ""; // Nettoie la table des résultats précédents

    if (favoris.length === 0) {
        view.resultatTable.innerHTML = "<tr><td>Aucun favori sauvegardé</td></tr>";
    } else {
        for (let favUrl of favoris) {
            let ligne = document.createElement("tr");
            let celluleLien = document.createElement("td");
            let lien = document.createElement("a");
            lien.href = favUrl;
            lien.textContent = favUrl; // Affiche l'URL comme texte du lien pour plus de clarté
            lien.target = "_blank";
            celluleLien.appendChild(lien);
            ligne.appendChild(celluleLien);
            view.resultatTable.appendChild(ligne);
        }
    }

    view.rechercheDiv.classList.add("hide");
    view.resultatDiv.classList.remove("hide");
    console.log("Fin de l'affichage des favoris");
}



view.accueilBtn.addEventListener("click" , function() {
    view.rechercheDiv.classList.remove("hide");
    view.resultatDiv.classList.add("hide");
    view.msgAttente.classList.add("hide");
});

/**
     * Situtaion différente en fonction du textContent du bouton
     * Si c'est un "+" cela signifie que le lien n'a pas été ajouté aux favoris
     * Si c'est un "x" cela signifie que le lien est présent dans les favoris
*/
let favorisClickListenner = function(event) {
    const value = event.target.value; // L'URL du clip
    let listeFavoris = localStorage.getItem("favoris");
    // Utilise filter(Boolean) pour éliminer les entrées vides dues à des virgules initiales ou finales
    let arrayFavoris = listeFavoris ? listeFavoris.split(",").filter(Boolean) : []; 

    if (event.target.textContent === "+") {
        // Ajouter aux favoris
        if (!arrayFavoris.includes(value)) {
            arrayFavoris.push(value);
            // Convertit le tableau en chaîne JSON avant de le sauvegarder
            localStorage.setItem("favoris", JSON.stringify(arrayFavoris));
            event.target.textContent = "x";
        }
    } else {
        // Retirer des favoris
        if (index > -1) {
            arrayFavoris.splice(index, 1);
            // Convertit le tableau mis à jour en chaîne JSON avant de le sauvegarder
            localStorage.setItem("favoris", JSON.stringify(arrayFavoris));
            event.target.textContent = "+";
        }
    }
}

let favorisClickListenner = function(event) {
    const value = event.target.value; // L'URL du clip
    let listeFavoris = localStorage.getItem("favoris");
    // Utilise filter(Boolean) pour éliminer les entrées vides dues à des virgules initiales ou finales
    let arrayFavoris = listeFavoris ? listeFavoris.split(",").filter(Boolean) : []; 

    if (event.target.textContent === "+") {
        // Ajouter aux favoris si pas déjà présent
        if (!arrayFavoris.includes(value)) {
            arrayFavoris.push(value);
            localStorage.setItem("favoris", arrayFavoris.join(",")); // Sauvegarde en convertissant le tableau en chaîne
            event.target.textContent = "x"; // Changez le bouton pour indiquer que l'élément est maintenant un favori
        }
    } else {
        // Retirer des favoris
        const index = arrayFavoris.indexOf(value);
        if (index > -1) {
            arrayFavoris.splice(index, 1); // Retire l'URL du tableau
            localStorage.setItem("favoris", arrayFavoris.join(",")); // Sauvegarde les changements
            event.target.textContent = "+"; // Changez le bouton pour indiquer que l'élément peut être ajouté aux favoris
        }
    }
}
