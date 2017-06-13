import express from 'express';
import db from 'sqlite';
import bodyParser from 'body-parser';
import Promise from 'bluebird';
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE'); //Add more requests as used
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
  next();
});

app.get('/all', async (req, res) => {
  let books = await db.all('SELECT * FROM books ORDER BY authors, title');
  res.send(books);
});

app.get('/all/short', async (req, res) =>{
  let items = await db.all('SELECT rowid, title, authors FROM books ORDER BY authors, title');
  res.send(items);
});

app.post('/item', async (req, res) => {
  try{
    db.run('INSERT INTO books VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
           req.body.title,
           req.body.authors,
           req.body.isbn,
           req.body.edition,
           req.body.printing,
           req.body.yr_print,
           req.body.date_purch,
           req.body.condition,
           req.body.cover,
           req.body.loc_purch,
           req.body.amt_paid,
           req.body.sell_price,
           req.body.site
          );
    res.sendStatus(201);
  }catch(err){
    console.error(err);
    res.sendStatus(500);
  }
});

app.delete('/item/:itemNumber', async (req, res) => {
  try{
    db.run('DELETE FROM books WHERE rowid = ?', req.params.itemNumber);
    res.sendStatus(200);
  }catch(err){
    console.err(err);
    res.sendStatus(500);
  }
});

process.on('exit', () => {
  db.close();
  console.log('closed db');
});

Promise.resolve().then(() => db.open('../Inventory', {Promise}))
                 .catch(err => console.error(err.stack))
                 .finally(() => app.listen(8000, function(){console.log("Running...")}));
