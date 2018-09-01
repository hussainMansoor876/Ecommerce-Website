var cardContainer = document.getElementById('cardContainer1')
var currentUser = localStorage.getItem('currentUser')
var bool = false

function posting() {
    // authCheck();
    allData = []
    firebase.database().ref("post").on("child_added", (data) => {
        obj = data.val()
        obj.key = data.key;
        allData.push(obj)
        // console.log(obj)
        storagePics(obj)
    })
}
var catSearch = document.getElementById('catsearch');
catSearch.addEventListener('change', val => {
    val = val.target.value;
    // cardContainer.style.display = 'none';
    cardContainer.innerHTML = ''
    categorySearch(val)
})

function categorySearch(val) {
    console.log(val)
    firebase.database().ref('categories').child(val).on('child_added', (data) => {
        obj = data.val();
        console.log(obj)
        storagePics(obj)
    })
}

function fullSearch() {
    cardContainer.innerHTML = ''
    var search = document.getElementById('search');
    if (search.value == '') {
        swal("Please Enter any Text");
    } else {
        cardContainer.innerHTML = ''
        search = search.value;
        search1 = search.toLowerCase();
        search2 = search.toUpperCase();
        console.log(search1)
        console.log(search2)
        // console.log(search);
        firebase.database().ref().child('post').on('child_added', (data) => {
            obj = data.val()
            // console.log(obj.name)
            // console.log(obj)
            if (obj.name == search1 || obj.description == search1 || obj.model == search1) {
                storagePics(obj)
                bool = true
            } else if (obj.name == search2 || obj.description == search2 || obj.model == search2) {
                storagePics(obj)
                bool = true
            }
        })
    }
}

function storagePics(data) {
    // console.log(data)
    var storageRef = firebase.storage().ref(`${data.uid}/${data.pic}`)
    storageRef.getDownloadURL()
        .then(function (url) {
            // console.log(url);
            data.url = url
            // console.log(`url ${obj.url}`)
            // console.log()
            // cardContainer.innerHTML += postImages(obj);
            cardContainer.innerHTML += `
                <div class="card">
                    <h1 class="pull-left card1">Name:${data.name.toLowerCase()}</h1>
                    <div class="img">
                        <img src="${data.url}" alt="card">
                    </div>
                    <h2 class="pull-left card1">Description:${data.description}</h2>
                    <h4 class="card1">Price:${data.price}</h4>
                    <h4 class="card1">Ph.no:${data.phoneNumber}</h4>
                    <button class="btn btn-primary pull-right msg-btn" onclick='sendMsg("${data.uid}")'>message</button>
                    <button class="btn btn-primary pull-left" onclick='offline("${data.key}")'>View Offline</button>

                </div>`
        })
}

function sendMsg(data) {
    localStorage.setItem("chatUser", data)
    console.log(data)
    setTimeout(() => {
        window.location = './post/chatapp/chat.html'
    }, 100)
}

// function offline(obj) {
//     console.log(obj)
//     firebase.database().ref().child('offline/' + obj).set(obj)
// }
function logout() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        swal("Sign-out successful")
        window.location = './login.html'
    })
}

function offline(data) {
    // console.log(data)
    // console.log(currentUser)
    firebase.database().ref('post').child(data).once('value', (obj) => {
        var obj = obj.val()
        // console.log(obj)
        firebase.database().ref('offline').child(currentUser + '/' + data + '/').set(obj)
        loadOffline()
    })
}
if (navigator.onLine) {
    console.log('status >>>   You are ONLINE ??')

} else {
    console.log('status >>>   You are OFFLINE ?')
}