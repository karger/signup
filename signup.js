let firebaseReady = new Promise((resolve,reject) => {
	 (function loop () {
		  if ((typeof(firebase) != "undefined") &&
				(firebase?.apps?.length > 0)) {
				resolve(firebase);
		  } else {
				setTimeout(loop, 100)
		  }
	 })();
});

Promise.all([Mavo.inited,firebaseReady]).then(([m,fb])=> {
	 Mavo.all.util.dataLoaded.then(() => {
		  document.body.classList.remove("before-mavo");
		  fb.auth().onAuthStateChanged((auth)=>{
				Mavo.Node.get(document.getElementById("uid")).render(auth?.uid);
				Mavo.Node.get(document.getElementById("name")).render(auth?.displayName);});
	 });
});

setEdit = function(on) {
	 document.querySelector('[mv-app=event]')
	 ?.setAttribute("mv-mode", on?.valueOf() ? "edit" : "read");
	 return on;
}

absoluteURL = function(u) {
	 return new URL(u.valueOf(),document.location).toString();
};

(async function () {
    await Mavo.ready;
    
    Mavo.DOMExpression.special.event("$user", {
				type: "mv-login mv-logout",
				update: (evt) => {
				    return (evt.type=="mv-login") ? evt.backend.user : null;
				}
    });
})();

fbDelete = function(path) {
	 path = path.valueOf();
	 if (!path)
		  return;
	 path=path.split('/');
	 if (path.length % 2) {
		  console.log("error: odd-length path (specifying a collection) passed to delete was ignored.");
    }
    firebaseReady.then((fb) => {
        fb = fb.firestore();
        while (path.length >=2) {
            fb = fb.collection(path.shift()).doc(path.shift());
        }
        fb.delete();
    });
}

