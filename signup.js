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
	fb.auth().onAuthStateChanged((auth)=>{
	    Mavo.Node.get(document.getElementById("uid")).render(auth?.uid);
	    Mavo.Node.get(document.getElementById("name")).render(auth?.displayName);});
    });
});

reTitle=function(title) {
    document.title = title.valueOf() ? title : "Event Signup";
    return title;
}

trackMyEvents = function(eventStore,uid) {
    uid = uid.valueOf();
    eventStore = eventStore.valueOf();
    if (!uid || !eventStore) {
	return;
    }
    firebaseReady.then((fb) => {
	let outputNode=Mavo.all.listEvents.root.children.events;
	let path = eventStore.split('/');
	let query = fb.firestore();
	while (path.length > 1) {
	    query=query.collection(path.shift()).doc(path.shift());
	}
	query = query.collection(path.shift()).where('ownerId','==',uid);
	query.onSnapshot((results) => {
	    myEvents = [];
	    results.forEach((doc)=> {
		let {eventName, eventTime} = doc.data();
		let eventId = doc.id;
		myEvents.push({eventId: eventId, eventName: eventName,
			       eventTime: eventTime});
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
    if (path.length %2) {
	console.log("error: odd-length path (specifying a collection) passed to delete was ignored.");
    }
    firebaseReady.then((fb) => {
	fb = fb.firestore();
	while (path.length > 1) {
	    fb = fb.collection(path.shift()).doc(path.shift());
	}
	fb.delete();
    });
}
