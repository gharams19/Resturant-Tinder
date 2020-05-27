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


let clientCount=0;
let voteCount=0;
//let restaurantList = ['AAA', 'BBB','CCC','DDD','EEE','FFF'];
let restaurantList = [];
let currentRestaurant = 0;
let voteYes=0;

wss.on('connection', (ws) => {
  clientCount +=1;
  currentRestaurant = 0;
  console.log("a new user connected --", clientCount, " users connected")
  ws.on('message', (message) => {
    //console.log(message)
    //ws.send("server echo:" + message);
    let msgObj = JSON.parse(message);
    if (msgObj.type == "command") {
       console.log("one user selected restaurant", restaurantList[currentRestaurant], msgObj.selection);
       voteYes += msgObj.selection;
       voteCount +=1;
       if ( voteCount == clientCount) {
          console.log("totoal vote is ", voteYes, " ", restaurantList[currentRestaurant] );
          voteCount = 0;
          voteYes =0;
          currentRestaurant +=1;
         //save voting result for the restaurant 
         // saveVoteResult(currentRestaurant, voteCount);
          let restaurantInfo = 'No more restaurant';
          if (currentRestaurant < restaurantList.length) {
             restaurantInfo = restaurantList[currentRestaurant];
          }
          console.log(restaurantInfo);
          broadcast(JSON.stringify({'type':'command', 'info':restaurantInfo}));
       }
      
      
      
    }
    
   // broadcast(message)
  })
  
  ws.on('close', ()=> {
    clientCount -= 1;
    console.log("a user disconeected --", clientCount, " users connected")
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
  
  let item = JSON.parse(response);
 
  
   rownumid = randomString();
   image_url = item.image_url;
   price = item.price;
   rating = item.rating;
   review_count = item.review_count;
   address = item.location.display_address;
   name = item.name;
   vote= 0;
 
  
  
  console.log(rownumid );
  console.log(image_url);
  console.log(price);
  console.log(rating);
  console.log(review_count);
  console.log(address);
  console.log(name);
  console.log(vote);
 
  
  let cmd = "INSERT INTO restaurantsTable ( queryStringId,name,image_url,price,rating, review_count, address, vote) VALUES (?,?,?,?,?,?,?,?) ";
  restaurantDB.run(cmd,rownumid,name, image_url, price, rating, review_count, address, vote, function(err) {
  if (err) {
             console.log("DB insert error",err.message);
  } else {
                  //    send back query string to browser for display.html
             console.log(rownumid);
            // response.send(rownumid);
            restaurantList.push(rownumid);
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

/*
  To use Yelp API to retrieve list of restaurants based on user inputs: keywords and location

*/
app.post('/retrieveRestaurants', function(req, res){
 

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
     saveRestaurants(prettyJson);
    
});
/*  const firstResult = response.jsonBody.businesses[0];
  const prettyJson = JSON.stringify(firstResult, null, 4);
  console.log(prettyJson);
  
   const secondResult = response.jsonBody.businesses[1];
  const prettyJson2= JSON.stringify(secondResult, null, 4);
  console.log(prettyJson2);
  */
//  const firstResult = response.jsonBody.businesses[0];
  
 
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


app.post("/getARestaurant", function(request, response, next){
 
  console.log(request.body);
  
   let r = request.body.queryID;
 // let r = request.query.id;
   //  console.log(r);
  

  //let cmd = "  SELECT queryStringId FROM restaurantsTable where queryStringId NOT IN (SELECT queryStringId FROM votingTable ) LIMIT 1;";
  let cmd = "SELECT * FROM restaurantsTable where queryStringId = ?";
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

/*
votingTable to log game progress
ex: how many votes for each restaurant

*/
let cmd1 = " SELECT name FROM sqlite_master WHERE type='table' AND name='votingTable' ";
restaurantDB.get(cmd1, function (err, val) {
    console.log(err, val);
    if (val == undefined) {
        console.log("No database file - creating one");
       createDB1();
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
function createDB1() {
  // explicitly declaring the rowIdNum protects rowids from changing if the 
  // table is compacted; not an issue here, but good practice
  //const cmd = 'CREATE TABLE PostcardTable ( rowIdNum INTEGER PRIMARY KEY, listItem TEXT, listAmount TEXT)';
 // const cmd = 'CREATE TABLE restaurantsTable ( queryStringId TEXT PRIMARY KEY, name TEXT, image_url TEXT, price TEXT,rating TEXT, review_count TEXT, address TEXT, vote TEXT)';
  const cmd = 'CREATE TABLE votingTable ( queryStringId TEXT PRIMARY KEY, name TEXT, vote_count INTEGER)';
 
  
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

/*
 To retrieve list of ID of restaurants
 and load to array so server can  pick one at time to send to client
*/
app.get("/getRestaurantIDs", function(request, response, next){
    // let r = "em7giyht5zdo9dbs52at0c";
 // let r = request.query.id;
   //  console.log(r);
  

  let cmd = "  SELECT distinct queryStringId FROM restaurantsTable ";
  restaurantDB.get(cmd,function (err, rows) {
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


 
function saveVoteResult(restaurantID, voteCount) {
  
  let cmd = "INSERT INTO votingTable ( queryStringId,vote_count) VALUES (?,?) ";
  restaurantDB.run(cmd,restaurantID,voteCount, function(err) {
  if (err) {
             console.log("DB insert error",err.message);
  } else {
                  //    send back query string to browser for display.html
             console.log(restaurantID);
          
          }
   });

}






