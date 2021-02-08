var rhit = rhit || {};

rhit.FB_COLLECTION_MOVIE = "Movies";
rhit.FB_COLLECTION_REVIEW = "Reviews";
rhit.FB_COLLECTION_USER = "Users";
rhit.FB_KEY_MOVIEPIC = "MoviePic";
rhit.FB_KEY_NAME = "Name";
rhit.FB_KEY_RATING = "rating";
rhit.FB_KEY_TYPE = "type";
rhit.fbMoviesManager = null;
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
			window.location.href="/mainpage.html";

		});
		document.querySelector("#menuShowMyMovies").addEventListener("click", (event) => {
			console.log("Show my favorites");
			window.location.href=`/mainpage.html?uid=${rhit.fbAuthManager.uid}`;

		});
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
		  });
		document.querySelector("#menuShowMyProfile").addEventListener("click", (event)=>{
			window.location.href=`/profile.html?uid=${rhit.fbAuthManager.uid}`
		});
		document.querySelector("#submitAddMovie").addEventListener("click", (event) => {
			const moviePic = document.querySelector("#inputMoviePic").value;
			const name = document.querySelector("#inputMovie").value;
			const type = document.querySelector("#inputType").value;
			rhit.fbMoviesManager.add(moviePic, name, type);
			// $('#addQuoteDialog').modal('hide')
			
		});
		$("#addMovieDialog").on('show.bs.modal', (event) => {
			// Pre animation
			document.querySelector("#inputMoviePic").value = "";
			document.querySelector("#inputMovie").value = "";
			document.querySelector('#inputType').value = "";
		});
		$("#addMovieDialog").on('shown.bs.modal', (event) => {
			document.querySelector("#inputMoviePic").focus();
		});
		
		  
		document.querySelector("#submitSearch").addEventListener("click", (event)=>{
			const name = document.querySelector("#inputSearchMovie").value;
			const i = rhit.fbMoviesManager.search(name);
			rhit.fbMoviesManager.beginListening(this.searchMovie.bind(this,i));
		});
		rhit.fbMoviesManager.beginListening(this.updateList.bind(this));
	}
	searchMovie(i) {
		const newList = htmlToElement('<div id="movieListContainer"><div>');
		const m = rhit.fbMoviesManager.getMovieAtIndex(i);
		console.log(m.movie);
			console.log(m.type);
			const newCard = this._createCard(m);
			newCard.onclick = (event) => {
				// console.log(`You clicked on ${mq.id}`);
				// rhit.storage.setMovieQuoteId(mq.id);
				window.location.href = `/movie.html?id=${m.id}`;
			};
			newList.appendChild(newCard);
			const oldList = document.querySelector("#movieListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		oldList.parentElement.appendChild(newList);
	}
	updateList() {
		const newList = htmlToElement('<div id="movieListContainer"><div>');
		for (let i = 0; i < rhit.fbMoviesManager.length; i++) {
			const m = rhit.fbMoviesManager.getMovieAtIndex(i);
			console.log(m.movie);
			console.log(m.type);
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
		return htmlToElement(`<div class="card">
		<div class="card-body">
		  <img src="${movie.moviePic} alt="${movie.name}" width="100" height="150">
		  <h5 class="card-title">${movie.name}</h5>
		  <h6 class="card-subtitle mb-2 text-muted">${movie.type}</h6>
		  <h6 class="card-subtitle mb-2 text-muted">${movie.rating}</h6>
		</div>
	  </div>`);
	}

	
}



rhit.DetailPageController = class {
	constructor() {
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
			console.log("Sign out");

		});
		// document.querySelector("#submitEditQuote").addEventListener("click", (event) => {
		// 	const quote = document.querySelector("#inputQuote").value;
		// 	const movie = document.querySelector("#inputMovie").value;
		// 	rhit.fbSingleQuotesManager.update(quote, movie);
		// 	// $('#addQuoteDialog').modal('hide')

		// });
		// $("#editQuoteDialog").on('show.bs.modal', (event) => {
		// 	// Pre animation
		// 	document.querySelector("#inputQuote").value = rhit.fbSingleQuotesManager.quote;
		// 	document.querySelector("#inputMovie").value = rhit.fbSingleQuotesManager.movie;
		// });
		// $("#editQuoteDialog").on('shown.bs.modal', (event) => {
		// 	document.querySelector("#inputQuote").focus();
		// });

		// document.querySelector("#submitDeleteQuote").addEventListener("click", (event) => {

		// 	rhit.fbSingleQuotesManager.delete().then(function () {
		// 		console.log("Document successfully deleted!");
		// 		window.location.href = "/list.html"
		// 	}).catch(function (error) {
		// 		console.error("Error removing document: ", error);
		// 	});;

		// });

		rhit.fbSingleMovieManager.beginListening(this.updateView.bind(this));
	}


	updateView() {
		console.log(rhit.fbSingleMovieManager);
		document.querySelector("#movieImg").src = rhit.fbSingleMovieManager.moviePic;
		document.querySelector("#movieTitle").innerHTML = rhit.fbSingleMovieManager.movieName;
		// if(rhit.fbSingleQuotesManager.author == rhit.fbAuthManager.uid){
		// 	document.querySelector("#menuEdit").style.display = "flex";
		// 	document.querySelector("#menuDelete").style.display = "flex";
		// }
	}
}

