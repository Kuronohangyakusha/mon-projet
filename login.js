//login.js
const apiUrl = "https://mon-projet-xrnh.onrender.com/contacts";

// Fonction pour vérifier si le numéro existe dans la base (pour la connexion)
export async function verifierNumero(numero) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const contacts = data.contacts || data;
    
    // Nettoyer le numéro saisi (enlever espaces, tirets, etc.)
    const numeroNettoye = numero.replace(/[\s\-\+]/g, '');
    
    return contacts.some(contact => {
      const contactNumero = contact.numeroTelephone.replace(/[\s\-\+]/g, '');
      
      // Comparaisons possibles :
      // 1. Correspondance exacte
      if (contactNumero === numeroNettoye) return true;
      
      // 2. Si le numéro saisi est local (9 chiffres) et le contact a +221
      if (numeroNettoye.length === 9 && contactNumero === '221' + numeroNettoye) return true;
      
      // 3. Si le numéro saisi a +221 et le contact est local
      if (numeroNettoye.startsWith('221') && numeroNettoye.substring(3) === contactNumero) return true;
      
      // 4. Comparaison des 9 derniers chiffres pour les numéros internationaux
      if (contactNumero.length >= 9 && numeroNettoye.length >= 9) {
        const derniers9Contact = contactNumero.slice(-9);
        const derniers9Saisi = numeroNettoye.slice(-9);
        if (derniers9Contact === derniers9Saisi) return true;
      }
      
      return false;
    });
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    return false;
  }
}

// Fonction pour sauvegarder l'état de connexion
export function sauvegarderConnexion(numero) {
  sessionStorage.setItem('userConnected', 'true');
  sessionStorage.setItem('userNumber', numero);
}

// Fonction pour vérifier l'état de connexion
export function verifierConnexion() {
  return sessionStorage.getItem('userConnected') === 'true';
}

// Fonction pour supprimer l'état de connexion
export function supprimerConnexion() {
  sessionStorage.removeItem('userConnected');
  sessionStorage.removeItem('userNumber');
}

// Fonction pour initialiser les événements de connexion
export function initConnectionEvents() {
  setTimeout(() => {
    const connecter = document.getElementById('connecter');
    const numeroInput = document.querySelector('input[type="text"]');
    
    if (connecter && numeroInput) {
      connecter.addEventListener('click', async () => {
        const numero = numeroInput.value.trim();
        
        if (!numero) {
          alert('Veuillez saisir un numéro de téléphone');
          return;
        }
        
        // Vérifier si le numéro existe dans la base
        const numeroExiste = await verifierNumero(numero);
        
        if (numeroExiste) {
          sauvegarderConnexion(numero);
          // Déclencher un événement personnalisé pour signaler la connexion réussie
          window.dispatchEvent(new CustomEvent('connexionReussie'));
        } else {
          alert('Ce numéro n\'existe pas dans la base de données');
        }
      });
    }
  }, 100);
}