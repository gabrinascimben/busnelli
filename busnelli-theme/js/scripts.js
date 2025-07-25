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


// Controllo integrato per header - scroll e menu
let isMenuOpen = false;
let isHeaderVisible = true;
let lastScrollY = window.scrollY;

// Funzione principale per aggiornare l'header
function updateHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  // Se il menu è aperto, l'header deve essere sempre visibile con background trasparente
  if (isMenuOpen) {
    header.style.transform = 'translate(0px, 0%)';
    header.style.background = 'transparent';
    isHeaderVisible = true;
  } else {
    // Se il menu è chiuso, applica la logica di scroll normale
    header.style.background = '#fff';

    // Mantieni la posizione attuale dell'header basata sullo scroll
    if (window.scrollY <= 0) {
      header.style.transform = 'translate(0px, 0%)';
      isHeaderVisible = true;
    }
    // Non modificare la posizione se stiamo scrollando - lascia che handleScroll se ne occupi
  }
}

// Gestione del menu wrapper
function toggleHeaderBackground() {
  const menuWrapper = document.querySelector('.menu--wrapper');
  const header = document.querySelector('.header');

  if (!menuWrapper || !header) {
    console.warn('Elementi .menu--wrapper o .header non trovati');
    return;
  }

  const menuWrapperStyle = window.getComputedStyle(menuWrapper);
  const wasMenuOpen = isMenuOpen;
  isMenuOpen = menuWrapperStyle.display === 'block';

  // Solo se lo stato del menu è cambiato
  if (wasMenuOpen !== isMenuOpen) {
    if (isMenuOpen) {
      // Menu aperto - elementi bianchi
      const logoSvgPaths = document.querySelectorAll('a.header--left--logo svg path');
      logoSvgPaths.forEach(path => {
        path.style.setProperty('fill', '#fff', 'important');
      });

      const menuIcons = document.querySelectorAll('.header .menu--icon');
      menuIcons.forEach(icon => {
        icon.style.setProperty('background', '#fff', 'important');
      });

      addMenuIconStyles();
    } else {
      // Menu chiuso - ripristina colori originali
      const logoSvgPaths = document.querySelectorAll('a.header--left--logo svg path');
      logoSvgPaths.forEach(path => {
        path.style.removeProperty('fill');
      });

      const menuIcons = document.querySelectorAll('.header .menu--icon');
      menuIcons.forEach(icon => {
        icon.style.removeProperty('background');
      });

      removeMenuIconStyles();
    }

    // Aggiorna l'header con la nuova configurazione
    updateHeader();
  }
}

// Gestione dello scroll
function handleScroll() {
  // Se il menu è aperto, non gestire lo scroll
  if (isMenuOpen) return;

  const currentScrollY = window.scrollY;
  const header = document.querySelector('.header');
  if (!header) return;

  // Se siamo in cima alla pagina, mostra sempre l'header
  if (currentScrollY <= 0) {
    header.style.transform = 'translate(0px, 0%)';
    isHeaderVisible = true;
    lastScrollY = currentScrollY;
    return;
  }

  // Scroll verso il basso - nascondi header
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    if (isHeaderVisible) {
      header.style.transform = 'translate(0px, -100%)';
      isHeaderVisible = false;
    }
  }
  // Scroll verso l'alto - mostra header
  else if (currentScrollY < lastScrollY) {
    if (!isHeaderVisible) {
      header.style.transform = 'translate(0px, 0%)';
      isHeaderVisible = true;
    }
  }

  lastScrollY = currentScrollY;
}

// Funzioni helper per gli stili del menu
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

function removeMenuIconStyles() {
  const dynamicStyles = document.getElementById('dynamic-menu-styles');
  if (dynamicStyles) {
    dynamicStyles.remove();
  }
}

// Observer per il menu
function observeMenuChanges() {
  const menuWrapper = document.querySelector('.menu--wrapper');
  if (!menuWrapper) {
    console.warn('Elemento .menu--wrapper non trovato');
    return;
  }

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

// Throttle per ottimizzare le performance
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Inizializzazione
function initIntegratedHeaderControl() {
  const header = document.querySelector('.header');
  if (!header) {
    console.warn('Elemento .header non trovato');
    return;
  }

  // Imposta stili di transizione
  header.style.transition = 'transform 0.3s ease-in-out, background 0.3s ease-in-out';

  // Assicurati che l'header sia visibile al caricamento
  header.style.transform = 'translate(0px, 0%)';
  header.style.background = '#fff';

  // Avvia observer per menu
  observeMenuChanges();

  // Aggiungi listener per scroll con throttling
  const throttledScroll = throttle(handleScroll, 16);
  window.addEventListener('scroll', throttledScroll);

  return {
    destroy: () => {
      window.removeEventListener('scroll', throttledScroll);
    }
  };
}

// Avvia quando il DOM è pronto
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    window.integratedHeaderControl = initIntegratedHeaderControl();
  }, 100);
});

// Assicurati che l'header sia visibile al caricamento completo
window.addEventListener('load', function() {
  const header = document.querySelector('.header');
  if (header && window.scrollY === 0 && !isMenuOpen) {
    header.style.transform = 'translate(0px, 0%)';
    header.style.background = '#fff';
  }
});
