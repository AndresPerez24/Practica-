(function(){
    // Hero vars
  var $heroImage                   = $('.js-hero-image'),
    $heroTitle                     = $('.js-hero-title'),
    $releaseDate                   = $('.js-release-date'),
    $runTime                       = $('.js-runtime'),
    $votes                         = $('.js-votes'),
    mainTitle,
    urlImage,
    releaseDate,
    runTime,
    votes,
    api_key                        = "api_key=3791872f32ee6ebb00015d00f51789d1",
    // movie vars
    $movieImage                    = $('.js-movie-image'),
    $movieVotes                    = $('.js-movie-votes'),
    $movieTitle                    = $('.js-movie-title'),
    $nowReleaseContainer           = $('.js-now-release-container'),
    $favoritesContainer            = $('.js-favorites-container'),
    
    // modal vars
    $modal                         = $('.js-modal'),
    $modalClose                    = $('.js-modal-close'),
    $movieTrailer                  = $('.js-movie-trailer'),
    movieTrailerKey,
    similarMovies,
    $movieTitle                    = $('.js-movie-title'),
    $similarContainer              = $('.js-similar-container'),
    movieTemplateSource            = $("#movie-template").html(),
    movieTemplate                  = Handlebars.compile(movieTemplateSource),
    similarMovieTemplateSource     = $('#similar-movie-template').html(),
    similarMovieTemplate           = Handlebars.compile(similarMovieTemplateSource);

  $.get( `http://api.themoviedb.org/3/movie/popular?${api_key}` )
    .then(changeMovies);

  function changeMovies(data){
    var movies    = data.results;
    urlImage      = movies[0].backdrop_path;
    mainTitle     = movies[0].original_title;
    releaseDate   = movies[0].release_date;
    votes         = movies[0].vote_count;
    $heroTitle.html(mainTitle);
    $releaseDate.html(releaseDate);
    $votes.html(votes);
    $heroImage.css("background-image", `url('https://image.tmdb.org/t/p/w1920${urlImage}')`);

    function openModal() {
      $modal.addClass('is-open'); 
    }

    function closeModal(){
      $modal.removeClass('is-open');
    }

    $modalClose.click(function(event){
      event.preventDefault();
      closeModal();
    });

    $.get( `http://api.themoviedb.org/3/movie/${movies[0].id}${api_key}` )
     .then(changeRuntime);

    function changeRuntime(data){
      var movies = data;
      runTime    = movies.runtime;
      $runTime.html(runTime+ "  MINS."); 
    }

    function extendObject(movie) {

      movie.$movieView = $(movieTemplate(movie));

      movie.favorite = false;
      var $modalOpen            = movie.$movieView.find('.js-open-modal'),
          $appendFavoritesLink = movie.$movieView.find('.js-append-favorites'),
          $favoriteView;

      $modalOpen.click(function(event) {
        $similarContainer.html('');
        event.preventDefault();
        $movieTitle.html(movie.original_title);
        $.get( `http://api.themoviedb.org/3/movie/${movie.id}/videos?${api_key}` )
         .then(changeModal);

        function changeModal(data){
          var movieVideos     = data.results;
          movieTrailerKey     = movieVideos[0].key;
          $movieTrailer.html(`<iframe width="854" height="480" src="https://www.youtube.com/embed/${movieTrailerKey}" frameborder="0" allowfullscreen></iframe>`);
        }

        $.get( `http://api.themoviedb.org/3/movie/${movie.id}/similar?${api_key}` )
         .then(changeSimilarMovies);

        function changeSimilarMovies(data){
          similarMovies  = data.results;
          var similiarMoviesAmount = 12;
          $.each(similarMovies, function(index, similarMovie ){
            if(index < similiarMoviesAmount){              
              similarMovie.$similarMovieView = $(similarMovieTemplate(similarMovie));

            $similarContainer.append(similarMovie.$similarMovieView);
            }
          });
        }
        openModal();
      });

      $appendFavoritesLink.click(function(event){
        event.preventDefault();
        if (movie.favorite == false) {   
          $appendFavoritesLink.css('color', 'white');
          $favoriteView = movie.$movieView.clone(true);   
          $favoriteView.appendTo($favoritesContainer); 
          movie.favorite = true;
        } else if (movie.favorite == true) {
          $appendFavoritesLink.css('color', 'red');
          $favoriteView.remove();
          movie.favorite = false;
        }
      });

      $nowReleaseContainer.append(movie.$movieView);

    }

    movies.map(extendObject);
  }

})();