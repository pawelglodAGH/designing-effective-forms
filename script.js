let clickCount = 0;
const countryInput = document.getElementById('countryInput');
const countryCodeSelect = document.getElementById('countryCode');
const phoneNumberInput = document.getElementById('phoneNumber');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common);
        const countryList = document.getElementById('countryList');
        
        // Filtruj kraje, których nazwy zaczynają się od wprowadzonych liter
        const filteredCountries = countries.filter(country => country.toLowerCase().startsWith(countryInput.value.toLowerCase()));
        
        countryList.innerHTML = filteredCountries.map(country => `<option value="${country}">`).join('');
        
        // Wywołanie funkcji do uzyskania kraju użytkownika na podstawie IP
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
    getCountryByIP(); // Przeniesione wywołanie funkcji getCountryByIP()
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then(response => response.json())
      .then(data => {
        const country = data.country;
        countryInput.value = country; // Zmiana na 'countryInput'
        // Wywołanie funkcji do uzyskania kodu kraju na podstawie nazwy
        getCountryCode(country);
      })
      .catch(error => {
        console.error('Błąd pobierania danych z serwera GeoJS:', error);
      });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Błąd pobierania danych');
        }
        return response.json();
      })
      .then(data => {
        const countryCode = data[0].idd.root + data[0].idd.suffixes.join("");
        countryCodeSelect.value = countryCode; // Zmiana na 'countryCodeSelect'
      })
      .catch(error => {
        console.error('Wystąpił błąd:', error);
      });
}

(() => {
    // Nasłuchiwanie na zdarzenie kliknięcia myszką
    document.addEventListener('click', handleClick);
    
    fetchAndFillCountries();
  
    // Zainicjowanie pola wyboru jako select2
    $('#country').select2({
      placeholder: 'Wybierz kraj',
      allowClear: true // Dodaje opcję usuwania wyboru
    });

    // Obsługa wysłania formularza przez klawiaturę (po naciśnięciu Enter)
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Zapobiega domyślnej akcji Enter (np. wysłaniu formularza)
            validateForm(); // Wywołuje funkcję walidacji formularza
        }
    });

    // Obsługa wysyłania formularza
    myForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Zapobiega domyślnej akcji wysłania formularza
        validateForm(); // Wywołuje funkcję walidacji formularza
    });

    // Dodanie innych skrótów klawiaturowych (jeśli są potrzebne)
    document.addEventListener('keydown', function(event) {
        // Przykładowy skrót klawiaturowy (Ctrl + S) do innego działania
        if (event.ctrlKey && event.key === 's') {
            // Wykonaj inną akcję
            event.preventDefault();
            console.log('Zapisano formularz');
        }
    });



})();
