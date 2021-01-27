function watchButton() {
    $("form").submit((event) => {
        event.preventDefault();
        const musicianSearch = $('#js-musician-search').val();
        console.log(musicianSearch);
    })
};

$(watchButton);