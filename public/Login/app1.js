// var user = firebase.auth().currentUser;
// if (user) {
//     // User is signed in.
//     console.log("Hello");
// } else {
//     // No user is signed in.
//     console.log("Bye")
// }
var messaging = firebase.messaging();
console.log(messaging)
var userUid = localStorage.getItem('currentUser')
var userName = localStorage.getItem('userName')
// var user = firebase.auth().currentUser;
// console.log(user)

function post() {
    var name = document.getElementById('name');
    var category = document.getElementById('category');
    var description = document.getElementById('description');
    var pic = document.getElementById('pic');
    var price = document.getElementById('price');
    var model = document.getElementById('model');
    var year = document.getElementById('year');
    var phone = document.getElementById('phone');
    // console.log(userUid)
    if (name.value == "") {
        swal("Please fill the Name")
    } else if (category.value == "") {
        swal("Please select any category");
    } else if (description.value == "") {
        swal("Please fill the description");
        description.focus();
    } else if (pic.value == '') {
        swal("Please upload any picture");
    } else if (price.value == "") {
        swal("Please Enter the price");
    } else if (model.value == "") {
        swal("Please Enter the Model");
    } else if (year.value == "") {
        swal("Please Enter the Year");
    } else if (phone.value == "") {
        swal("Please Enter the Phone Number");
    } else {
        pic = pic.files[0]
        var storageRef = firebase.storage().ref(`${userUid}/${pic.name}`)
        storageRef.put(pic)
            .then(() => {
                var postObj = {
                    name: name.value.toLocaleUpperCase(),
                    category: category.value,
                    description: description.value,
                    pic: pic.name,
                    model: model.value,
                    year: year.value,
                    price: `Rs ${price.value}`,
                    phoneNumber: phone.value,
                    uid: userUid,
                }
                firebase.database().ref().child('post').push(postObj)
                    .then(() => {
                        firebase.database().ref().child('categories/' + postObj.category).push(postObj)
                    })
                    .then(() => {
                        window.location = 'user.html'
                    })
            })
    }
}
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        // console.log(user);
        localStorage.setItem('currentUser', user.uid)
        localStorage.setItem('userName', user.name)
    } else {
        // No user is signed in.
        console.log("Bye");
    }
})

function submit() {
    var fname = document.getElementById('fname');
    var lname = document.getElementById('lname');
    var number = document.getElementById('number');
    var email = document.getElementById('email');
    var password = document.getElementById('password');
    var repassword = document.getElementById('repassword');
    var fullName = fname.value + " " + lname.value;
    if (fname.value == "") {
        alert("Please fill this field");
        fname.focus();
    } else if (lname.value == "") {
        alert("Please fill this field");
        lname.focus();
    } else if (email.value == "") {
        alert("Please fill this field");
        email.focus();
    } else if (number.value == "") {
        alert("Please fill this field");
        number.focus();
    } else if (password.value == "") {
        alert("Please fill this field");
        password.focus();
    } else if (repassword.value == "") {
        alert("Please fill this field");
        repassword.focus();
    } else if (password.value !== repassword.value) {
        password.value = '';
        repassword.value = '';
        alert("Please enter correct Password")
        password.focus();
        return false;
    } else {
        firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
            .then(function (result) {
                var obj = {
                    name: fullName,
                    email: email.value,
                    uid: result.user.uid,
                    emailVerified: result.user.emailVerified,
                    password: password.value
                };
                // console.log(result)
                // console.log(obj)
                firebase.database().ref("User").child(obj.uid).set(obj)
                    .then(() => {
                        // console.log(result)
                        swal("Sign Up Successfully")
                        window.location = 'login.html'
                    })
            })
            .catch(function (error) {
                swal(error.message);
            })
    }

}

function login() {
    var email = document.getElementById("email");
    var password = document.getElementById("password");
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
        .then(function (result) {
            // console.log(result);
            window.location = '../index1.html';
        })
        .catch(function (error) {
            // Handle Errors here.
            // var errorCode = error.code;
            // var errorMessage = error.message;
            // ...
            email.value = "";
            password.value = "";
            // console.log(error);
            swal(error.message);
        });
}

imagesArray = []
for (var i = 0; i <= 11; i++) {
    imagesArray[i] = `../hd/${i}.jpg`
}
// console.log(imagesArray)

var cardContainer = document.getElementById('cardContainer1')
cardContainer.innerHTML = imagesArray.map(createCards).join('\t')

function createCards(image) {
    return `
        <div class="card">
            <div class="img">
                <img src="${image}" alt="card">
            </div>
        </div>`
}

function logout() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        swal("Sign-out successful")
        window.location = 'login.html'
    }).catch(function (error) {
        // An error happened.
    });
}