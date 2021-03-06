var rhit = rhit || {};

rhit.FB_COLLECTION_MOVIE = "Movies";
rhit.FB_COLLECTION_REVIEW = "Reviews";
rhit.FB_COLLECTION_USER = "Users";
rhit.FB_KEY_MOVIEPIC = "MoviePic";
rhit.FB_KEY_NAME = "Name";
rhit.FB_KEY_RATING = "rating";
rhit.FB_KEY_TYPE = "type";
rhit.FB_KEY_MOVIE = "Movie";
rhit.FB_KEY_REVIEW = "Review";
rhit.FB_KEY_USERID = "UserID"
rhit.FB_KEY_COUNT = "count";
rhit.FB_KEY_FAV = "fav"
rhit.FB_KEY_ID = "ID";
rhit.FB_KEY_USERFAV = "favorite";
rhit.fbMoviesManager = null;
rhit.fbReviewsManager = null;
rhit.fbSingleMovieManager = null;
rhit.fbAuthManager = null;

function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.MainPageController = class {
	constructor() {
		// let promise = fetch('https://www.omdbapi.com/?apikey=691ddc11&t=the+lego+movie').then( response => response.json()) .then(data => console.log(data));
		document.querySelector("#menuShowAllMovies").addEventListener("click", (event) => {
			console.log("Show all movies");
			window.location.href = "/mainpage.html";

		});
		document.querySelector("#menuShowMyMovies").addEventListener("click", (event) => {
			console.log("Show my favorites");
			window.location.href = `/favoriteMovie.html?uid=${rhit.fbAuthManager.uid}`;

		});
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});
		document.querySelector("#menuShowMyProfile").addEventListener("click", (event) => {

			console.log("profile");
			window.location.href = `/profile.html?uid=${rhit.fbAuthManager.uid}`

		});
		document.querySelector("#menuShowMyReviews").addEventListener("click", (event) => {
			window.location.href = `/review.html?uid=${rhit.fbAuthManager.uid}`
		});
		document.querySelector("#submitAddMovie").addEventListener("click", (event) => {
			const moviePic = document.querySelector("#inputMoviePic").value;
			const name = document.querySelector("#inputMovie").value;
			const type = document.querySelector("#inputType").value;
			rhit.fbMoviesManager.add(moviePic, name, type);
			// $('#addQuoteDialog').modal('hide')

		});
		console.log(rhit.fbAuthManager.uid);
		if (rhit.fbAuthManager.uid != "linj3"){
			document.querySelector("#fab").remove();
		}

			console.log("xxxx");
			$("#addMovieDialog").on('show.bs.modal', (event) => {
				// Pre animation
				document.querySelector("#inputMoviePic").value = "";
				document.querySelector("#inputMovie").value = "";
				document.querySelector('#inputType').value = "";
			});
			$("#addMovieDialog").on('shown.bs.modal', (event) => {
				document.querySelector("#inputMoviePic").focus();
			});
		document.querySelector("#submitSearch").addEventListener("click", (event) => {
			const name = document.querySelector("#inputSearchMovie").value;
			const i = rhit.fbMoviesManager.search(name);
			rhit.fbMoviesManager.beginListening(this.searchMovie.bind(this, i));
		});
		rhit.fbMoviesManager.beginListening(this.updateList.bind(this));
	}
	searchMovie(arr) {
		const newList = htmlToElement('<div id="movieListContainer"><div>');
		for(let i = 0; i < arr.length; i++){
		const m = rhit.fbMoviesManager.getMovieAtIndex(arr[i]);
		console.log(m.movie);
		console.log(m.type);
		const newCard = this._createCard(m);
		newCard.onclick = (event) => {
			// console.log(`You clicked on ${mq.id}`);
			// rhit.storage.setMovieQuoteId(mq.id);
			window.location.href = `/movie.html?id=${m.id}&uid=${rhit.fbAuthManager.uid}`;
		};
		newList.appendChild(newCard);
		}
		const oldList = document.querySelector("#movieListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}
	updateList() {
		const newList = htmlToElement('<div id="movieListContainer"><div>');
		for (let i = 0; i < rhit.fbMoviesManager.length; i++) {
			const m = rhit.fbMoviesManager.getMovieAtIndex(i);
			// console.log(m.movie);
			// console.log(m.type);
			const newCard = this._createCard(m);
			newCard.onclick = (event) => {
				// console.log(`You clicked on ${mq.id}`);
				// rhit.storage.setMovieQuoteId(mq.id);
				window.location.href = `/movie.html?id=${m.id}`;
			};
			newList.appendChild(newCard);
		}
		const oldList = document.querySelector("#movieListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}

	_createCard(movie) {
		if (Math.floor(movie.rating) == 1) {
			return htmlToElement(`<div class="card">
			<div class="card-body">
		  <img src="${movie.moviePic} alt="${movie.name}" width="100" height="150">
		  <h5 class="card-title">${movie.name}</h5>
		  <h6 class="card-subtitle mb-2 text-muted">${movie.type}</h6>
		  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`);
		} else if (Math.floor(movie.rating) == 2) {
			return htmlToElement(`<div class="card">
			<div class="card-body">
			<img src="${movie.moviePic} alt="${movie.name}" width="100" height="150">
		  <h5 class="card-title">${movie.name}</h5>
		  <h6 class="card-subtitle mb-2 text-muted">${movie.type}</h6>
			  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`)
		} else if (Math.floor(movie.rating) == 3) {
			return htmlToElement(`<div class="card">
			<div class="card-body">
			<img src="${movie.moviePic} alt="${movie.name}" width="100" height="150">
			<h5 class="card-title">${movie.name}</h5>
			<h6 class="card-subtitle mb-2 text-muted">${movie.type}</h6>
			  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`)
		} else if (Math.floor(movie.rating) == 4) {
			return htmlToElement(`<div class="card">
			<div class="card-body">
			<img src="${movie.moviePic} alt="${movie.name}" width="100" height="150">
		  <h5 class="card-title">${movie.name}</h5>
		  <h6 class="card-subtitle mb-2 text-muted">${movie.type}</h6>
			  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`)
		}
		return htmlToElement(`<div class="card">
			<div class="card-body">
			<img src="${movie.moviePic} alt="${movie.name}" width="100" height="150">
			<h5 class="card-title">${movie.name}</h5>
			<h6 class="card-subtitle mb-2 text-muted">${movie.type}</h6>
			  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`)
	}


}

rhit.ReviewsPageController = class {
	constructor() {
		// let promise = fetch('https://www.omdbapi.com/?apikey=691ddc11&t=the+lego+movie').then( response => response.json()) .then(data => console.log(data));
		document.querySelector("#menuShowAllMovies").addEventListener("click", (event) => {
			console.log("Show all movies");
			window.location.href = "/mainpage.html";

		});
		document.querySelector("#menuShowMyMovies").addEventListener("click", (event) => {
			console.log("Show my favorites");
			window.location.href = `/favoriteMovie.html?uid=${rhit.fbAuthManager.uid}`;

		});
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});
		document.querySelector("#menuShowMyProfile").addEventListener("click", (event) => {
			window.location.href = `/profile.html?uid=${rhit.fbAuthManager.uid}`
		});
		document.querySelector("#menuShowMyReviews").addEventListener("click", (event) => {
			window.location.href = `/review.html?uid=${rhit.fbAuthManager.uid}`
		});
		rhit.fbReviewsManager.beginListening(this.updateList.bind(this));
	}

	updateList() {
		const newList = htmlToElement('<div id="reviewListContainer"><div>');
		for (let i = 0; i < rhit.fbReviewsManager.length; i++) {
			const m = rhit.fbReviewsManager.getReviewAtIndex(i);

			console.log(m.movie);
			console.log(m.rating);
			console.log(m.userid);
			if (m.userid == rhit.fbAuthManager.uid) {
				const newCard = this._createCard(m);
				newList.appendChild(newCard);
			}
		}
		const oldList = document.querySelector("#reviewListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}

	_createCard(review) {
		if (Math.floor(review.rating) == 1) {
			return htmlToElement(`<div class="card">
			<div class="card-body">
			<h5 class="card-title">${review.movie}</h5>
			<h6 class="card-subtitle mb-2 text-muted">${review.review}</h6>
		  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`);
		} else if (Math.floor(review.rating) == 2) {
			return htmlToElement(`<div class="card">
			<div class="card-body">
			<h5 class="card-title">${review.movie}</h5>
			<h6 class="card-subtitle mb-2 text-muted">${review.review}</h6>
			  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`)
		} else if (Math.floor(review.rating) == 3) {
			return htmlToElement(`<div class="card">
			<div class="card-body">
			<h5 class="card-title">${review.movie}</h5>
			<h6 class="card-subtitle mb-2 text-muted">${review.review}</h6>
			  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`)
		} else if (Math.floor(review.rating) == 4) {
			return htmlToElement(`<div class="card">
			<div class="card-body">
			<h5 class="card-title">${review.movie}</h5>
			<h6 class="card-subtitle mb-2 text-muted">${review.review}</h6>
			  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`)
		}
		return htmlToElement(`<div class="card">
			<div class="card-body">
			<h5 class="card-title">${review.movie}</h5>
			<h6 class="card-subtitle mb-2 text-muted">${review.review}</h6>
			  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`)
	
	}

}

rhit.FavoritePageController = class {
	constructor() {
		document.querySelector("#menuShowAllMovies").addEventListener("click", (event) => {
			console.log("Show all movies");
			window.location.href = "/mainpage.html";

		});
		document.querySelector("#menuShowMyMovies").addEventListener("click", (event) => {
			console.log("Show my favorites");
			window.location.href = `/favoriteMovie.html?uid=${rhit.fbAuthManager.uid}`;

		});
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});
		document.querySelector("#menuShowMyProfile").addEventListener("click", (event) => {
			window.location.href = `/profile.html?uid=${rhit.fbAuthManager.uid}`
		});
		document.querySelector("#menuShowMyReviews").addEventListener("click", (event) => {
			window.location.href = `/review.html?uid=${rhit.fbAuthManager.uid}`
		});
		rhit.fbMoviesManager.beginListening(this.updateList.bind(this));
	}

	updateList() {
		const newList = htmlToElement('<div id="favListContainer"><div>');
		for (let i = 0; i < rhit.fbMoviesManager.length; i++) {
			const m = rhit.fbMoviesManager.getMovieAtIndex(i);
			console.log(m);
			for (const idd of m.fav) {
				if (rhit.fbAuthManager.uid == idd) {
					const newCard = this._createCard(m);
					newCard.onclick = (event) => {

						window.location.href = `/movie.html?id=${m.id}`;
					};
					newList.appendChild(newCard);
				}
			}


		}
		const oldList = document.querySelector("#favListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}

	_createCard(movie) {
		if (Math.floor(movie.rating) == 1) {
			return htmlToElement(`<div class="card">
			<div class="card-body">
		  <img src="${movie.moviePic} alt="${movie.name}" width="100" height="150">
		  <h5 class="card-title">${movie.name}</h5>
		  <h6 class="card-subtitle mb-2 text-muted">${movie.type}</h6>
		  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`);
		} else if (Math.floor(movie.rating) == 2) {
			return htmlToElement(`<div class="card">
			<div class="card-body">
			<img src="${movie.moviePic} alt="${movie.name}" width="100" height="150">
		  <h5 class="card-title">${movie.name}</h5>
		  <h6 class="card-subtitle mb-2 text-muted">${movie.type}</h6>
			  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`)
		} else if (Math.floor(movie.rating) == 3) {
			return htmlToElement(`<div class="card">
			<div class="card-body">
			<img src="${movie.moviePic} alt="${movie.name}" width="100" height="150">
			<h5 class="card-title">${movie.name}</h5>
			<h6 class="card-subtitle mb-2 text-muted">${movie.type}</h6>
			  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`)
		} else if (Math.floor(movie.rating) == 4) {
			return htmlToElement(`<div class="card">
			<div class="card-body">
			<img src="${movie.moviePic} alt="${movie.name}" width="100" height="150">
		  <h5 class="card-title">${movie.name}</h5>
		  <h6 class="card-subtitle mb-2 text-muted">${movie.type}</h6>
			  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`)
		}
		return htmlToElement(`<div class="card">
			<div class="card-body">
			<img src="${movie.moviePic} alt="${movie.name}" width="100" height="150">
			<h5 class="card-title">${movie.name}</h5>
			<h6 class="card-subtitle mb-2 text-muted">${movie.type}</h6>
			  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`)
	}
}


rhit.FbReviewsManager = class {
	constructor() {
		//this._uid = uid;
		console.log("create review manager");
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_REVIEW);
		console.log(this._ref);
		this._unsubscribe = null;

	}
	add(movie, rating, review) {
		console.log("add review for movie" + `${movie}`);
		console.log("rating is" + `${rating}` + "Review is: " + `${review}`);
		rhit.fbSingleMovieManager.update(rating);
		this._ref.add({
				[rhit.FB_KEY_MOVIE]: movie,
				[rhit.FB_KEY_RATING]: parseInt(rating),
				[rhit.FB_KEY_USERID]: rhit.fbAuthManager.uid,
				[rhit.FB_KEY_FAV]: [],
				[rhit.FB_KEY_REVIEW]: review,
			}).then(function (docRef) {
				console.log("Document written with ID: ", docRef.id);
			})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			});

	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref.limit(50).onSnapshot((querySnapshot) => {
			console.log("review update", querySnapshot.docs);
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}

	stopListening() {
		this._unsubscribe();
	}

	get length() {
		return this._documentSnapshots.length;
	}

	getReviewAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const review = new rhit.Review(
			docSnapshot.get(rhit.FB_KEY_MOVIE),
			docSnapshot.get(rhit.FB_KEY_RATING),
			docSnapshot.get(rhit.FB_KEY_USERID),
			docSnapshot.get(rhit.FB_KEY_REVIEW));

		return review;
	}
}

rhit.Review = class {
	constructor(Movie, Rating, Userid, Review) {
		this.movie = Movie;
		this.rating = Rating;
		this.userid = Userid;
		this.review = Review;
	}
}
rhit.DetailPageController = class {
	constructor() {
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
			console.log("Sign out");

		});
		document.querySelector("#menuShowAllMovies").addEventListener("click", (event) => {
			console.log("Show all movies");
			window.location.href = "/mainpage.html";

		});
		document.querySelector("#menuShowMyMovies").addEventListener("click", (event) => {
			console.log("Show my favorites");
			window.location.href = `/favoriteMovie.html?uid=${rhit.fbAuthManager.uid}`;

		});
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});
		document.querySelector("#menuShowMyProfile").addEventListener("click", (event) => {
			window.location.href = `/profile.html?uid=${rhit.fbAuthManager.uid}`
		});
		document.querySelector("#menuShowMyReviews").addEventListener("click", (event) => {
			window.location.href = `/review.html?uid=${rhit.fbAuthManager.uid}`
		});
		document.querySelector("#submitAddReview").addEventListener("click", (event) => {
			console.log("add review button clicked");
			const review = document.querySelector("#inputReview").value;
			const rating = document.querySelector("#inputRating").value;
			const movie = rhit.fbSingleMovieManager.movieName;
			console.log(rhit.fbReviewsManager);
			console.log(movie);
			console.log(review);
			console.log(rating);
			rhit.fbReviewsManager.add(movie, rating, review);
		});
		document.querySelector("#deleteButton").addEventListener("click", (event) => {

			rhit.fbSingleMovieManager.delete().then(function () {
				console.log("Document successfully deleted!");
				window.location.href = "/mainpage.html"
			}).catch(function (error) {
				console.error("Error removing document: ", error);
			});;

		});

		document.querySelector("#addFav").addEventListener("click", (event) => {
			console.log("add fav button clicked");

			rhit.fbSingleMovieManager.updateFav(rhit.fbAuthManager.uid);
			// console.log(rhit.fbSingleMovieManager.Name);
			rhit.fbUserManager.updateFav(rhit.fbSingleMovieManager.movieName);
		});
		$("#reviewDialog").on('show.bs.modal', (event) => {
			// Pre animation
			document.querySelector("#inputRating").value = rhit.fbSingleMovieManager.rating;
			document.querySelector("#inputReview").value = "";
			//document.querySelector("#inputReview").value = rhit.fbSingleMovieManager.review;
		});
		rhit.fbUserManager.beginListening(this.updateList.bind(this));
		rhit.fbSingleMovieManager.beginListening(this.updateView.bind(this));
		rhit.fbReviewsManager.beginListening(this.updateList.bind(this))
	}
	
	updateList() {
		const newList = htmlToElement('<div id="reviewContainer"><div>');
		for (let i = 0; i < rhit.fbReviewsManager.length; i++) {
			const m = rhit.fbReviewsManager.getReviewAtIndex(i);

			console.log(m.movie);
			console.log(m.rating);
			console.log(m.userid);
			if (m.movie == rhit.fbSingleMovieManager.movieName) {
				const newCard = this._createCard(m);
				newList.appendChild(newCard);
			}
			if (m.userid == rhit.fbAuthManager.uid) {
				console.log("find xxxx");
				// document.getElementById("addReviewButton").disabled = true;
			}

		}
		for (const idd of rhit.fbSingleMovieManager.fav) {
			if (rhit.fbAuthManager.uid == idd) {
				document.getElementById("addFav").disabled = true;
			}
		}
		const oldList = document.querySelector("#reviewContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);

	}

	_createCard(review) {

		if (review.rating == 1) {
			return htmlToElement(`<div class="card">
			<div class="card-body">
			  <h5 class="card-title">${review.movie}</h5>
			  <h6 class="card-subtitle mb-2 text-muted">${review.review}</h6>
			  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`);
		} else if (review.rating == 2) {
			return htmlToElement(`<div class="card">
			<div class="card-body">
			  <h5 class="card-title">${review.movie}</h5>
			  <h6 class="card-subtitle mb-2 text-muted">${review.review}</h6>
			  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`)
		} else if (review.rating == 3) {
			return htmlToElement(`<div class="card">
			<div class="card-body">
			  <h5 class="card-title">${review.movie}</h5>
			  <h6 class="card-subtitle mb-2 text-muted">${review.review}</h6>
			  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`)
		} else if (review.rating == 4) {
			return htmlToElement(`<div class="card">
			<div class="card-body">
			  <h5 class="card-title">${review.movie}</h5>
			  <h6 class="card-subtitle mb-2 text-muted">${review.review}</h6>
			  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`)
		}
		return htmlToElement(`<div class="card">
			<div class="card-body">
			  <h5 class="card-title">${review.movie}</h5>
			  <h6 class="card-subtitle mb-2 text-muted">${review.review}</h6>
			  <p>
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
			<img src="https://s3-us-west-2.amazonaws.com/static-resources.zybooks.com/star.png" alt="star">
		  </p>
			</div>
		  </div>`)
	}

	updateView() {
		console.log(rhit.fbSingleMovieManager);
		document.querySelector("#movieImg").src = rhit.fbSingleMovieManager.moviePic;
		document.querySelector("#movieTitle").innerHTML = rhit.fbSingleMovieManager.movieName;
	}
}

