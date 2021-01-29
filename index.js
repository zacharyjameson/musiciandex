const lastFMkey = 'ff2a30e86dd95313c30416251bfab2f2';
const lastFMurl = 'http://ws.audioscrobbler.com/2.0/';


//Formatting Query Parameters
function formatQueryParams(params) {
  const queryItems = Object.keys(params).map((key) => `${key}=${params[key]}`);
  return queryItems.join("&");
}

//Display Upcoming Events
function displayEvents(responseJson) {
  console.log(responseJson);
    $('#upcoming-events').empty();

//for(let i = 0; i <responseJson.events.length && i <= 2; i++){
    //Use a for loop to loop through the events[i] information and then continuing appending to the actual div display body until reach the max limit
//}
  $("#upcoming-events").append(
    `<div class="item"><img src="#"><h5>${responseJson.events[0].title}</h5><p>${responseJson.events[0].venue.name}</p><p>${responseJson.events[0].venue.display_location}</p></div>
    <div class="item"><img src="#"><h5>${responseJson.events[1].title}</h5><p>${responseJson.events[1].venue.name}</p><p>${responseJson.events[1].venue.display_location}</p></div>
    <div class="item"><img src="#"><h5>${responseJson.events[2].title}</h5><p>${responseJson.events[2].venue.name}</p><p>${responseJson.events[2].venue.display_location}</p></div>
    `
  );

  $("#results").removeClass("hidden");
}

//SeatGeek Upcoming Events Request
function getUpcomingEvents(artistInput) {
  artistInput = artistInput.replace(/\s/g, "-");

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

//LastFM Request for Top Albums Limiting to 5
function getTopAlbums(artistInput){
    artistInput = artistInput.replace(/\s/g, "");

    const albumParams = {
        api_key: lastFMkey,
        method: 'artist.gettopalbums',
        artist: artistInput,
        format: 'json',
        limit: 5,
    };

    const albumQuery = formatQueryParams(albumParams);
    const albumURL = lastFMurl + '?' + albumQuery;

    console.log(albumURL);

    fetch(albumURL)
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then((responseJson) => console.log(responseJson))
        .catch((err) => {
            $('#js-error-message').text(`Whoops! ${err.message}`);
        });
}

function displayArtistName(artistName){
    $('#searched-artist').empty();
    $('#searched-artist').append(artistName);
}

function watchButton() {
  $("form").submit((event) => {
    event.preventDefault();
    const musicianSearch = $("#js-musician-search").val();
    getUpcomingEvents(musicianSearch);
    displayArtistName(musicianSearch);
    getTopAlbums(musicianSearch);
  });
}

$(watchButton);
