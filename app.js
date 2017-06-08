import express from 'express'
import db from 'sqlite'
import bodyParser from 'body-parser'
import Promise from 'bluebird'
const app = express();

app.use(bodyParser.json());

let allBooks = async () => {
  let books = await db.all('SELECT *, rowid FROM books ORDER BY authors, title');
  return books;
}

app.get('/all', async (req, res) => {
  let books = await allBooks();
  res.send(books);
});

app.post('/all', async (req, res) => {
  try{
    let title = req.body.title;
    let authors = req.body.authors;
    let isbn = req.body.isbn;
    let edition = req.body.edition;
    let printing = req.body.printing;
    let yr_print = req.body.yr_print;
    let date_purch = req.body.date_purch;
    let condition = req.body.condition;
    let cover = req.body.cover;
    let loc_purch = req.body.loc_purch;
    let amt_paid = req.body.amt_paid;
    let sell_price = req.body.sell_price;
    let site = req.body.site;
    db.run('INSERT INTO books VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', title, authors, isbn, edition, printing, yr_print, date_purch, condition, cover, loc_purch, amt_paid, sell_price, site);
    res.send();
  }catch(err){
    console.error(err);
  }
});

app.delete('/all', async (req, res) => {
  db.run('DELETE FROM books WHERE rowid = ?', req.body.id);
  res.send();
});

process.on('exit', () => {
  db.close();
  console.log('closed db');
});

Promise.resolve().then(() => db.open('../Inventory', {Promise}))
                 .catch(err => console.error(err.stack))
                 .finally(() => app.listen(5000, function(){console.log("Running...")}));
