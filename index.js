const mysql = require('mysql');
const MySQLEvents = require('@rodrigogs/mysql-events');

const program = async () => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });

  const instance = new MySQLEvents(connection, {
    startAtEnd: true // to record only the new binary logs, if set to false or you didn'y provide it all the events will be console.logged after you start the app
  });

  await instance.start();

  instance.addTrigger({
    name: 'monitoring all statments',
    expression: 'glpi.*', // listen to TEST database !!!
    statement: MySQLEvents.STATEMENTS.ALL, // you can choose only insert for example MySQLEvents.STATEMENTS.INSERT, but here we are choosing everything
    onEvent: e => {
      console.log(e);
    }
  });

  instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
};

program()
  .then()
  .catch(console.error);