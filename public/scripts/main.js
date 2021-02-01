var rhit = rhit || {};

rhit.FB_COLLECTION_MOVIE = "Movies";
rhit.FB_COLLECTION_REVIEW = "Reviews";
rhit.FB_COLLECTION_USER = "Users";
rhit.FB_KEY_MOVIEPIC = "MoviePic";
rhit.FB_KEY_NAME = "Name";
rhit.FB_KEY_RATING = "rating";
rhit.FB_KEY_TYPE = "type";
rhit.fbMoviesManager = null;
rhit.fbSingleQuotesManager = null;
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
		document.querySelector("#submitAddQuote").addEventListener("click", (event) => {
			const moviePic = document.querySelector("#inputMoviePic").value;
			const name = document.querySelector("#inputMovie").value;
			const type = document.querySelector("#inputType").value;
			rhit.fbMoviesManager.add(moviePic, name, type);
			// $('#addQuoteDialog').modal('hide')
			
		});
		$("#addQuoteDialog").on('show.bs.modal', (event) => {
			// Pre animation
			document.querySelector("#inputMoviePic").value = "";
			document.querySelector("#inputMovie").value = "";
			document.querySelector('#inputType').value = "";
		});
		$("#addQuoteDialog").on('shown.bs.modal', (event) => {
			document.querySelector("#inputMoviePic").focus();
		});
		document.querySelector("#menuSignOut").addEventListener("click", (event) => {
			rhit.fbAuthManager.signOut();
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
				window.location.href = `/mainpage.html?id=${m.id}`;
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
				window.location.href = `/mainpage.html?id=${m.id}`;
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

