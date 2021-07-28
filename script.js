'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = ` <article class="country ${className}">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)}</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${
              data.currencies[0].name
            }</p>
          </div>
        </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

const renderErrorMsg = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};

///////////////////////////////////////

/*const getCountryData = function (country) {
  //XML http request function (outdated way to to requests)
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`); // 1st argument: type of request   2nd: url
  request.send(); // send request fetches data in the background
  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText); //convert JSON to js object
    console.log(data);

    const html = ` <article class="country">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)}</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${
              data.currencies[0].name
            }</p>
          </div>
        </article>`;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });
};

getCountryData('germany');
getCountryData('brasil');
getCountryData('south africa');*/

// Sequence of AJAX calls

/*const getCountryAndNeighbour = function (country) {
  //XML http request function (outdated way to to requests)
  // AJAX call country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`); // 1st argument: type of request   2nd: url
  request.send(); // send request fetches data in the background
  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText); //convert JSON to js object
    console.log(data);
    renderCountry(data);

    //Get neighbour country
    const [neighbour] = data.borders;
    if (!neighbour) return;
    // AJAX call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.eu/rest/v2/alpha/${neighbour}`); // 1st argument: type of request   2nd: url
    request2.send();

    request2.addEventListener('load', function () {
      const data2 = JSON.parse(this.responseText);
      console.log(data2);
      renderCountry(data2, 'neighbour');
    });
  });
};

getCountryAndNeighbour('germany');*/

//////// Promises and the fetch API, Consuming promises ////////
// old way
// const request = new XMLHttpRequest();
// request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`); // 1st argument: type of request   2nd: url
// request.send();

// new way
// const request = fetch(`https://restcountries.eu/rest/v2/name/portugal`);
// console.log(request);

/*const getCountryData = function (country) {
  fetch(`https://restcountries.eu/rest/v2/name/${country}`)
    .then(function (response) {
      console.log(response);
      return response.json(); // to read data we need to call json method on reponse
    })
    .then(function ([data]) {
      console.log(data);
      renderCountry(data);
    });
};*/

// helper function
const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok)
      // ok = status 200, everything is fine
      throw new Error(`${errorMsg} (${response.status})`); // status displays the type of error, throw immediately terminate current function just like return and propagate down to the catch method
    return response.json();
  });
};

// refactored
const getCountryData = function (country) {
  // country 1
  getJSON(
    `https://restcountries.eu/rest/v2/name/${country}`,
    `Country not found`
  )
    .then(([data]) => {
      renderCountry(data);
      const neighbour = data.borders[0];

      if (!neighbour) throw new Error(`No neighbour found!`);
      // country 2
      return getJSON(
        `https://restcountries.eu/rest/v2/alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then(response => response.json())
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`${err} 💥`);
      renderErrorMsg(
        `Something went wrong 💥 ${err.message}. Please try again!`
      ); // catches any error in the promise chain
    })
    .finally(() => {
      countriesContainer.style.opacity = 1; //
    });
};

// Then method only called when promise is fulfilled
// Catch only while promise is reject4ed
// Finally will always be called, no matter what (useful for loading spinner for example)

btn.addEventListener('click', function () {
  getCountryData('germany');
});

getCountryData('Germany');

//// Event Loop in Practice
console.log('Test start');
setTimeout(() => console.log('0 sec timer'), 0);
Promise.resolve('Resolved promise 1').then(res => console.log(res));

Promise.resolve('Resolved Promise 2').then(res => {
  for (let i = 0; i < 1000000000; i++) {}
  console.log(res);
});
console.log('Test end');
