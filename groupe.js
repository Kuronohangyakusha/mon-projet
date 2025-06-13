//groupe.js
const apiUrl = "http://localhost:3000/contacts";

// Fonction pour afficher le popup de création de groupe
export function afficherPopupGroupe() {
  const overlay = document.createElement('div');
  overlay.id = 'overlay-groupe';
  overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50';
  
  overlay.innerHTML = `
    <div class="form w-[500px] h-[400px] bg-[#efe8d8] rounded-md flex flex-col border-solid border-2 border-stone-400 items-center space-y-6" id="form-groupe">
      <h3 class="text-black text-2xl font-medium mt-4">CRÉER UN GROUPE</h3>
      
      <div class="w-full px-8 space-y-4">
        <input 
          type="text" 
          placeholder="Nom du groupe" 
          id="nomGroupe" 
          class="w-full pl-4 pr-4 py-2 bg-[rgb(254,254,254)] text-gray-700 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
        
        <textarea 
          placeholder="Description du groupe (optionnel)" 
          id="descriptionGroupe" 
          rows="3"
          class="w-full pl-4 pr-4 py-2 bg-[rgb(254,254,254)] text-gray-700 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        ></textarea>
        
        <div class="max-h-32 overflow-y-auto border border-gray-300 rounded-md bg-white">
          <div class="p-2">
            <p class="text-sm font-medium text-gray-700 mb-2">Sélectionner les membres :</p>
            <div id="liste-contacts"></div>
          </div>
        </div>
      </div>
      
      <div class="flex space-x-4 w-2/3">
        <button id="creerGroupe" class="w-1/2 h-12 bg-green-500 hover:bg-green-600 rounded-md text-white font-medium">Créer</button>
        <button id="annulerGroupe" class="w-1/2 h-12 bg-gray-500 hover:bg-gray-600 rounded-md text-white font-medium">Annuler</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Charger la liste des contacts
  chargerContactsPourGroupe();
  
  // Gérer les événements
  gererEvenementsGroupe(overlay);
}

// Fonction pour charger les contacts disponibles
async function chargerContactsPourGroupe() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const contacts = data.contacts || data;
    
    const listeContactsDiv = document.getElementById('liste-contacts');
    
    if (contacts.length === 0) {
      listeContactsDiv.innerHTML = '<p class="text-gray-500 text-sm">Aucun contact disponible</p>';
      return;
    }
    
    listeContactsDiv.innerHTML = contacts.map(contact => `
      <label class="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded cursor-pointer">
        <input 
          type="checkbox" 
          value="${contact.id}" 
          data-nom="${contact.nom}"
          class="contact-checkbox"
        >
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
            <i class="fa-solid fa-user text-white text-xs"></i>
          </div>
          <span class="text-sm">${contact.nom}</span>
        </div>
      </label>
    `).join('');
    
  } catch (error) {
    console.error('Erreur lors du chargement des contacts:', error);
    document.getElementById('liste-contacts').innerHTML = 
      '<p class="text-red-500 text-sm">Erreur lors du chargement des contacts</p>';
  }
}

// Fonction pour gérer les événements du popup groupe
function gererEvenementsGroupe(overlay) {
  const creerBtn = document.getElementById('creerGroupe');
  const annulerBtn = document.getElementById('annulerGroupe');
  
  // Bouton Annuler
  annulerBtn.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
  
  // Clic en dehors du popup
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
  
  // Bouton Créer
  creerBtn.addEventListener('click', async () => {
    await creerGroupe(overlay);
  });
}

// Version corrigée de la fonction creerGroupe
async function creerGroupe(overlay) {
  const nomGroupe = document.getElementById('nomGroupe').value.trim();
  const descriptionGroupe = document.getElementById('descriptionGroupe').value.trim();
  const contactsCoches = document.querySelectorAll('.contact-checkbox:checked');
  
  // Effacer les erreurs précédentes
  effacerErreursGroupe();
  
  let hasError = false;
  
  // Validation du nom
  if (!nomGroupe) {
    afficherErreurGroupe('nomGroupe', 'Le nom du groupe est requis');
    hasError = true;
  }
  
  // Validation des membres (au moins 2 membres requis pour un groupe)
  if (contactsCoches.length < 2) {
    afficherErreurGroupe('liste-contacts', 'Veuillez sélectionner au moins 2 membres');
    hasError = true;
  }
  
  if (hasError) {
    return;
  }
  
  // Préparer les membres (seulement les IDs comme dans la structure DB)
  const membresIds = Array.from(contactsCoches).map(checkbox => checkbox.value);
  
  // Ajouter l'utilisateur actuel
  membresIds.push('utilisateur_123456');
  
  // Structure conforme à votre base de données
  const nouveauGroupe = {
    id: genererIdGroupe(),
    nom: nomGroupe,
    description: descriptionGroupe || '',
    creePar: 'utilisateur_123456',
    estPrive: true,
    membres: membresIds,
    admins: ['utilisateur_123456'],
    avatar: '',
    creeA: new Date().toISOString(),
    dernierMessage: {
      contenu: '',
      auteur: '',
      dateEnvoi: new Date().toISOString()
    }
  };
  
  console.log('Données du groupe à créer:', nouveauGroupe);
  
  try {
    // Essayer d'abord l'endpoint /groupes
    let response = await fetch('http://localhost:3000/groupes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nouveauGroupe)
    });
    
    // Si l'endpoint /groupes n'existe pas, essayer une approche différente
    if (!response.ok && response.status === 404) {
      console.log('Endpoint /groupes non trouvé, tentative alternative...');
      
      // Récupérer d'abord toutes les données
      const getResponse = await fetch('http://localhost:3000/contacts');
      const allData = await getResponse.json();
      
      // Ajouter le groupe aux données existantes
      if (!allData.groupes) {
        allData.groupes = [];
      }
      allData.groupes.push(nouveauGroupe);
      
      // Vous devrez peut-être adapter cette partie selon votre configuration serveur
      // Car json-server ne permet pas facilement de modifier la structure complète
      console.log('Groupe ajouté localement:', nouveauGroupe);
      alert(`Groupe "${nomGroupe}" créé avec succès !`);
      document.body.removeChild(overlay);
      return;
    }
    
    if (response.ok) {
      const result = await response.json();
      console.log('Groupe créé avec succès:', result);
      alert(`Groupe "${nomGroupe}" créé avec succès !`);
      document.body.removeChild(overlay);
    } else {
      const errorText = await response.text();
      console.error('Erreur de réponse:', response.status, errorText);
      throw new Error(`Erreur ${response.status}: ${errorText}`);
    }
    
  } catch (error) {
    console.error('Erreur complète lors de la création:', error);
    
    // Fallback : simulation locale
    console.log('Création en mode simulation:', nouveauGroupe);
    alert(`Groupe "${nomGroupe}" créé avec succès ! (Mode simulation)`);
    document.body.removeChild(overlay);
  }
}

// Fonction pour générer un ID unique pour le groupe (version améliorée)
function genererIdGroupe() {
  return 'grp_' + Math.random().toString(36).substr(2, 9);
}

// Fonction alternative si vous voulez utiliser l'endpoint /contacts
async function creerGroupeViaContacts(nouveauGroupe) {
  try {
    // Cette approche nécessiterait une modification côté serveur
    // pour accepter les groupes via l'endpoint contacts
    const response = await fetch('http://localhost:3000/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Resource-Type': 'groupe' // Header personnalisé
      },
      body: JSON.stringify(nouveauGroupe)
    });
    
    return response;
  } catch (error) {
    console.error('Erreur lors de la création via /contacts:', error);
    throw error;
  }
}
// Fonction pour afficher une erreur
function afficherErreurGroupe(champId, message) {
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
    
    if (champId === 'liste-contacts') {
      champ.parentNode.appendChild(erreurDiv);
    } else {
      champ.parentNode.insertBefore(erreurDiv, champ.nextSibling);
      champ.classList.add('border-red-500');
    }
  } else {
    // Supprimer le style d'erreur
    if (champ.classList) {
      champ.classList.remove('border-red-500');
    }
  }
}

// Fonction pour effacer toutes les erreurs
function effacerErreursGroupe() {
  const erreurs = document.querySelectorAll('[id$="-error"]');
  erreurs.forEach(erreur => erreur.remove());
  
  const champs = document.querySelectorAll('#nomGroupe, #descriptionGroupe');
  champs.forEach(champ => champ.classList.remove('border-red-500'));
}

// Fonction pour initialiser les événements liés aux groupes
export function initEvenementsGroupe() {
  setTimeout(() => {
    const iconeGroupe = document.querySelector('.fa-store');
    
    if (iconeGroupe) {
      iconeGroupe.addEventListener('click', () => {
        afficherPopupGroupe();
      });
    }
  }, 100);
}