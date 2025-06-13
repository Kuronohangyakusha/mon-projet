 
//counter.js
export function ConnectionInterface(){
  const interfaceDiv = `
    <div class="contain w-full h-screen flex justify-center items-center">
      <div class="w-[1100px] h-[600px] bg-white flex flex-col justify-center items-center rounded-[2rem]">

        <div class="text-green-500 font-bold text-2xl">
          <i class="fa-brands fa-whatsapp"></i> Aurora
        </div>

        <div class="bg-white w-full max-w-md px-8 py-10 rounded-2xl border border-gray-300 shadow">
          <h2 class="text-2xl font-semibold text-center mb-2">Saisissez un numéro de téléphone.</h2>
          <p class="text-center text-gray-600 mb-6">Sélectionnez un pays et saisissez votre numéro de téléphone.</p>

          <div class="mb-4">
            <select class="w-full py-3 px-4 border border-gray-300 rounded-full text-gray-700">
              <option value="sn">🇸🇳 Sénégal</option>
              <option value="fr">🇫🇷 France</option>
              <option value="ci">🇨🇮 Côte d’Ivoire</option>
            </select>
          </div>

          <div class="mb-6">
            <input 
              type="text" 
              placeholder="+221" 
              class="w-full py-3 px-4 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button id="connecter" class="w-full py-3 bg-green-600 text-white rounded-full hover:bg-green-700 font-medium">
            Suivant
          </button>

          <div class="text-center mt-4">
            <a href="#" class="text-green-600 underline text-sm hover:text-green-700">
              Se connecter avec un code QR <i class="fa-solid fa-arrow-right ml-1"></i>
            </a>
          </div>
        </div>

      </div>
    </div>
  `;
return  interfaceDiv;
}