rhit.FbSingleMovieManager = class {
	constructor(movieQuoteId) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIE).doc(movieQuoteId);
	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				console.log("Document data:", doc.data());
				console.log(doc.data().MoviePic);
				this._documentSnapshot = doc;
				changeListener();
			} else {
				console.log("No such document!");
			}
		});


	}
	stopListening() {
		this._unsubscribe();
	}

	update(rating) {
		console.log(this._ref.get().then((doc) => {
			this._ref.update({
					[rhit.FB_KEY_COUNT]: doc.data().count + 1,
					[rhit.FB_KEY_RATING]: (parseInt(doc.data().rating)*doc.data().count + parseInt(rating)) / (doc.data().count + 1),
					[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
				})
				.then(() => {
					console.log("Document updated");
				})
				.catch(function (error) {
					console.error("Error adding document: ", error);
				});
			// const count = doc.data().count;
			// return count;
		}));

	}
	updateFav(id) {
		console.log("start");
		console.log(this._ref.FB_KEY_FAV);

		console.log(this._ref.get().then((doc) => {
			console.log(doc.data().fav);
			for (const uid of doc.data().fav) {
				if (id == uid) {
					console.log(id);
					console.log(uid);
					console.log("you've already added to fav")
					return;
				}

			}
			console.log(doc.data().fav);
			const list = doc.data().fav;
			list.push(id);
			this._ref.update({
					[rhit.FB_KEY_FAV]: list,
				})
				.then(() => {
					console.log("Document updated");
				})
				.catch(function (error) {
					console.error("Error adding document: ", error);
				});
		}));

		console.log("end");
	}
	delete() {
		return this._ref.delete();
	}

	get moviePic() {
		return this._documentSnapshot.get(rhit.FB_KEY_MOVIEPIC);
	}

	get movieName() {
		return this._documentSnapshot.get(rhit.FB_KEY_NAME);
	}

	get author() {
		return this._documentSnapshot.get(rhit.FB_KEY_AUTHOR);
	}

	get fav() {
		return this._documentSnapshot.get(rhit.FB_KEY_FAV);
	}
}

