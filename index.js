const lastFMkey = "ff2a30e86dd95313c30416251bfab2f2";
const lastFMurl = "https://ws.audioscrobbler.com/2.0/";

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

//Get Album Images
function getAlbumImage(arrImages){
  var image = arrImages.filter(x => x.size == 'large');
  if(image){
    return image[0]["#text"]
  }
   
  return "#";
}

//Display Top Albums
function displayTopAlbums(responseJson){
  console.log(responseJson);
  $('#top-albums').empty();
  let topAlbums = ``;
if(responseJson.error === 6){
  topAlbums += `<li class="item">No Albums Found</li>`
} else {

  for(let i = 0; i < responseJson.topalbums.album.length; i++){
    topAlbums += `<li class="item">
                  <h4>${responseJson.topalbums.album[i].name}</h4>
                  <img src="${getAlbumImage(responseJson.topalbums.album[i].image)}">
                  <p><a href="${responseJson.topalbums.album[i].url}" target="_blank" alt="Searched Band Album Cover Artwork">Listen to the Album</a></p>
                  <p class="playcount">Total Plays: ${responseJson.topalbums.album[i].playcount}</p>
                  </li>`
  }
  }
  $('#top-albums').append(topAlbums);
}

//Display Upcoming Events
function displayEvents(responseJson) {
  console.log(responseJson);
  $("#upcoming-events").empty();
  let upcomingEvents = ``;
  
if (responseJson.events.length === 0) {
  upcomingEvents += `<div class="item"><p>No Upcoming Events Listed</p></div>`;
} else {
  for (let i = 0; i < responseJson.events.length && i <= 4; i++) {
    upcomingEvents += `<div class="item">
      <h5>${responseJson.events[i].title}</h5>
      <p>${responseJson.events[i].venue.name}, ${responseJson.events[i].datetime_utc.slice(0, 10)}</p>
      <p>${responseJson.events[i].venue.display_location}</p>
      <p><a href="${responseJson.events[i].venue.url}" target="_blank">Buy Tickets!</a></p>
      </div>`
    }
  }
  $("#upcoming-events").append(upcomingEvents);
  $("#results").removeClass("hidden");
  $('#results-list').removeClass('hidden');
}

function displayArtistDescription(responseJson) {
  console.log(responseJson);
  $('#artist-description').empty();
  let artistDescription = ``;

  if(responseJson.error === 6) {
    artistDescription += `<p>Whoopsie Daisy! ${responseJson.message}</p>`
  } else {
    artistDescription += `${responseJson.artist.bio.summary}`;
  }

  $('#artist-description').append(artistDescription);
}

//SeatGeek Upcoming Events Request
function getUpcomingEvents(artistInput) {
  artistInput = artistInput.replace(/\s+/g, "-");
  artistInput = artistInput.replace('&', "and");
  artistInput = artistInput.replace('Ó', 'O');
  artistInput = artistInput.replace('á', 'a');

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

//LastFM Artist Description Request
function getArtistDescription(artistInput){

  const artistParams = {
    method: 'artist.getinfo',
    api_key: lastFMkey,
    format: 'json',
    artist: artistInput,
  };

    descriptionQuery = encodeQueryParams(artistParams);
    const descriptionURL = lastFMurl + '?' + descriptionQuery;

console.log(descriptionURL);

    fetch(descriptionURL)
      .then((response) => {
        if(response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((responseJson) => displayArtistDescription(responseJson))
      .catch((err) => {
        $('#js-error-message').text(`Whoops! ${err.message}`);
      });

}

//LastFM Request for Top Albums Limiting to 3
function getTopAlbums(artistInput) {

  const albumParams = {
    api_key: lastFMkey,
    method: "artist.gettopalbums",
    artist: artistInput,
    format: "json",
    limit: 3,
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
    $('#title-card').removeClass('lowered');
  });
}

$(watchButton);
