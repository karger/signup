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
    fb.auth().onAuthStateChanged(()=>{
	let u = firebase.auth().currentUser; 
	Mavo.Node.get(document.getElementById("uid")).render(u.uid);
	Mavo.Node.get(document.getElementById("name")).render(u.displayName);
    }
    );
});
