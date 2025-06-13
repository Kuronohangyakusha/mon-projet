//ajout.js
const apiUrl = "https://mon-projet-xrnh.onrender.com/contacts";
// Fonction pour vérifier si le numéro existe dans la base
export async function verifierNumeroExiste(numero) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const contacts = data.contacts || data;
    
    return contacts.some(contact => 
      contact.numeroTelephone === numero || 
      contact.numeroTelephone === `+221${numero}` ||
      contact.numeroTelephone.replace('+221', '') === numero
    );
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    return false;
  }
}



// Fonction pour valider le numéro de téléphone
export function validerNumero(numero) {
  // Enlever les espaces et caractères spéciaux
  const numeroNettoye = numero.replace(/[\s\-\+]/g, '');
  
  // Vérifier si c'est exactement 9 chiffres
  if (numeroNettoye.length !== 9) {
    return "Le numéro doit contenir exactement 9 chiffres";
  }
  
  // Vérifier si ce sont bien des chiffres
  if (!/^\d{9}$/.test(numeroNettoye)) {
    return "Le numéro ne doit contenir que des chiffres";
  }
  
  return null; // Pas d'erreur
}

// Fonction pour afficher une erreur sous un champ
export function afficherErreur(champId, message) {
  const champ = document.getElementById(champId);
  let erreurDiv = document.getElementById(champId + '-error');
  
  // Supprimer l'ancienne erreur si elle existe
  if (erreurDiv) {
    erreurDiv.remove();
  }
  
  if (message) {
    // Créer et afficher la nouvelle erreur
    erreurDiv = document.createElement('div');
    erreurDiv.id = champId + '-error';
    erreurDiv.className = 'text-red-500 text-sm mt-1';
    erreurDiv.textContent = message;
    champ.parentNode.insertBefore(erreurDiv, champ.nextSibling);
    champ.classList.add('border-red-500');
  } else {
    // Supprimer le style d'erreur
    champ.classList.remove('border-red-500');
  }
}

// Fonction pour effacer toutes les erreurs
export function effacerErreurs() {
  const erreurs = document.querySelectorAll('[id$="-error"]');
  erreurs.forEach(erreur => erreur.remove());
  
  const champs = document.querySelectorAll('#nomUser, #numeroUser');
  champs.forEach(champ => champ.classList.remove('border-red-500'));
}
// Fonction pour vérifier si le nom existe et générer un nom unique
export async function obtenirNomUnique(nom) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const contacts = data.contacts || data;
    
    // Vérifier si le nom existe déjà
    const nomsExistants = contacts.map(contact => contact.nom.toLowerCase());
    
    if (!nomsExistants.includes(nom.toLowerCase())) {
      return nom; // Le nom n'existe pas, on peut l'utiliser tel quel
    }
    
    // Le nom existe, chercher un numéro disponible
    let compteur = 1;
    let nomUnique = `${nom}${compteur}`;
    
    while (nomsExistants.includes(nomUnique.toLowerCase())) {
      compteur++;
      nomUnique = `${nom}${compteur}`;
    }
    
    return nomUnique;
  } catch (error) {
    console.error('Erreur lors de la vérification du nom:', error);
    return nom; // En cas d'erreur, retourner le nom original
  }
}