rhit.Movie = class {
	constructor(id, MoviePic, Name, Rating, count, fav, Type) {
		this.id = id;
		this.moviePic = MoviePic;
		this.name = Name;
		this.rating = Rating;
		this.count = count;
		this.fav = fav;
		this.type = Type;
	}
}

rhit.FbMoviesManager = class {
	constructor() {
		// this._uid = uid;
		// console.log("create movie manager");
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIE);
		this._unsubscribe = null;

	}
	search(name) {
		console.log("search movie by name: " + `${name}`);
		const size = this._documentSnapshots.length;
		let arr = [];
		for (var i = 0; i < size; i++) {
			const docSnapshot = this._documentSnapshots[i];
			const str = docSnapshot.get(rhit.FB_KEY_NAME);
			let re = new RegExp('^'+name,"i")
			console.log(re);
			console.log(re.test(str));
			if (re.test(str)) {
				console.log(`${str}` + " Movie Found");
				// return i;
				arr.push(i);
			}
		}
		return arr;
		console.log("no items found");

	}
	add(moviePic, name, type) {
		console.log("add movie" + `${name}`);
		console.log("type is" + `${type}`);
		this._ref.add({
				[rhit.FB_KEY_MOVIEPIC]: moviePic,
				[rhit.FB_KEY_NAME]: name,
				[rhit.FB_KEY_RATING]: 0,
				[rhit.FB_KEY_COUNT]: 0,
				[rhit.FB_KEY_FAV]: [],
				[rhit.FB_KEY_TYPE]: type
			}).then(function (docRef) {
				console.log("Document written with ID: ", docRef.id);
			})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			});

	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref.limit(50).onSnapshot((querySnapshot) => {
			// console.log("Movie update");
			this._documentSnapshots = querySnapshot.docs;
			changeListener();
		});
	}

	stopListening() {
		this._unsubscribe();
	}

	get length() {
		return this._documentSnapshots.length;
	}

	getMovieAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const movie = new rhit.Movie(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_MOVIEPIC),
			docSnapshot.get(rhit.FB_KEY_NAME),
			docSnapshot.get(rhit.FB_KEY_RATING),
			docSnapshot.get(rhit.FB_KEY_COUNT),
			docSnapshot.get(rhit.FB_KEY_FAV),
			docSnapshot.get(rhit.FB_KEY_TYPE));

		return movie;
	}
}
rhit.UserController = class {
	constructor() {

		//rhit.fbUserManager.beginListening();
	}
}
rhit.FriendListConroller = class {
	constructor() {
		document.querySelector("#menuShowAllMovies").addEventListener("click", (event) => {
			console.log("Show all movies");
			window.location.href = "/mainpage.html";

		});
		document.querySelector("#menuShowMyMovies").addEventListener("click", (event) => {
			console.log("Show my favorites");
			window.location.href = `/favoriteMovie.html?uid=${rhit.fbAuthManager.uid}`;

		});
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});
		document.querySelector("#menuShowMyProfile").addEventListener("click", (event) => {
			window.location.href = `/profile.html?uid=${rhit.fbAuthManager.uid}`
		});
		document.querySelector("#menuShowMyReviews").addEventListener("click", (event) => {
			window.location.href = `/review.html?uid=${rhit.fbAuthManager.uid}`
		});
		document.querySelector("#submitUserSearch").addEventListener("click", (event) => {
			const name = document.querySelector("#inputSearchUser").value;
			const i = rhit.fbUserManager.search(name);
			rhit.fbUserManager.beginListening(this.searchUser.bind(this, i));
		});
		console.log("begin");
		console.log(rhit.fbUserManager.length);
		rhit.fbUserManager.beginListening(this.updateList.bind(this));
		console.log("end");
	}
	searchUser(i) {
		const newList = htmlToElement('<div id="friendListContainer"><div>');
		const m = rhit.fbUserManager.getUserAtIndex(i);
		console.log(m.movie);
		console.log(m.type);
		const newCard = this._createCard(m);
		newList.appendChild(newCard);
		const oldList = document.querySelector("#friendListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}
	updateList() {
		console.log(rhit.fbUserManager.length);
		const newList = htmlToElement('<div id="friendListContainer"><div>');
		for (let i = 0; i < rhit.fbUserManager.length; i++) {
			const m = rhit.fbUserManager.getUserAtIndex(i);
			console.log("user");

			console.log(m);
			const newCard = this._createCard(m);
			newCard.onclick = (event) => {

				window.location.href = `/movie.html?id=${m.id}`;
			};
			newList.appendChild(newCard);

		}
		const oldList = document.querySelector("#friendListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}

	_createCard(user) {
		console.log("create card");
		return htmlToElement(`<div class="card">
		<div class="card-body">
		  <h5 class="card-title">${user.id}</h5>
		  <h6 class="card-subtitle mb-2 text-muted">${user.fav}</h6>
		</div>
	  </div>`);
	}
}
rhit.FbUserManager = class {
	constructor() {
		// this._uid = uid;
		// console.log("create user manager");
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_USER);
		console.log(this._ref);
		this._unsubscribe = null;

	}
	search(id) {
		console.log("search user by name: " + `${id}`);
		const size = this._documentSnapshots.length;
		for (var i = 0; i < size; i++) {
			const docSnapshot = this._documentSnapshots[i];
			if (id == docSnapshot.get(rhit.FB_KEY_ID)) {
				console.log(`${id}` + " User Found");
				return i;
			}
		}
		console.log("no user found");

	}
	updateFav(name) {
		const size = rhit.fbUserManager._documentSnapshots.length;
		for (var i = 0; i < size; i++) {
			const docSnapshot = this._documentSnapshots[i];
			if (docSnapshot.get(rhit.FB_KEY_ID) == rhit.fbAuthManager.uid) {
				console.log(docSnapshot.get(rhit.FB_KEY_ID));
				console.log(docSnapshot.get(rhit.FB_KEY_USERFAV));
				for (const mn of docSnapshot.get(rhit.FB_KEY_USERFAV)) {
					if (name == mn) {
						console.log(mn);
						console.log("you've already added to fav")
						return;
					}
				}
				var list = docSnapshot.get(rhit.FB_KEY_USERFAV);
				list.push(name);
				console.log(list);
				console.log(docSnapshot.id);
				rhit.fbUserManager._ref.doc(docSnapshot.id).update({
					[rhit.FB_KEY_USERFAV]: list
				});
			}
		}
		console.log("end");
	}

	beginListening(changeListener) {
		this._unsubscribe = this._ref.limit(50).onSnapshot((querySnapshot) => {
			// console.log("Movie update");
			console.log(this._documentSnapshots.length);
			this._documentSnapshots = querySnapshot.docs;
			this.add(rhit.fbAuthManager.uid, []);
			changeListener();
		});
	}

	stopListening() {
		this._unsubscribe();
	}


	// beginListening() {
	// 	this._unsubscribe = this._ref.limit(50).onSnapshot((querySnapshot) => {
	// 		console.log("User update1");
	// 		this._documentSnapshots = querySnapshot.docs;

	// 		//console.log(this._documentSnapshots.length);
	// 		this.add(rhit.fbAuthManager.uid, []);
	// 	});
	// }

	add(id, favMovie) {
		console.log("add");
		const size = this._documentSnapshots.length;
		console.log(size);

		for (var i = 0; i < size; i++) {
			const docSnapshot = this._documentSnapshots[i];
			console.log(docSnapshot.get(rhit.FB_KEY_ID));
			console.log(id);
			if (docSnapshot.get(rhit.FB_KEY_ID) == id) {
				return;
			}
		}
		this._ref.add({
			[rhit.FB_KEY_ID]: id,
			[rhit.FB_KEY_USERFAV]: favMovie
		})
		//changeListener();
	}



	stopListening() {
		this._unsubscribe();
	}

	get length() {
		return this._documentSnapshots.length;
	}
	getUserAtIndex(index) {
		const docSnapshot = this._documentSnapshots[index];
		const user = new rhit.User(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_ID),
			docSnapshot.get(rhit.FB_KEY_USERFAV),
		);
		return user;
	}
}

rhit.User = class {
	constructor(idd, id, fav) {
		this.idd = idd;
		this.id = id;
		this.fav = fav;
	}
}

rhit.LoginPageController = class {
	constructor() {
		document.querySelector("#rosefireButton").onclick = (event) => {

			rhit.fbAuthManager.signIn();

		}
	}

}

rhit.checkForRedirects = function () {
	if (document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn) {
		// rhit.fbUserManager = new FbUserManager()
		// rhit.fbMoviesManager = new FbMoviesManager();
		rhit.fbUserManager.add(rhit.fbAuthManager.uid, []);
		window.location.href = "/mainpage.html";
	}

	if (!document.querySelector("#loginPage") && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/";
	}

}
rhit.ProfilePageController = class {
	constructor() {
		const urlParams = new URLSearchParams(window.location.search)
		console.log(urlParams.get('uid'));
		document.querySelector("#name").innerHTML = urlParams.get('uid');
		document.querySelector("#userName").innerHTML = urlParams.get('uid') + "@rose-hulman.edu"
		document.querySelector("#menuShowAllMovies").addEventListener("click", (event) => {
			console.log("Show all movies");
			window.location.href = "/mainpage.html";

		});
		document.querySelector("#menuShowMyMovies").addEventListener("click", (event) => {
			console.log("Show my favorites");
			window.location.href = `/favoriteMovie.html?uid=${rhit.fbAuthManager.uid}`;

		});
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		});
		document.querySelector("#menuShowMyProfile").addEventListener("click", (event) => {
			window.location.href = `/profile.html?uid=${rhit.fbAuthManager.uid}`
		});
		document.querySelector("#menuShowMyReviews").addEventListener("click", (event) => {
			window.location.href = `/review.html?uid=${rhit.fbAuthManager.uid}`
		});
		document.querySelector("#viewFriend").addEventListener("click", (event) => {
			window.location.href = `/friendlist.html?uid=${rhit.fbAuthManager.uid}`
		});
	}

}
rhit.initializePage = function () {
	if (document.querySelector("#mainPage")) {
		console.log(rhit.fbAuthManager.uid);
		// console.log("You are on the main page.");
		const urlParams = new URLSearchParams(window.location.search)
		const uid = urlParams.get('uid')
		// console.log(`uid is ${uid}`);
		rhit.fbMoviesManager = new rhit.FbMoviesManager();
		// rhit.fbReviewsManager = new rhit.FbReviewsManager();

		//rhit.fbUserManager.add(rhit.fbAuthManager.uid, []);
		// new rhit.UserController();


		new rhit.MainPageController();
	}

	if (document.querySelector("#loginPage")) {
		console.log("You are on the login page.");
		//rhit.fbUserManager = new rhit.FbUserManager();
		new rhit.LoginPageController();
	}

	if (document.querySelector("#detailPage")) {
		console.log("You are on the detail page.");
		// const mqId = rhit.storage.getMovieQuoteId();
		// console.log(`Detail page for ${mqId}`);

		const queryString = window.location.search;
		console.log(queryString);
		const urlParams = new URLSearchParams(queryString)
		const mqId = urlParams.get('id')
		console.log(mqId);
		if (!mqId) {
			console.log("Error! Missing movie quote id!");
			window.location.href = "/";
		}
		rhit.fbUserManager = new rhit.FbUserManager();
		rhit.fbSingleMovieManager = new rhit.FbSingleMovieManager(mqId);
		rhit.fbReviewsManager = new rhit.FbReviewsManager();
		new rhit.DetailPageController();

	}
	if (document.querySelector("#favPage")) {
		console.log("You are on fav page");
		rhit.fbMoviesManager = new rhit.FbMoviesManager();
		new rhit.FavoritePageController();
	}
	if (document.querySelector("#friendListPage")) {
		console.log("You are on friend List Page");
		rhit.fbUserManager = new rhit.FbUserManager();
		new rhit.FriendListConroller();
	}
	if (document.querySelector("#profilePage")) {
		console.log("You are on profile page");
		new rhit.ProfilePageController();
	}
	if (document.querySelector("#reviewsPage")) {
		console.log("You are on reviews page");
		const urlParams = new URLSearchParams(window.location.search)
		const uid = urlParams.get('uid')
		console.log(`uid is ${uid}`);
		rhit.fbReviewsManager = new rhit.FbReviewsManager();
		new rhit.ReviewsPageController();
	}

}
rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
	}
	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			changeListener();

		});
	}
	signIn() {
		console.log("TODO: Sign in using Rosefire");

		Rosefire.signIn("13a2bd83-37fd-4ce1-872f-556b3c88757d", (err, rfUser) => {
			if (err) {
				console.log("Rosefire error!", err);
				return;
			}
			console.log(Rosefire.rfUser);
			console.log("Rosefire success!", rfUser);

			firebase.auth().signInWithCustomToken(rfUser.token).then((user) => {
					//
					console.log("Sign in successful");
				})
				.catch((error) => {
					// Handle Errors here.
					var errorCode = error.code;
					var errorMessage = error.message;
					if (errorCode === 'auth/invalid-custom-token') {
						alert('The token you provided is not valid.');
					} else {
						console.error(error);
					}
				});
		});

	}
	signOut() {
		firebase.auth().signOut();
	}
	get uid() {
		return this._user.uid;
	}
	get isSignedIn() {
		return !!this._user;
	}
}

rhit.main = function () {
	// console.log("Ready");
	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening(() => {
		// console.log("auth change call fired. TODO: check for redirect and init the page");
		// console.log("isSigedin = ", rhit.fbAuthManager.isSignedIn);
		rhit.fbUserManager = new rhit.FbUserManager();
		rhit.fbUserManager.beginListening(()=> {
			console.log("ready");
		});
		console.log(rhit.fbUserManager._documentSnapshots[0]);
		// console.log(rhit.fbAuthManager.uid);
		// rhit.fbUserManager.beginListening();
		//rhit.fbUserManager.add(rhit.fbAuthManager.uid, []);
		rhit.checkForRedirects();
		rhit.initializePage();


	});

};

rhit.main();