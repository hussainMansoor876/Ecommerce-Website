var chatUser = localStorage.getItem('chatUser')
var currentUser = localStorage.getItem('currentUser')
var currentName, chatName;
let usersArray = []
firebase.database().ref('User').once('value', (users) => {
    let usersList = users.val()
    for (var key in usersList) {
        usersList[key].uid = key
        usersArray.push(usersList[key])
    }
    usersArray.map((v, i) => {
        if (currentUser === v.uid) {
            currentName = v.name;
            // console.log(currentName)
        }
        else if(chatUser === v.uid){
            chatName = v.name
            // console.log(chatName)
        }
    })
})
function chatApp() {
    console.log('Hello')
    console.log(currentUser)
    console.log(chatUser)
    
    firebase.database().ref().child("chatApp/" + currentUser + "/" + chatUser + "/").on('child_added', (data) => {
        var data = data.val()
        if (data.currentUser) {
            containerId.innerHTML += `<div class="container pull-right" style="width:60%; color:black; height:auto">
            <p>${data.currentUser}</p>
            <span class="time-right">11:00</span>
        </div>`
        } else if (data.chatUser) {
            containerId.innerHTML += `<div class="container darker pull-left" style="width:60%; color:black; height:auto">
            <p>${data.chatUser}</p>
            <span class="time-right">11:00</span>
        </div>`
        }
    })
    
}

function SendChat() {
    var chat = document.getElementById('usermsg').value;
    //Push Notification//
    var msgObj = {
        Name: currentName,
        RecieverID: chatUser,//Here we are giving reciever id so that we can send notifcations to all the tokens registered with this user's id
        SenderID: currentUser,
        msg: chat
    }
    firebase.database().ref('Messages').push(msgObj)
    console.log(chat)
    console.log(currentUser)
    var obj = {
        currentUser: chat
    }
    firebase.database().ref().child("chatApp/" + currentUser + "/" + chatUser + "/").push(obj)
    var obj = {
        chatUser: chat
    }
    firebase.database().ref().child("chatApp/" + chatUser + "/" + currentUser + "/").push(obj)
    document.getElementById('usermsg').value = ''
}
function logout1() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
        swal("Sign-out successful")
        window.location = '../../login.html'
    }).catch(function (error) {
        // An error happened.
    });
}