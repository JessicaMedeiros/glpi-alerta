const MySQLEvents = require("@rodrigogs/mysql-events");
const mysqlConnection = require("../config/dbconnections/mysql-connection");
const webPushGLPI = require("../web-push/glpi/web-push.glpi");

async function startAndConnect() {
  const instance = new MySQLEvents(mysqlConnection, {
    startAtEnd: true, // to record only the new binary logs, if set to false or you didn'y provide it all the events will be console.logged after you start the app
  });

  await instance.start();

  instance.addTrigger({
    name: "monitoring all statments",
    expression: "glpi.glpi_tickets", // listen to TEST database !!!
    statement: MySQLEvents.STATEMENTS.ALL, // you can choose only insert for example MySQLEvents.STATEMENTS.INSERT, but here we are choosing everything
    onEvent: (e) => {
      console.log(e);
      var [{ after }] = e.affectedRows;
      console.log(after.name, after.content);
      webPushGLPI.webPushGLPI(after);

    },
  });

  instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
}

module.exports = { startAndConnect };
