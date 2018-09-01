const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotifications = functions.database.ref('/Messages/{pushId}').onCreate(snapshot => {
    
    // Notification details.
    console.log(snapshot.val());
    const text = snapshot.val().msg;
    const Reciever = snapshot.val().RecieverID;
    const payload = {
        notification: {
            title: `Message From ${snapshot.val().Name} !`,
            body: text ? (text.length <= 100 ? text : text.substring(0, 97) + '...') : '',
            icon: `./media.png`,
            click_action: `google.com`,
        }
    };
    console.log("The RecieverID:" + Reciever)
    let tokens = []; // All Device tokens to send a notification to.
    // Get the list of device tokens.
    return admin.database().ref('fcmTokens').orderByValue().equalTo(Reciever).once('value')
    .then(allTokens => {

        if (allTokens.val()) {
            // Listing all tokens.
            tokens = Object.keys(allTokens.val());
            console.log(tokens)
            // localStorage.setItem('msid',tokens)
            // Send notifications to all tokens.
            return admin.messaging().sendToDevice(tokens, payload);
        }
        return { results: [] };

    }).then(response => {
        // For each notification we check if there was an error.
        const tokensToRemove = {};
        response.results.forEach((result, index) => {
            const error = result.error;
            if (error) {
                console.error('Failure sending notification to', tokens[index], error);
                // Cleanup the tokens who are not registered anymore.
                if (error.code === 'messaging/invalid-registration-token' ||
                    error.code === 'messaging/registration-token-not-registered') {
                    tokensToRemove[`/fcmTokens/${tokens[index]}`] = null;
                }
            }
        });
        return admin.database().ref().update(tokensToRemove);
    }).then(() => {
        console.log('Notifications have been sent and tokens cleaned up.');
        return null;
    });
}   );

