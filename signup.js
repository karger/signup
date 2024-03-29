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
}

trackEvents = function(eventStore,uid) {
	 uid = uid.valueOf();
	 eventStore = eventStore.valueOf();
	 if (uid==="" || !eventStore) { //not fully initialized
		  return;
	 }
	 firebaseReady.then((fb) => {
		  let outputNode=Mavo.all.listEvents.root.children.events;
		  let path = eventStore.split('/');
		  let query = fb.firestore();
		  while (path.length > 1) {
				query=query.collection(path.shift()).doc(path.shift());
		  }
		  query = query.collection(path.shift());
		  if (uid) {
				query = query.where('ownerId','==',uid);
		  }
		  trackEvents.cancel?.(); //cancel old snapshot listener on change
		  trackEvents.cancel = query.onSnapshot((results) => {
				myEvents = [];
				results.forEach((doc)=> {
					 myEvents.push({eventId: doc.id, ...doc.data()});
				});
				myEvents.sort((a,b) => {
					 return Date.parse(b.time) - Date.parse(a.time); 
				});
				outputNode.render(myEvents);
		  });
	 });
}

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
