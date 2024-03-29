let currentMovieStack = [];

const homeButton = document.querySelector("#home-button");
const searchBox = document.querySelector("#search-box");
const goToFavouriteButton = document.querySelector("#goto-favourites-button");
const movieCardContainer = document.querySelector("#movie-card-container")

function showAlert(message){
	alert(message);
}

function renderList(actionForButton){
	movieCardContainer.innerHTML = '';

	for(let i = 0; i<currentMovieStack.length; i++){
		let movieCard = document.createElement('div');
		movieCard.classList.add("movie-card");
		// console.log(currentMovieStack[i]);

		movieCard.innerHTML = `
		<img src="${'https://image.tmdb.org/t/p/w500' + currentMovieStack[i].poster_path}" alt="${currentMovieStack[i].title}" class="movie-poster">
		<div class="movie-title-container">
			<span>${currentMovieStack[i].title}</span>
			<div class="rating-container">
				<img src="rating-icon.png" alt="">
				<span>${currentMovieStack[i].vote_average}</span>
			</div>
		</div>

		<button id="${currentMovieStack[i].id}" onclick="getMovieInDetail(this)" style="height:40px;"> Movie Details </button>

		<button onclick="${actionForButton}(this)" class="add-to-favourite-button text-icon-button" data-id="${currentMovieStack[i].id}" >
			<img src="favourites-icon.png">
			<span>${actionForButton}</span>
		</button>
		`;
		movieCardContainer.append(movieCard);
	}
}

function printError(message){
	const errorDiv = document.createElement("div");
	errorDiv.innerHTML = message;
	errorDiv.style.height = "100%";
	errorDiv.style.fontSize = "5rem";
	errorDiv.style.margin = "auto";
	movieCardContainer.innerHTML = "";
	movieCardContainer.append(errorDiv);
}

function getTrandingMovies(){
	const tmdb = fetch("https://api.themoviedb.org/3/trending/movie/day?api_key=cb213741fa9662c69add38c5a59c0110")
	.then((response) => response.json())
	.then((data) => {
		currentMovieStack = data.results;
		renderList("favourite");
	})
	.catch((err) => printError(err));
}
getTrandingMovies();

homeButton.addEventListener('click', getTrandingMovies);

searchBox.addEventListener('keyup' , ()=>{
	let searchString = searchBox.value;
	
	if(searchString.length > 0){
		let searchStringURI = encodeURI(searchString);
		const searchResult = fetch(`https://api.themoviedb.org/3/search/movie?api_key=cb213741fa9662c69add38c5a59c0110&language=en-US&page=1&include_adult=false&query=${searchStringURI}`)
			.then((response) => response.json())
			.then((data) =>{
				currentMovieStack = data.results;
				renderList("favourite");
			})
			.catch((err) => printError(err));
	}
})

function favourite(element){
	let id = element.dataset.id;
	for(let i = 0; i< currentMovieStack.length; i++){
		if(currentMovieStack[i].id == id){
			let favouriteMoviePriyanka = JSON.parse(localStorage.getItem("favouriteMoviePriyanka"));
			
			if(favouriteMoviePriyanka == null){
				favouriteMoviePriyanka = [];
			}

			favouriteMoviePriyanka.unshift(currentMovieStack[i]);
			localStorage.setItem("favouriteMoviePriyanka", JSON.stringify(favouriteMoviePriyanka));

			showAlert(currentMovieStack[i].title + " added to favourite")
			return;
		}
	}
}

goToFavouriteButton.addEventListener('click', ()=>{
	let favouriteMoviePriyanka = JSON.parse(localStorage.getItem("favouriteMoviePriyanka"));
	if(favouriteMoviePriyanka == null || favouriteMoviePriyanka.length < 1){
		showAlert("you have not added any movie to favourite");
		return;
	}

	currentMovieStack = favouriteMoviePriyanka;
	renderList("remove");
})

function remove(element){
	let id = element.dataset.id;
	let favouriteMoviePriyanka = JSON.parse(localStorage.getItem("favouriteMoviePriyanka"));
	let newFavouriteMovies = [];
	for(let i = 0; i<favouriteMoviePriyanka.length; i++){
		if(favouriteMoviePriyanka[i].id == id){
			continue;
		}
		newFavouriteMovies.push(favouriteMoviePriyanka[i]);
	}
	
	localStorage.setItem("favouriteMoviePriyanka", JSON.stringify(newFavouriteMovies));
	currentMovieStack = newFavouriteMovies;
	renderList("remove");
}

function renderMovieInDetail(movie){
	console.log(movie);
	movieCardContainer.innerHTML = '';
	
	let movieDetailCard = document.createElement('div');
	movieDetailCard.classList.add('detail-movie-card');

	movieDetailCard.innerHTML = `
		<img src="${'https://image.tmdb.org/t/p/w500' + movie.backdrop_path}" class="detail-movie-background">
		<img src="${'https://image.tmdb.org/t/p/w500' + movie.poster_path}" class="detail-movie-poster">
		<div class "detail-movie-title">
			<span>${movie.title}</span>
			<div class="detail-movie-rating">
				<img src="rating-icon.png">
				<span>${movie.vote_average}</span>
			</div>
		</div>
		<div class="detail-movie-plot">
			<p>${movie.overview}</p>
			<p>Release date : ${movie.release_date}</p>
			<p>runtime : ${movie.runtime} minutes</p>
			<p>tagline : ${movie.tagline}</p>
		</div>
	`;

	movieCardContainer.append(movieDetailCard);
}

function getMovieInDetail(element){

	fetch(`https://api.themoviedb.org/3/movie/${element.getAttribute('id')}?api_key=cb213741fa9662c69add38c5a59c0110&language=en-US`)
		.then((response) => response.json())
		.then((data) => renderMovieInDetail(data))
		.catch((err) => printError(err));

}
