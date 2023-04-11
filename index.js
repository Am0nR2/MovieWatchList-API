const mainMovieList = document.getElementById("main-movie-list")
const apiKey = "a7e45094"

const renderedMovies = []
let watchList = JSON.parse(localStorage.getItem("watchList")) ? JSON.parse(localStorage.getItem("watchList")) : []
let watchListMovieIDS = JSON.parse(localStorage.getItem("watchListMovieIDS")) ? JSON.parse(localStorage.getItem("watchListMovieIDS")) : []

if (renderedMovies.length === 0){
    document.getElementById("main-movie-list").innerHTML = `
    <div class="explore-cinema">
        <i class="fa-solid fa-film"></i>
        <p>Start To Explore</p>
    </div>
    `
}
document.addEventListener("click", function(e){
    if(e.target.dataset.watch){
        
        
        if(document.getElementById("main-watch-list")){
        handleWatchListClicks(e.target.dataset.watch, watchList)
        console.log(watchList)
        console.log(watchListMovieIDS)
        document.getElementById("main-watch-list").innerHTML = ""
        renderWatchList()
         }else {
        handleWatchListClicks(e.target.dataset.watch, renderedMovies)
        console.log(watchList)
        }
        localStorage.setItem("watchList", JSON.stringify(watchList))
        localStorage.setItem("watchListMovieIDS", JSON.stringify(watchListMovieIDS))
    }
})
if(document.getElementById("movie-search-form")){
    document.getElementById("movie-search-form").addEventListener("submit", handleSearchBtn)
}

// Render WatchList Function
function renderWatchList(){   
    if(watchList.length === 0){
        document.getElementById("main-watch-list").innerHTML = `
        <div class="empty-watch-list">
            <h2>Oppss, It Seems Your Watch List is Empty, click <a href="./index.html">here</a> and go find a movie for yourself</h2>
        </div>
        `
    }else {
        watchList.map(movie => renderSearcedMovies(movie, "main-watch-list"))
    }
    
}
renderWatchList()
// Search Movie BTN Function
function handleSearchBtn(e){
    mainMovieList.innerHTML = " "
    const searchResults = []
    e.preventDefault()
    
    const movieSearch = document.getElementById("movie-search-input").value

    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${movieSearch}&type=movie`)
    .then(response => response.json())
    .then(data =>{
        
        data.Search.map(movie=> searchResults.push(movie.imdbID))
        searchResults.map((id)=>{
            fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`)
                .then(response => response.json())
                .then(data => {
                    
                    renderSearcedMovies(data, "main-movie-list")
                    data.addedToWatchList = watchListMovieIDS.includes(data.imdbID) ? true 
                    : false
                    renderedMovies.push(data)
                })     
        })
    })
}

// Render All Searched Movies To the Screen Functions
function renderSearcedMovies(movie, divID){
    
    if(document.getElementById(divID)){
    const watchlistHTML = !watchListMovieIDS.includes(movie.imdbID) ? 
        `<P class="watchlist" data-watch="${movie.imdbID}"><i class="fa-solid fa-circle-plus plus"></i> WatchList</P>`
    :   `<P class="watchlist" data-watch="${movie.imdbID}"><i class="fa-sharp fa-solid fa-circle-check check"></i> WatchList</P>`
  
    document.getElementById(divID).innerHTML += `
        <div class="movie-card" id="${movie.imdbID}">
            <img class="image" src="${movie.Poster}" alt="${movie.Title}">
            <h3 class="title">${movie.Title}</h3>
            <p class="imdb"><i class="fa-solid fa-star star"></i>${movie.imdbRating}</p>
            <P class="genre">${movie.Genre}</P>
            ${watchlistHTML}
            <P class="actors">${movie.Actors}</P>
            <P class="plot">${movie.Plot}</P>
        </div>
       `
    }
}

// WatchList add and Remove Functions and Some Rendering 
function handleWatchListClicks(movieId ,movieArr){
    const addedMovie = movieArr.filter(movie=>{
        return movie.imdbID === movieId
     })[0]
    if(!addedMovie.addedToWatchList){
       
            watchListMovieIDS.push(movieId)
        
            watchList.push(addedMovie)
     
        
        document.getElementById(movieId).children[4].children[0].classList.remove("fa-solid", "fa-circle-plus", "plus") 
        document.getElementById(movieId).children[4].children[0].classList.add("fa-sharp", "fa-solid", "fa-circle-check", "check") 
        
    } else{
        removeElementIDFromWatchList(movieId)
        removeElementFromWatchList(movieId)
        document.getElementById(movieId).children[4].children[0].classList.remove("fa-sharp", "fa-solid", "fa-circle-check", "check") 
        document.getElementById(movieId).children[4].children[0].classList.add("fa-solid", "fa-circle-plus", "plus") 

    }
    addedMovie.addedToWatchList = !addedMovie.addedToWatchList 
    
}
// Remove Elements ID's from Arrays 
function removeElementIDFromWatchList(movieId){
    watchListMovieIDS = watchListMovieIDS.filter(id =>{
        return  id  !==  movieId
    })
}
function removeElementFromWatchList(movieId){
    watchList = watchList.filter(movie =>{
        return movie.imdbID !== movieId
    })
}








  



   

