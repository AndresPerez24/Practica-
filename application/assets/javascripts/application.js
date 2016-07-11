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
    $modal                = $('.js-modal');
    $modalClose           = $('.js-modal-close')

 



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
         this.$movieView = $(`<div class="grid__item small--one-half medium--one-third large--one-fifth">
                                <div class="now-release__movie js-movie-container">              
                                    <a href="" class="js-open-modal">
                                     <img class="now-release__image js-movie-image" src="https://image.tmdb.org/t/p/w1920${movie.poster_path}" alt="">
                                     <a href="#"><span class="icon-heart now-release__like"></span></a>
                                     <span class="now-release__votes js-movie-votes">${movie.vote_count}</span>
                                     <span class="icon-in now-release__download"></span>
                                     <h2 class="now-release__movie-title js-movie-title">${movie.original_title}</h2>
                                    </a> 
                                </div>
                              </div>`);

        var $anchor = this.$movieView.find('.js-open-modal');
        var $movieContainer = this.$movieView.find('js-movie-container');

        this.addModal = function(){
          $modal.addClass('is-open');
        }

        $movieContainer.on('click', $anchor, this.addModal());

        this.removeModal = function(){
          $modal.removeClass('is-open');
        }

        $nowReleaseContainer.append(movie.$movieView);
        console.log(this);
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