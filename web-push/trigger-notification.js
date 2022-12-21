const webpush = require("web-push");

function triggerNotification(subscription, id, data) {
//   console.log("----------- data", subscription, id);
  if (subscription) {
    return webpush
      .sendNotification(subscription, JSON.stringify(data))
      .catch((err) => {
        if (err.statusCode === 410 || err.statusCode === 404) {     
          console.error(
            "Error sending notification, reason: ",
            err.statusCode,
            err
          );
        } else {
        //   console.log(subscription);
          console.error("Error sending notification, reason: ", err);
        }
      });
  }
}

module.exports = { triggerNotification };