export function homepage(){
  const interfaceAccueil =   `
  <div id="overlay" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 hidden">
    <div class="form w-[400px] h-[300px] bg-[#efe8d8] rounded-md flex flex-col border-solid border-2 border-stone-400 items-center space-y-8" id="form">
      <h3 class="text-black text-2xl font-medium mt-4 ">AJOUT CONTACT</h3>
      <input type="text" placeholder="Votre Nom" id="nomUser" class="w-2/3 pl-4 pr-4 py-2 bg-[rgb(254,254,254)] text-gray-700 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500">
      <input type="text" placeholder="Votre Numéro" id="numeroUser" class="w-2/3 pl-4 pr-4 py-2 bg-[rgb(254,254,254)] text-gray-700 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500">
      <div class="flex space-x-4 w-2/3">
        <button id="ajouterUser" class="w-1/2 h-12 bg-green-500 hover:bg-green-600 rounded-md text-white font-medium">Ajouter</button>
        <button id="annulerUser" class="w-1/2 h-12 bg-gray-500 hover:bg-gray-600 rounded-md text-white font-medium">Annuler</button>
      </div>
    </div>
  </div>

  <section id="section" class="flex justify-between items-center w-full h-screen">
    <div class="w-1/3 h-full flex">
      <div class="menu w-[13%] h-full bg-[rgb(240,240,232)] flex flex-col justify-between ">
        <div class="conehaut w-full h-[200px] flex flex-col">
            <div class="div w-full h-1/5 flex justify-center items-center cursor-pointer p-2">
                <i class="fa-solid fa-message text-[20px] "></i>
            </div>
            <div class="div div w-full h-1/5 flex justify-center items-center cursor-pointer p-2">
                <i class="fas fa-circle text-[20px]"></i>
            </div>
            <div class="div div w-full h-1/5 flex justify-center items-center cursor-pointer p-2">
                 <i class="fa-regular fa-comment-dots text-[20px] "></i>
            </div>
            <div class="div div w-full h-1/5 flex justify-center items-center cursor-pointer p-2">
                 <i class="fa-solid fa-user-group text-black text-[20px]"></i>
            </div>
            <div class="logout-container flex justify-center items-center cursor-pointer w-full p-2 h-1/5">
                <i id="logout" class="fa-solid fa-right-from-bracket text-[20px] text-red-700"></i>
            </div>
        </div>
        <div class="iconesbas w-full h-1/6 flex flex-col justify-center items-center">
            <div class="parametre w-full h-14 flex justify-center items-center text-2xl">
                <i class="fas fa-gear"></i>
            </div>
            <div class="pp w-14 h-14 rounded-full bg-gray-50 ">
            </div>
        </div>
      </div>
      
      <div class="discussion w-[87%] h-full bg-white flex flex-col">
        <div class="titre w-full h-14 flex flex-row">
          <div class="titre w-3/6 h-full">
           <h3 class="text-[30px] font-medium text-green-600 px-4 py-3">Aurora</h3>
          </div>
          <div class="icontitre w-full flex justify-end items-center pr-4">
            <i class="fa-solid fa-store text-gray-600 text-[20px]"></i>
            <i class="fa-solid fa-ellipsis-vertical text-gray-600 text-[20px] ml-2 sm:ml-4 md:ml-6"></i>
          </div>
        </div>
        
        <div class="barreRecherche w-full h-20 flex items-center px-4">
          <div class="relative w-full">
            <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              id="inputRecherche"
              placeholder="Rechercher ou démarrer une discussion"
              class="w-full pl-10 pr-4 py-2 bg-[rgb(254,254,254)] text-gray-700 rounded-[5Rem] bg-gray-300 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
        
        <div class="filtres w-full px-4 py-2 flex items-center space-x-4 overflow-x-auto text-sm text-gray-600">
          <button class="px-4 py-1 rounded-full bg-green-500 border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500">Tous</button>
          <button class="px-4 py-1 bg-white rounded-full border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500">Non lus</button>
          <button class="px-4 py-1 bg-white rounded-full border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500">Groupes</button>
          <button class="px-4 py-1 bg-white rounded-full border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500">Professionnel</button>
        </div>
        
        <div class="archive w-full px-4 py-3 hover:bg-gray-200 cursor-pointer flex items-center justify-between text-gray-700">
          <div class="flex items-center space-x-3">
            <i class="fa-solid fa-box-archive text-gray-500 text-[18px]"></i>
            <span class="text-[15px] font-medium">Archivés</span>
          </div>
          <span class="text-sm text-gray-500">(3)</span> 
        </div>

        <!-- Zone des conversations avec scroll -->
        <div class="conversations-container flex-1 overflow-y-auto">
          <div class="conversation w-full px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between border-b border-gray-200">
            <!-- Avatar + texte -->
            <div class="flex items-center space-x-3">
              <img src="public/vite.svg" alt="Avatar" class="w-10 h-10 rounded-full object-cover">
              <div class="flex flex-col">
                <span class="font-medium text-gray-900">ndeyaa</span>
                <span class="text-sm text-gray-500 truncate w-48">Salut ! Tu es dispo pour une réunion demain ?</span>
              </div>
            </div>
            
            <div class="flex flex-col items-end space-y-1">
              <span class="text-xs text-gray-400">16:45</span>
              <span class="bg-green-500 text-white text-xs px-2 py-[2px] rounded-full font-semibold">2</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="w-2/3 h-full bg-[rgb(239,232,216)] flex flex-col justify-between" id="zone-discussion">
      <div class="tete w-full h-20 border-b-4 border-[#f9f2e0] border-solid flex flex-row justify-between items-center px-4">
        <div class="flex items-center space-x-4">
          <div class="photoprofil bg-gradient-to-br from-gray-400 to-gray-600 w-16 h-16 rounded-full flex items-center justify-center">
            <i class="fa-solid fa-user text-white text-xl"></i>
          </div>
          <div>
            <h3 class="text-gray-800 font-medium">Conversation</h3>
            <p class="text-gray-600 text-sm">En ligne</p>
          </div>
        </div>
        <div class="icones flex flex-row space-x-2">
          <button class="p-2 hover:bg-gray-600 rounded-full">
            <i class="fas fa-phone text-gray-300"></i>
          </button>
          <button class="p-2 hover:bg-gray-600 rounded-full">
            <i class="fas fa-video text-gray-300"></i>
          </button>
          <button class="p-2 hover:bg-gray-600 rounded-full">
            <i class="fas fa-search text-gray-300"></i>
          </button>
          <button class="p-2 hover:bg-gray-600 rounded-full">
            <i class="fas fa-ellipsis-v text-gray-300"></i>
          </button>
        </div>
      </div>
      
      <div class="messages flex-1 bg-[rgb(239,232,216)] p-4 overflow-y-auto">
        <div class="text-center text-gray-500 text-sm mb-8">
          Sélectionnez une conversation pour commencer à discuter
        </div>
      </div>
      
      <div class="w-full px-4 py-3 bg-gray-100 flex items-center space-x-3 border-t border-gray-300">
        <!-- Icône emoji -->
        <i class="fa-regular fa-face-smile text-gray-500 text-xl cursor-pointer hover:text-gray-700"></i>

        <!-- Zone de saisie -->
        <div class="flex-1">
          <input
            type="text"
            placeholder="Tapez un message"
            class="w-full px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <!-- Icône pièce jointe -->
        <i class="fa-solid fa-paperclip text-gray-500 text-xl rotate-45 cursor-pointer hover:text-gray-700"></i>

        <!-- Icône micro ou envoyer -->
        <i class="fa-solid fa-microphone text-gray-500 text-xl cursor-pointer hover:text-gray-700"></i>
      </div>

    </div>
  </section>
  `
  return interfaceAccueil;
}