rhit.FbSingleMovieManager = class {
	constructor(movieQuoteId) {
		this._documentSnapshot = {};
		this._unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIE).doc(movieQuoteId);
		//   console.log(`listening to ${this._ref.path}`);
	}
	beginListening(changeListener) {
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				console.log("Document data:", doc.data());
				console.log(doc.data().MoviePic);
				this._documentSnapshot = doc;
				changeListener();
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
				// window.location.href='/';
			}
		});


	}
	stopListening() {
		this._unsubscribe();
	}

	update(quote, movie) {
		this._ref.update({
				[rhit.FB_KEY_QUOTE]: quote,
				[rhit.FB_KEY_MOVIE]: movie,
				[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			})
			.then(() => {
				console.log("Document updated");
			})
			.catch(function (error) {
				console.error("Error adding document: ", error);
			});
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
}

rhit.Movie = class {
	constructor(id, MoviePic, Name, Rating, Type){
		this.id = id;
		this.moviePic = MoviePic;
		this.name = Name;
		this.rating = Rating;
		this.type = Type;
	}
}
rhit.FbMoviesManager = class {
	constructor(){
		// this._uid = uid;
		console.log("create movie manager");
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIE);
		this._unsubscribe = null;

	}
	search(name){
		console.log("search movie by name: "+`${name}`);
		const size = this._documentSnapshots.length;
		for (var i= 0; i<size; i++){
			const docSnapshot = this._documentSnapshots[i];
			if (name == docSnapshot.get(rhit.FB_KEY_NAME)){
				console.log(`${name}` + " Movie Found");
				return i;
				
			}
		}
		console.log("no items found");
	
	}
	add(moviePic, name, type){
		console.log("add movie"+`${name}`);
		console.log("type is"+`${type}`);
		this._ref.add({
			[rhit.FB_KEY_MOVIEPIC]: moviePic,
			[rhit.FB_KEY_NAME]: name,
			[rhit.FB_KEY_RATING]: 0,
			[rhit.FB_KEY_TYPE]: type
		}).then(function (docRef) {
			console.log("Document written with ID: ", docRef.id);
		})
		.catch(function (error) {
			console.error("Error adding document: ", error);
		});
		
	}

	beginListening(changeListener){
		this._unsubscribe = this._ref.limit(50).onSnapshot((querySnapshot)=>{
				console.log("Movie update");
				this._documentSnapshots = querySnapshot.docs;
				changeListener();
		});
	}

	stopListening(){
		this._unsubscribe();
	}

	get length() {
		return this._documentSnapshots.length;
	}

	getMovieAtIndex(index){
		const docSnapshot = this._documentSnapshots[index];
		const movie = new rhit.Movie(
			docSnapshot.id,
			docSnapshot.get(rhit.FB_KEY_MOVIEPIC),
			docSnapshot.get(rhit.FB_KEY_NAME),
			docSnapshot.get(rhit.FB_KEY_RATING),
			docSnapshot.get(rhit.FB_KEY_TYPE));

		return movie;
	}
}


rhit.LoginPageController = class {
	constructor() {
		document.querySelector("#rosefireButton").onclick = (event) => {
			rhit.fbAuthManager.signIn();
		}
	}

}

rhit.checkForRedirects = function(){
	if(document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn){
		window.location.href = "/mainpage.html";
	}

	if(!document.querySelector("#loginPage") && !rhit.fbAuthManager.isSignedIn){
		window.location.href = "/";
	}

}
rhit.ProfilePageController = class{
	constructor(){
		const urlParams = new URLSearchParams(window.location.search)
		console.log(urlParams.get('uid'));
		document.querySelector("#name").innerHTML = urlParams.get('uid');
		document.querySelector("#userName").innerHTML = urlParams.get('uid')+"@rose-hulman.edu"
	}
}
rhit.initializePage = function(){
	if (document.querySelector("#mainPage")) {
		console.log("You are on the main page.");
		const urlParams = new URLSearchParams(window.location.search)
		const uid = urlParams.get('uid')
		console.log(`uid is ${uid}`);
		rhit.fbMoviesManager = new rhit.FbMoviesManager(uid);
		new rhit.MainPageController();
	}

	if (document.querySelector("#loginPage")) {
		console.log("You are on the login page.");
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
		rhit.fbSingleMovieManager = new rhit.FbSingleMovieManager(mqId);
		new rhit.DetailPageController();

	}

	if(document.querySelector("#profilePage")){
		console.log("You are on profile page");
		new rhit.ProfilePageController();
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

			firebase.auth().signInWithCustomToken(rfUser.token).then((user)=>{
				console.log("Sign in successful");
			}
			)
			.catch((error) =>{
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
	console.log("Ready");
	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening(() => {
		console.log("auth change call fired. TODO: check for redirect and init the page");
		console.log("isSigedin = ", rhit.fbAuthManager.isSignedIn);
		rhit.checkForRedirects();
		rhit.initializePage();
	});
	

};

rhit.main();

