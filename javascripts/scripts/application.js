(function(){
    // Hero vars
  var $heroImage          = $('.js-hero-image'),
    $heroTitle            = $('.js-hero-title'),
    $releaseDate          = $('.js-release-date'),
    $runTime              = $('.js-runtime'),
    $votes                = $('.js-votes'),
    mainTitle,
    urlImage,
    releaseDate,
    runTime,
    votes,
    // movie vars
    $movieImage           = $('.js-movie-image'),
    $movieVotes           = $('.js-movie-votes'),
    $movieTitle           = $('.js-movie-title'),
    $nowReleaseContainer  = $('.js-now-release-container'),
    // modal vars
    $modal                = $('.js-modal'),
    $modalClose           = $('.js-modal-close'),
    $movieTrailer         = $('.js-movie-trailer'),
    movieTrailerKey,
    similarMovies,
    $movieTitle           = $('.js-movie-title'),
    $favoritesContainer   = $('.js-favorites-container')

 



  $.get( "http://api.themoviedb.org/3/movie/popular?api_key=3791872f32ee6ebb00015d00f51789d1" )
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



    $.each(movies, function( index, movie ){
      if(index < 20) {
         movie.$movieView = $(`<div class="grid__item small--one-half medium--one-third large--one-fifth">
                                <div class="now-release__movie js-movie-container">              
                                    <a href="" class="js-open-modal">
                                     <img class="now-release__image " src="https://image.tmdb.org/t/p/w1920${movie.poster_path}" alt="">
                                     <a href="#"><span class="icon-heart now-release__like"></span></a>
                                     <span class="now-release__votes ">${movie.vote_count}</span>
                                     <span class="icon-in now-release__download"></span>
                                     <h2 class="now-release__movie-title ">${movie.original_title}</h2>
                                    </a> 
                                </div>
                              </div>`);

        var $modalOpen = movie.$movieView.find('.js-open-modal');

        $modalOpen.click(function(event) {
          event.preventDefault();
          movie.openModal();
          $movieTitle.html(movie.original_title);
          $.get( "http://api.themoviedb.org/3/movie/"+movie.id+"/videos?api_key=3791872f32ee6ebb00015d00f51789d1" )
          .then(changeModal);

          function changeModal(data){
            var movieVideos     = data.results;
            movieTrailerKey     = movieVideos[0].key;
            $movieTrailer.html(`'<iframe width="854" height="480" src="https://www.youtube.com/embed/${movieTrailerKey}" frameborder="0" allowfullscreen></iframe>'`);
            }

            $.get( "http://api.themoviedb.org/3/movie/"+movie.id+"/similar?api_key=3791872f32ee6ebb00015d00f51789d1" )
              .then(changeSimilarMovies);

            function changeSimilarMovies(data){
              similarMovies  = data.results;
               
            }

            $.each(similarMovies, function(index, similarMovie ){
              if(index < 10){              
                similarMovie.$similarMovieView = $(`<div class="grid__item large--one-sixth">
                                                    <div class="content__movie">
                                                      <a href="#"><img src="https://image.tmdb.org/t/p/w1920${similarMovie.poster_path}" alt=""></a>
                                                      <h3 class="content__movie-title">${similarMovie.original_title}</h3>
                                                      </div>
                                                    </div>
                                                      `);
              console.log(similarMovie);
               $favoritesContainer.append(similarMovie.$similarMovieView);
              }
            });

        });

        $modalClose.click(function(event){
          event.preventDefault();
          movie.closeModal();
        });

        movie.openModal = function(){
          $modal.addClass('is-open');
        }

        movie.closeModal = function(){
          $modal.removeClass('is-open');
        }

        $nowReleaseContainer.append(movie.$movieView);
      }
    });


    $.get( "http://api.themoviedb.org/3/movie/"+movies[0].id+"?api_key=3791872f32ee6ebb00015d00f51789d1" )
      .then(changeRuntime);

    function changeRuntime(data){
      var movies = data;
      runTime    = movies.runtime;
      $runTime.html(runTime+ "  MINS."); 
    }

  }

})();