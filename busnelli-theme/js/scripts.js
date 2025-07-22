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

