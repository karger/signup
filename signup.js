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
