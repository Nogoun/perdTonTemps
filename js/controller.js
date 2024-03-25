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
let favorisClickListenner = function (event) {
    const value = event.target.value;
    
    
    if (event.target.textContent == "+"){
        let listeFavoris = localStorage.getItem("favoris");
        
        
        if (listeFavoris == null){
            localStorage.setItem("favoris" , [value]);
        }else {
            let present = false;
            arrayFavoris = listeFavoris.split(",");
            for (favori of arrayFavoris){
                
                if (favori == value){
                    present = true;
                }
            }
            if (!present){
                arrayFavoris.push(value);
                localStorage.setItem("favoris" , arrayFavoris);
            }

        }
        event.target.textContent = "x";
    }else {
        let listeFavoris = localStorage.getItem("favoris");
        arrayFavoris = listeFavoris.split(",");
        let compteur = 0;
        for (favoris of arrayFavoris){
            if (value == favoris){
                console.log(arrayFavoris);
                arrayFavoris.splice(compteur , 1);
            }
            compteur += 1;
        }
        localStorage.setItem("favoris" , arrayFavoris);


        event.target.textContent = "+";
    }
    
}