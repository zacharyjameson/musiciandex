function formatQueryParams(params) {
  const queryItems = Object.keys(params).map((key) => `${key}=${params[key]}`);
  return queryItems.join("&");
}

//function displayResults(LastFM, SeatGeek, iTunes) {

//};

function displayEvents(responseJson) {
  console.log(responseJson);
    $('#upcoming-events').empty();
  $("#upcoming-events").append(
    `<h4 class="results-titles">Upcoming Events</h4>
        <div class="group item">
            <div class="item"><img src="#"><h5>${responseJson.events[0].title}</h5><p>${responseJson.events[0].venue.name}</p><p>${responseJson.events[0].venue.display_location}</p></div>
            <div class="item"><img src="#"><h5>${responseJson.events[1].title}</h5><p>${responseJson.events[1].venue.name}</p><p>${responseJson.events[1].venue.display_location}</p></div>
            <div class="item"><img src="#"><h5>${responseJson.events[2].title}</h5><p>${responseJson.events[2].venue.name}</p><p>${responseJson.events[2].venue.display_location}</p></div>
        </div>`
  );

  $("#results").removeClass("hidden");
}

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
  });
}

$(watchButton);
