const WebSocket = require('ws');
const express = require("express");
const app = express();
const http = require("http");
app.use(express.json());
// Multer is a module to read and handle FormData objects, on the server side
const multer = require('multer');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public")); 

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

const server = http.createServer(app);

const wss = new WebSocket.Server({server});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // console.log(message)
    //ws.send("server echo:" + message);
    broadcast(message)
  })
  ws.send('connected!')
})

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}


function saveRestaurants(response) {
  let rownumid = "";
  let image_url = "";
  let price = "";
  let rating = "";
  let review_count = "";
  let address = "";
  let vote= 0;
  
 
//   let  restaurantList = JSON.parse(response.jsonBody);
   response.forEach(function(item) {
  //  var result = row.businesses;
     const prettyJson = JSON.stringify(item, null, 4);
     console.log(prettyJson);
   //  console.log(r);
//  let cmd = " SELECT * FROM restaurantsTable WHERE queryStringId=?";
  
   rownumid = randomString();
   image_url = item.image_url;
   price = item.price;
   rating = item.rating;
   review_count = item.review_count;
   address = item.location.display_address;
   name = item.name;
   vote= 0;
   });
  
  
  console.log(rownumid );
  console.log(image_url);
  console.log(price);
  console.log)ra rating = item.rating;
   review_count = item.review_count;
   address = item.location.display_address;
   name = item.name;
   vote= 0;
   });
  
  let cmd = "INSERT INTO restaurantsTable ( queryStringId,name,image_url,price,rating, review_count, address, vote) VALUES (?,?,?,?,?,?,?,?) ";
  restaurantDB.run(cmd,rownumid,name, image_url, price, rating, review_count, address, vote, function(err) {
  if (err) {
             console.log("DB insert error",err.message);
  } else {
                  //    send back query string to browser for display.html
             console.log(rownumid);
            // response.send(rownumid);
          }
   });

}
//start our server
server.listen(process.env.PORT, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});


const yelp = require('yelp-fusion');

const apiKey = process.env.YELP_API_KEY;
const client = yelp.client(apiKey);


const sql = require("sqlite3").verbose();
app.post('/getRestaurant', function(req, res){
 

  var location = req.body.param1;
  var keywords = req.body.param2;
  console.log(location);
  console.log(keywords);
  const searchRequest = {
  //term:'Black bear diner',
  term: keywords,
 // categories:'food',
  location: location
  //location: 'Davis,ca'
};


client.search(searchRequest).then(response => {
  
  response.jsonBody.businesses.forEach(function(row) {
  //  var result = row.businesses;
     const prettyJson = JSON.stringify(row, null, 4);
     console.log(prettyJson);
});
/*  const firstResult = response.jsonBody.businesses[0];
  const prettyJson = JSON.stringify(firstResult, null, 4);
  console.log(prettyJson);
  
   const secondResult = response.jsonBody.businesses[1];
  const prettyJson2= JSON.stringify(secondResult, null, 4);
  console.log(prettyJson2);
  */
//  const firstResult = response.jsonBody.businesses[0];
  
  saveRestaurants(response.jsonBody.businesses);
  res.json(response.jsonBody.businesses);
}).catch(e => {
  console.log(e);
});
});


app.post('/autoComplete', function(req, res, next){
   
    let keyword = req.body.keyword;
    console.log(keyword);
    client.autocomplete({
      text: keyword
    }).then(response => {
      console.log(response.jsonBody.terms[0].text);
  //      console.log(response.jsonBody.terms[1].text);//TODO: check length first
       res.send(response.jsonBody.terms);
    }).catch(e => {
      console.log(e);
    });

});


 app.get('/reviews', function(request, response, next){

console.log("this is review");
client.reviews('black-bear-diner-davis').then(response => {
  console.log(response.jsonBody.reviews[0].text);
   console.log(response.jsonBody.reviews[1].text);

}).catch(e => {
  console.log(e);
});

});

 app.get('/businessdetails', function(request, response, next){

console.log("this is busness detail");
client.business('black-bear-diner-davis').then(response => {
  console.log(response.jsonBody.name);
  console.log(response.jsonBody.price);
  console.log(response.jsonBody.rating);
  console.log(response.jsonBody.review_count);
  console.log(response.jsonBody.image_url);
  console.log(response.jsonBody.url);
 
   response.jsonBody.businesses.forEach(function(row) {
  //  var result = row.businesses;
     const prettyJson = JSON.stringify(row, null, 4);
     console.log(prettyJson);
});
  
}).catch(e => {
  console.log(e);
});

});



const restaurantDB = new sql.Database("restaurants.db");


app.get("/retrieveRestaurants", function(request, response, next){
    // let r = "em7giyht5zdo9dbs52at0c";
  let r = request.query.id;
   //  console.log(r);
  let cmd = " SELECT * FROM restaurantsTable WHERE queryStringId=?";
  restaurantDB.get(cmd,r,function (err, rows) {
  console.log(err, rows);
  if (rows == undefined) {
      console.log("No database file - creating one");

   } else {
     console.log("Database file found");
     response.json(rows);
     console.log("rows",rows);
   }
  
 })
});





// Actual table creation; only runs if "shoppingList.db" is not found or empty
// Does the database table exist?
let cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='restaurantsTable' ";
restaurantDB.get(cmd, function (err, val) {
    console.log(err, val);
    if (val == undefined) {
        console.log("No database file - creating one");
       createDB();
    } else {
        console.log("Database file found");
    }
});


function createDB() {
  // explicitly declaring the rowIdNum protects rowids from changing if the 
  // table is compacted; not an issue here, but good practice
  //const cmd = 'CREATE TABLE PostcardTable ( rowIdNum INTEGER PRIMARY KEY, listItem TEXT, listAmount TEXT)';
  const cmd = 'CREATE TABLE restaurantsTable ( queryStringId TEXT PRIMARY KEY, name TEXT, image_url TEXT, price TEXT,rating TEXT, review_count TEXT, address TEXT, vote TEXT)';
  restaurantDB.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure",err.message);
    } else {
      console.log("Created database");
    }
 });
}

function randomString() {
return (Math.random().toString(36).substr(2, ) +Math.random().toString(36).substr(2, ));

}

