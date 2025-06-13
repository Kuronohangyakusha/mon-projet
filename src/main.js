//main.js
import './style.css'
const apiUrl = "https://mon-projet-xrnh.onrender.com/contacts";
import { ConnectionInterface, homepage } from './counter';
import { verifierConnexion, supprimerConnexion, initConnectionEvents } from '../login';
import { verifierNumeroExiste, validerNumero, afficherErreur, effacerErreurs, obtenirNomUnique } from '../ajout';
import { initEvenementsGroupe } from '../groupe';

// Fonction pour charger et afficher les contacts et groupes
// Fonction pour charger et afficher les contacts et groupes - VERSION CORRIGÉE
async function chargerContactsEtGroupes() {
  try {
    console.log('Début du chargement des contacts et groupes...');
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // CORRECTION : Vérifier le format des données reçues
    let contacts = [];
    let groupes = [];
    
    if (Array.isArray(data)) {
      // Si data est directement un tableau, ce sont les contacts
      contacts = data;
      console.log('Format détecté : tableau direct de contacts');
      
      // Essayer de récupérer les groupes depuis un autre endpoint ou fichier
      try {
        const groupesResponse = await fetch('https://mon-projet-xrnh.onrender.com/groupes');
        if (groupesResponse.ok) {
          groupes = await groupesResponse.json();
        }
      } catch (error) {
        console.log('Pas de groupes disponibles ou erreur endpoint groupes');
      }
      
    } else if (data.contacts || data.groupes) {
      // Si data est un objet avec les propriétés contacts et groupes
      contacts = data.contacts || [];
      groupes = data.groupes || [];
      console.log('Format détecté : objet avec propriétés contacts/groupes');
    }
    
    console.log('Données reçues:', data);
    console.log('Contacts trouvés:', contacts.length);
    console.log('Groupes trouvés:', groupes.length);
    
    // Trouver le conteneur des conversations
    const conversationExistante = document.querySelector('.conversation');
    console.log('Conversation existante trouvée:', conversationExistante);
    
    if (conversationExistante) {
      const conteneurParent = conversationExistante.parentNode;
      
      // Supprimer la conversation d'exemple
      conversationExistante.remove();
      
      // Vérifier qu'on a bien des données à afficher
      if (groupes.length === 0 && contacts.length === 0) {
        const messageVide = document.createElement('div');
        messageVide.className = 'w-full px-4 py-8 text-center text-gray-500';
        messageVide.innerHTML = '<p>Aucun contact ou groupe trouvé</p>';
        conteneurParent.appendChild(messageVide);
        return;
      }
      
      // Ajouter les groupes d'abord
      groupes.forEach(groupe => {
        const groupeElement = document.createElement('div');
        groupeElement.innerHTML = creerElementGroupe(groupe);
        conteneurParent.appendChild(groupeElement.firstElementChild);
      });
      
      // Ajouter les contacts
      contacts.forEach(contact => {
        const contactElement = document.createElement('div');
        contactElement.innerHTML = creerElementContact(contact);
        conteneurParent.appendChild(contactElement.firstElementChild);
      });
      
      console.log('Contacts et groupes ajoutés avec succès');
    } else {
      console.error('Impossible de trouver le conteneur des conversations');
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    
    // Afficher un message d'erreur à l'utilisateur
    const conversationExistante = document.querySelector('.conversation');
    if (conversationExistante) {
      const conteneurParent = conversationExistante.parentNode;
      conversationExistante.remove();
      
      const messageErreur = document.createElement('div');
      messageErreur.className = 'w-full px-4 py-8 text-center text-red-500';
      messageErreur.innerHTML = '<p>Erreur lors du chargement des contacts</p>';
      conteneurParent.appendChild(messageErreur);
    }
  }
}


// Fonction pour créer l'HTML d'un contact
function creerElementContact(contact) {
  const dernierMessage = "Cliquez pour démarrer une conversation";
  const heure = new Date(contact.creeA).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return `
    <div class="conversation w-full px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between border-b border-gray-200" data-type="contact" data-id="${contact.id}">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
          <i class="fa-solid fa-user text-white text-sm"></i>
        </div>
        <div class="flex flex-col">
          <span class="font-medium text-gray-900">${contact.nom}</span>
          <span class="text-sm text-gray-500 truncate w-48">${dernierMessage}</span>
        </div>
      </div>
      <div class="flex flex-col items-end space-y-1">
        <span class="text-xs text-gray-400">${heure}</span>
        <span class="text-xs px-2 py-1 rounded-full ${contact.statut === 'En ligne' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}">${contact.statut}</span>
      </div>
    </div>
  `;
}

// Fonction pour créer l'HTML d'un groupe
function creerElementGroupe(groupe) {
  const dernierMessage = groupe.dernierMessage.contenu || "Nouveau groupe créé";
  const heure = new Date(groupe.creeA).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const nombreMembres = groupe.membres.length;
  
  return `
    <div class="conversation w-full px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between border-b border-gray-200" data-type="groupe" data-id="${groupe.id}">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
          <i class="fa-solid fa-users text-white text-sm"></i>
        </div>
        <div class="flex flex-col">
          <span class="font-medium text-gray-900">${groupe.nom}</span>
          <span class="text-sm text-gray-500 truncate w-48">${dernierMessage}</span>
        </div>
      </div>
      <div class="flex flex-col items-end space-y-1">
        <span class="text-xs text-gray-400">${heure}</span>
        <span class="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">${nombreMembres} membres</span>
      </div>
    </div>
  `;
}

// Fonction pour gérer la recherche
function gererRecherche() {
  const inputRecherche = document.getElementById('inputRecherche');
  
  if (inputRecherche) {
    inputRecherche.addEventListener('input', (e) => {
      const terme = e.target.value.toLowerCase();
      const conversations = document.querySelectorAll('.conversation[data-type]');
      
      conversations.forEach(conv => {
        const nom = conv.querySelector('.font-medium').textContent.toLowerCase();
        conv.style.display = nom.includes(terme) ? 'flex' : 'none';
      });
    });
    console.log('Recherche initialisée');
  } else {
    console.error('Input de recherche non trouvé');
  }
}

// Fonction pour gérer les filtres
function gererFiltres() {
  const filtres = document.querySelectorAll('.filtres button');
  
  filtres.forEach(filtre => {
    filtre.addEventListener('click', () => {
      // Retirer la classe active de tous les filtres
      filtres.forEach(f => {
        f.classList.remove('bg-green-500');
        f.classList.add('bg-white');
      });
      
      // Ajouter la classe active au filtre cliqué
      filtre.classList.remove('bg-white');
      filtre.classList.add('bg-green-500');
      
      // Appliquer le filtre
      const texteFiltre = filtre.textContent.toLowerCase();
      const conversations = document.querySelectorAll('.conversation[data-type]');
      
      conversations.forEach(conv => {
        const type = conv.getAttribute('data-type');
        
        if (texteFiltre === 'tous') {
          conv.style.display = 'flex';
        } else if (texteFiltre === 'groupes') {
          conv.style.display = type === 'groupe' ? 'flex' : 'none';
        } else {
          conv.style.display = 'flex';
        }
      });
    });
  });
  console.log('Filtres initialisés');
}

function afficherHomepage() {
  document.getElementById('app').innerHTML = homepage();
  
  setTimeout(() => {
    // Gérer la déconnexion
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        supprimerConnexion();
        document.getElementById('app').innerHTML = ConnectionInterface();
        initConnectionEvents();
      });
    }

    // Gérer l'affichage du popup d'ajout de contact
    const troisPoints = document.querySelector('.fa-ellipsis-vertical');
    const overlay = document.getElementById('overlay');
    const annulerBtn = document.getElementById('annulerUser');
    const ajouterBtn = document.getElementById('ajouterUser');

    if (troisPoints && overlay) {
      troisPoints.addEventListener('click', () => {
        overlay.classList.remove('hidden');
      });
    }

    if (annulerBtn && overlay) {
      annulerBtn.addEventListener('click', () => {
        overlay.classList.add('hidden');
        document.getElementById('nomUser').value = '';
        document.getElementById('numeroUser').value = '';
        effacerErreurs();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.add('hidden');
          document.getElementById('nomUser').value = '';
          document.getElementById('numeroUser').value = '';
          effacerErreurs();
        }
      });
    }

    if (ajouterBtn) {
      ajouterBtn.addEventListener('click', async () => {
        const nom = document.getElementById('nomUser').value.trim();
        const numero = document.getElementById('numeroUser').value.trim();

        // Effacer les erreurs précédentes
        effacerErreurs();

        let hasError = false;

        // Validation du nom
        if (!nom) {
          afficherErreur('nomUser', 'Le nom est requis');
          hasError = true;
        }

        // Validation du numéro
        if (!numero) {
          afficherErreur('numeroUser', 'Le numéro est requis');
          hasError = true;
        } else {
          // Vérifier la longueur du numéro
          const erreurLongueur = validerNumero(numero);
          if (erreurLongueur) {
            afficherErreur('numeroUser', erreurLongueur);
            hasError = true;
          } else {
            // Vérifier si le numéro existe déjà
            const numeroExiste = await verifierNumeroExiste(numero);
            if (numeroExiste) {
              afficherErreur('numeroUser', 'Ce numéro existe déjà dans vos contacts');
              hasError = true;
            }
          }
        }

        if (hasError) {
          return;
        }

        const nomUnique = await obtenirNomUnique(nom);

        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: generateId(),
              idUtilisateur: "utilisateur_123456",
              nom: nomUnique,
              numeroTelephone: numero,
              photoProfil: "",
              statut: "Disponible",
              favori: false,
              bloque: false,
              creeA: new Date().toISOString()
            })
          });

          if (response.ok) {
            const message = nomUnique !== nom ? 
              `Contact ajouté avec succès ! (Nom modifié en "${nomUnique}" car "${nom}" existait déjà)` : 
              'Contact ajouté avec succès !';
            alert(message);
            overlay.classList.add('hidden');
            // Vider les champs
            document.getElementById('nomUser').value = '';
            document.getElementById('numeroUser').value = '';
            effacerErreurs();
            
            // Recharger les contacts pour afficher le nouveau
            setTimeout(() => {
              chargerContactsEtGroupes();
            }, 100);
          } else {
            alert('Erreur lors de l\'ajout du contact');
          }
        } catch (error) {
          console.error('Erreur:', error);
          alert('Erreur lors de l\'ajout du contact');
        }
      });
    }
    
    initEvenementsGroupe();
    
    // Charger les contacts et groupes avec un délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
      chargerContactsEtGroupes();
    }, 200);
    
    // Initialiser la recherche
    setTimeout(() => {
      gererRecherche();
    }, 300);
    
    // Initialiser les filtres
    setTimeout(() => {
      gererFiltres();
    }, 300);
  }, 100);
}

// Fonction pour générer un ID unique
function generateId() {
  return Math.random().toString(36).substr(2, 4);
}

document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si l'utilisateur est déjà connecté
  if (verifierConnexion()) {
    afficherHomepage();
  } else {
    document.getElementById('app').innerHTML = ConnectionInterface();
    initConnectionEvents();
  }
  
  // Écouter l'événement de connexion réussie
  window.addEventListener('connexionReussie', () => {
    afficherHomepage();
  });
});

const content = document.getElementById('content');
const section = document.getElementById('section');