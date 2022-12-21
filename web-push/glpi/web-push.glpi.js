const webpush = require("web-push");
const config = require("../../config/web-push/web-push.config");
const dbPostgres = require("../../config/dbconnections/postgres-connection");
const triggerNotification = require("../trigger-notification");

async function webPushGLPI(data) {
  console.log("confinf", config.PUBLIC_KEY, config.PRIVATE_KEY);
try {
    webpush.setVapidDetails(
        "mailto:jet@gmail.com",
        config.PUBLIC_KEY,
        config.PRIVATE_KEY
      );
    
} catch (error) {
    console.log('err', error)
}
 
  console.log('webbbbbbbbbbbbb', webpush)
  dbPostgres
    .query("SELECT subscription, _id FROM push_subscriptions") //will search for all subscription stored in the database
    .then((sub) => {
      var { rows } = sub;

      let promiseChain = Promise.resolve();

      let iterable = [];

      const payload = {
        notification: {
          title: data.name,
          badge: "images/badge.png",
          body: data.content,
          icon: "images/icon.png",
          vibrate: [100, 50, 100], //will cause the device to vibrate for 100 ms, be still for 50 ms, and then vibrate for 100 ms
          requireInteraction: true,
          data: { dateOfArrival: Date.now() },
        },
      };

      for (let i = 0; i < sub.rowCount; i++) {
        const subscription = rows[i].subscription;

        promiseChain = promiseChain.then(() => {
          return triggerNotification.triggerNotification(subscription, rows[i]._id, payload);
        });

        iterable.push(promiseChain);
      }

      Promise.all(iterable)
        .then(() =>
          console.log("Notification sent successfully to all subscribers.")
        )
        .catch(function (err) {
          console.log("err", err);
        });
    });
}

module.exports = { webPushGLPI };
