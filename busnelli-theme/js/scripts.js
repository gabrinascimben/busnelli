// Update the iframe SRC with the parameters for Salesforce when available
let allModalToggles = document.querySelectorAll('[modal-toggle]');
allModalToggles.forEach(toggle => {
  toggle.addEventListener( 'click', (event) => {
    event.preventDefault();

    let target = toggle.getAttribute('modal-toggle'),
        salesforceProduct = toggle.getAttribute('data-product'),
        salesforceFile = toggle.getAttribute('data-file'),
        iframe = document.querySelector('[modal=' + target + '] iframe'),
        separator = '?',
        queryParams = '';

    if (salesforceProduct) {
      queryParams += separator + 'Nome_prodotto=' + salesforceProduct;
      separator = '&';
    }
    if (salesforceFile) {
      queryParams += separator + 'File_Richiesto=' + salesforceFile;
    }


    iframe.src = iframe.getAttribute('data-src') + queryParams;

  });
});


// Clean up the form when closing the modal window
let allModalCloses = document.querySelectorAll('.modal--close');
allModalCloses.forEach(close => {
  close.addEventListener('click', () => {
    let iframe = close.parentElement.querySelector('iframe');
    iframe.src = '';
  });
});



// Semplice controllo del background header quando il menu è aperto
function toggleHeaderBackground() {
  const menuWrapper = document.querySelector('.menu--wrapper');
  const header = document.querySelector('.header');
  const breadcrumb = document.querySelector('.header--left--breadcrumb');

  if (!menuWrapper || !header) {
    console.warn('Elementi .menu--wrapper o .header non trovati');
    return;
  }

  const menuWrapperStyle = window.getComputedStyle(menuWrapper);

  // Controlla se il menu wrapper è in display: block
  if (menuWrapperStyle.display === 'block') {
    // Menu aperto - background trasparente e elementi bianchi
    header.style.background = 'transparent';

    // Nascondi il breadcrumb
    if (breadcrumb) {
      breadcrumb.style.display = 'none';
    }

    // Cambia il colore del logo SVG a bianco
    const logoSvgPaths = document.querySelectorAll('a.header--left--logo svg path');
    logoSvgPaths.forEach(path => {
      path.style.setProperty('fill', '#fff', 'important');
    });

    // Cambia il colore dell'icona menu a bianco
    const menuIcons = document.querySelectorAll('.header .menu--icon');
    menuIcons.forEach(icon => {
      icon.style.setProperty('background', '#fff', 'important');
    });

    // Aggiungi CSS dinamico per gli pseudo-elementi
    addMenuIconStyles();

  } else {
    // Menu chiuso - ripristina background bianco e colori originali
    header.style.background = '#fff';

    // Mostra di nuovo il breadcrumb
    if (breadcrumb) {
      breadcrumb.style.display = '';
    }

    // Rimuovi il colore forzato del logo SVG
    const logoSvgPaths = document.querySelectorAll('a.header--left--logo svg path');
    logoSvgPaths.forEach(path => {
      path.style.removeProperty('fill');
    });

    // Rimuovi il colore forzato dell'icona menu
    const menuIcons = document.querySelectorAll('.header .menu--icon');
    menuIcons.forEach(icon => {
      icon.style.removeProperty('background');
    });

    // Rimuovi CSS dinamico per gli pseudo-elementi
    removeMenuIconStyles();
  }
}

// Funzione per aggiungere gli stili degli pseudo-elementi
function addMenuIconStyles() {
  if (!document.getElementById('dynamic-menu-styles')) {
    const style = document.createElement('style');
    style.id = 'dynamic-menu-styles';
    style.textContent = `
      body.menu-open .menu--icon:before,
      body.menu-open .menu--icon:after {
        background: #8a5c3c !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// Funzione per rimuovere gli stili degli pseudo-elementi
function removeMenuIconStyles() {
  const dynamicStyles = document.getElementById('dynamic-menu-styles');
  if (dynamicStyles) {
    dynamicStyles.remove();
  }
}

// Observer per il menu - SOLO per osservare i cambiamenti del menu
function observeMenuChanges() {
  const menuWrapper = document.querySelector('.menu--wrapper');

  if (!menuWrapper) {
    console.warn('Elemento .menu--wrapper non trovato');
    return;
  }

  // Observer che osserva SOLO i cambiamenti del menu
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        toggleHeaderBackground();
      }
    });
  });

  observer.observe(menuWrapper, {
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  // Controllo iniziale
  toggleHeaderBackground();
}

// Inizializza SOLO l'observer del menu
document.addEventListener('DOMContentLoaded', function() {
  observeMenuChanges();
});