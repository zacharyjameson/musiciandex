const lastFMkey = "ff2a30e86dd95313c30416251bfab2f2";
const lastFMurl = "http://ws.audioscrobbler.com/2.0/";
const wikiURL= 'https://en.wikipedia.org/w/api.php?';

//Formatting Query Parameters
function formatQueryParams(params) {
  const queryItems = Object.keys(params).map((key) => `${key}=${params[key]}`);
  return queryItems.join("&");
}

//Formatting Query Params handling & searches
function encodeQueryParams(params) {
  const encodedItems = Object.keys(params).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return encodedItems.join('&');
}

//Display Top Albums
function displayTopAlbums(responseJson){
  console.log(responseJson);
  $('#top-albums').empty();
  let topAlbums = ``;

  for(let i = 0; i < responseJson.topalbums.album.length; i++){
    topAlbums += `<li class="item">
                  <h5>${responseJson.topalbums.album[i].name}</h5>
                  <p><a href="${responseJson.topalbums.album[i].url}">Listen to the Album</a></p>
                  <p>Total Plays: ${responseJson.topalbums.album[i].playcount}</p>
                  </li>`
  }
  $('#top-albums').append(topAlbums);
}

//Display Upcoming Events
function displayEvents(responseJson) {
  console.log(responseJson);
  $("#upcoming-events").empty();
  let upcomingEvents = ``;

  for (let i = 0; i < responseJson.events.length && i <= 2; i++) {
    upcomingEvents += `<div class="item"><img src="#">
                        <h5>${responseJson.events[i].title}</h5>
                        <p>${responseJson.events[i].venue.name}, ${responseJson.events[i].datetime_utc.slice(0, 10)}</p>
                        <p>${responseJson.events[i].venue.display_location}</p>
                        <p><a href="${responseJson.events[i].venue.url}">Buy Tickets!</a></p>
                        </div>`
  }
  $("#upcoming-events").append(upcomingEvents);
  $("#results").removeClass("hidden");
}

//SeatGeek Upcoming Events Request
function getUpcomingEvents(artistInput) {
  artistInput = artistInput.replace(/\s+/g, "-");
  artistInput = artistInput.replace('&', "and");

  const seatGeekURL = `https://api.seatgeek.com/2/events?client_id=MjE1MTkyODd8MTYxMTc5OTA3Ny40NDYwODkz&performers.slug=${artistInput}`;
  console.log(seatGeekURL);

  fetch(seatGeekURL)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayEvents(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Whoops! ${err.message}`);
    });
}

//Wikipedia Artist Description Request
function getArtistDescription(artistInput){
  artistInput = artistInput.replace(/\s/g, "");

  const artistParams = {
    action: 'query',
    format: 'json',
    prop: 'extracts',
    titles: artistInput,
    exintro: 1
  };

    descriptionQuery = encodeQueryParams(artistParams);
    const descriptionURL = wikiURL + '?' + descriptionQuery;

    console.log(descriptionURL);

}

//LastFM Request for Top Albums Limiting to 5
function getTopAlbums(artistInput) {
  artistInput = artistInput.replace(/\s/g, "");

  const albumParams = {
    api_key: lastFMkey,
    method: "artist.gettopalbums",
    artist: artistInput,
    format: "json",
    limit: 5,
  };

  const albumQuery = encodeQueryParams(albumParams);
  const albumURL = lastFMurl + "?" + albumQuery;

  console.log(albumURL);

  fetch(albumURL)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayTopAlbums(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Whoops! ${err.message}`);
    });
}

function displayArtistName(artistName) {
  $("#searched-artist").empty();
  $('#js-error-message').empty();
  $("#searched-artist").append(artistName);
}

function watchButton() {
  $("form").submit((event) => {
    event.preventDefault();
    const musicianSearch = $("#js-musician-search").val();
    getUpcomingEvents(musicianSearch);
    displayArtistName(musicianSearch);
    getTopAlbums(musicianSearch);
    getArtistDescription(musicianSearch);
  });
}

$(watchButton);
