const WebSocket = require("ws");

const express = require("express");
const app = express();
const http = require("http");

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

//const multer = require('multer');
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
let clientCount = 0;
let voteCount = 0;
//let restaurantList = ['qyrgdhjkfijjcnol9pus8o', '6l47ljlg3eatvybv1w48td','exwqsg6xvws16wzoamyk0n','6l47ljlg3eatvybv1w48td','n2np22ho60ogvgrvr9byvr','knv8w02l5vmhbw0q9ym9x7'];
let restaurantList = [];
let currentRestaurant = 0;
let voteYes = 0;
let max_round = 3;
let gameover = 0;
var restaurantInfo = "";
var broadcast_data = "";
let msgObj = [];
let INSERT_UPDATE_TYPE = 1;




wss.on("connection", ws => {
  clientCount += 1;
  currentRestaurant = 0;
  voteYes = 0;
  voteCount = 0;
  gameover = 0;
  INSERT_UPDATE_TYPE = 1;
  restaurantList = [];
  
   
    
  console.log("a new user connected --", clientCount, " users connected");

  ws.on("message", message => {
    console.log(message);

    //ws.send("server echo:" + message);
    msgObj = JSON.parse(message);
    if (msgObj.type == "command") {
      console.log(
        "one user selected restaurant",
        restaurantList[currentRestaurant],
        msgObj.selection
      );
      voteYes += msgObj.selection;
      voteCount += 1;
      console.log("voteYes=", voteYes);
      console.log("voteCount=", voteCount);
      console.log("clientCount=", clientCount);
      console.log("gameover=", gameover);
      if (voteCount == clientCount) {
        console.log(
          "totoal vote is ",
          voteYes,
          " ",
          restaurantList[currentRestaurant]
        );
        //save voting result for the restaurant
        //voteCount = 0;
        // voteYes =0;

        //eliminate the restaurant no bodys likes
        if (voteYes == clientCount) {
          //stop game and broadcast winer
          broadcast_data = JSON.stringify({
            type: "gameover",
            info: restaurantList[currentRestaurant]
          });
          gameover = 1;
          console.log("in got winner block");
          broadcast(broadcast_data);
        }

        console.log("checking....", gameover);
        if (gameover == 0 ) {
          console.log("game is not over.");
          saveVoteResult(restaurantList[currentRestaurant], voteYes);
          voteCount = 0;
          voteYes = 0;
          currentRestaurant += 1;

          if (currentRestaurant < restaurantList.length) {
            restaurantInfo = restaurantList[currentRestaurant];
            broadcast_data = JSON.stringify({
            type: "command",
            info: restaurantInfo
          });
            broadcast(broadcast_data);
          } 
          else if (max_round > 0) {
            console.log("start next round...");
            restaurantList = [];
            INSERT_UPDATE_TYPE = 0;

            restaurantInfo = "Start next round...";
            broadcast_data = JSON.stringify({
              type: "message",
              info: restaurantInfo
            });
            voteCount = 0;
            voteYes = 0;
            currentRestaurant = 0;
            max_round -= 1;
            startNextRound();
           
        
           // setTimeout(function(){ console.log("set timeout"); }, 2000);
          }
          else {
            //no more rounds
            //just produce winner based on who won the most votes
            getWinner() ;
            
            
          }

          
        }
        // console.log(restaurantInfo);
      } else {
        //broadcase number of votes for the restaurants so far

        var percent = voteYes + "/";
        var percent = percent + clientCount;

        console.log("percent =", percent);
        broadcast_data = JSON.stringify({
          type: "progress",
          from: "host",
          info: percent
        });
         broadcast(broadcast_data);
      }
     
    } else if (msgObj.type == "message") {
      broadcast(message);
    } else {
      broadcast(message);
    }
  });

  ws.on("close", () => {
    clientCount -= 1;
    console.log("a user disconnected --", clientCount, " users connected");
  });
  ws.send("connected!");
});

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

//start our server
server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});

const yelp = require("yelp-fusion");

const apiKey = process.env.YELP_API_KEY;
const client = yelp.client(apiKey);

const sql = require("sqlite3").verbose();
const restaurantDB = new sql.Database("restaurants.db");

// Actual table creation; only runs if "shoppingList.db" is not found or empty
// Does the database table exist?
let cmd =
  " SELECT name FROM sqlite_master WHERE type='table' AND name='restaurantsTable' ";
restaurantDB.get(cmd, function(err, val) {
  console.log(err, val);
  if (val == undefined) {
    console.log("No database file - creating one");
    createDB();
  } else {
    //   console.log("Database table found:restaurantsTable");
  }
});

/*
votingTable to log game progress
ex: how many votes for each restaurant

*/
let cmd1 =
  " SELECT name FROM sqlite_master WHERE type='table' AND name='votingTable' ";
restaurantDB.get(cmd1, function(err, val) {
  console.log(err, val);
  if (val == undefined) {
    console.log("No database file - creating one");
    createDB1();
  } else {
    //    console.log("Database table found:votingTable");
  }
});
function createDB() {
  // explicitly declaring the rowIdNum protects rowids from changing if the
  // table is compacted; not an issue here, but good practice
  //const cmd = 'CREATE TABLE PostcardTable ( rowIdNum INTEGER PRIMARY KEY, listItem TEXT, listAmount TEXT)';
  const cmd =
    "CREATE TABLE restaurantsTable ( queryStringId TEXT PRIMARY KEY, name TEXT, image_url TEXT, price TEXT,rating TEXT, review_count TEXT, address TEXT, vote TEXT)";

  restaurantDB.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure", err.message);
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
  const cmd =
    "CREATE TABLE votingTable ( queryStringId TEXT PRIMARY KEY, name TEXT, vote_count INTEGER)";

  restaurantDB.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure", err.message);
    } else {
      console.log("Created database");
    }
  });
}

function randomString() {
  return (
    Math.random()
      .toString(36)
      .substr(2) +
    Math.random()
      .toString(36)
      .substr(2)
  );
}
/*
  To use Yelp API to retrieve list of restaurants based on user inputs: keywords and location

*/

function startNextRound() {
  //let cmd = "  SELECT queryStringId FROM restaurantsTable where queryStringId NOT IN (SELECT queryStringId FROM votingTable ) LIMIT 1;";
restaurantList=[];
  let cmd = "SELECT queryStringId FROM votingTable WHERE vote_count > 0 ";

  restaurantDB.all(cmd, [], (err, rows) => {
    if (err) {
      console.log(err);
    }
    // return rows;
    rows.forEach(row => {
      restaurantList.push(row.queryStringId);
      //   console.log(row.queryStringId);
    });

    if (restaurantList.length != 0) {
      console.log("start over with first restaurant.")
      broadcast(JSON.stringify({ type: "startover", info: restaurantList[0] }));
    } else {
      console.log("aborting game");
      broadcast(JSON.stringify({ type: "abort", info: "game is over" }));
    }
  });
}
function getWinner() {
  //let cmd = "  SELECT queryStringId FROM restaurantsTable where queryStringId NOT IN (SELECT queryStringId FROM votingTable ) LIMIT 1;";
restaurantList=[];
  let cmd = "SELECT queryStringId, MAX(vote_count) as vote  FROM votingTable; ";

  restaurantDB.all(cmd, [], (err, rows) => {
    if (err) {
      console.log(err);
    }
    // return rows;
    rows.forEach(row => {
      restaurantList.push(row.queryStringId);
      //   console.log(row.queryStringId);
    });

    if (restaurantList.length != 0) {
      console.log("found new winner from database")
      broadcast(JSON.stringify({ type: "gameover", info: restaurantList[0] }));
    } else {
      console.log("aborting game");
      broadcast(JSON.stringify({ type: "abort", info: "game is over" }));
    }
  });
}
app.get("/retrieveAutoComplete", function(req, res) {
  console.log("retrieve restaurants.");

  const searchRequest = {
    categories: "Restaurants",
    //  locale: "en_us",
    //  sort_by: 'rating'
    //location: 'us,all'
    location: "All,US,All"
  };

  restaurantList = [];

  client
    .search(searchRequest)
    .then(response => {
      response.jsonBody.businesses.forEach(function(row) {
        const prettyJson = JSON.stringify(row, null, 4);
        console.log(prettyJson[0].alias);
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
    })
    .catch(e => {
      console.log(e);
    });
});

app.post("/retrieveRestaurants", function(req, res) {
  console.log("retrieve restaurants.");
  var location = req.body.param1;
  var keywords = req.body.param2;
  let cata = "restaurant";
  console.log(location);
  console.log(keywords);
  const searchRequest = {
    //term:'Black bear diner',
    term: keywords,
    limit: "10",
   //    limit: '4',
    // categories: cata,
    location: location
    //  sort_by: 'rating'
    //location: 'Davis,ca'
  };

  restaurantList = [];
  let cmd = "DELETE FROM restaurantsTable  ";
  restaurantDB.get(cmd, function(err, rows) {
    console.log(err, rows);
    if (rows == undefined) {
      console.log("No rows found");
    } else {
      console.log("rows are deleted in restaurantsTable");
    }
  });

  let cmd1 = "DELETE FROM votingTable  ";
  restaurantDB.get(cmd1, function(err, rows) {
    console.log(err, rows);
    if (rows == undefined) {
      console.log("No rows found");
    } else {
      console.log("rows are deleted in votingTable");
    }
  });

  client
    .search(searchRequest)
    .then(response => {
      response.jsonBody.businesses.forEach(function(row) {
        //  var result = row.businesses;
        const prettyJson = JSON.stringify(row, null, 4);
        // console.log(prettyJson);
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
    })
    .catch(e => {
      console.log(e);
    });
});

app.post("/autoComplete", function(req, res, next) {
  // console.log("auto compmlete");

  //let data = JSON.parse(req.body);
  let keyword = req.body.keyword;
  //let keyword = data.keyword;
  //  console.log(keyword);
  client
    .autocomplete({
      text: keyword

      //category: "Restaurant,US"
    })
    .then(response => {
      //  console.log(response.jsonBody.terms[0].text);
      //      console.log(response.jsonBody.terms[1].text);//TODO: check length first

      //     response.jsonBody.terms.forEach(function(row) {

      //    const prettyJson = JSON.stringify(row, null, 4);
      //   console.log(prettyJson);
      //  saveRestaurants(prettyJson);

      //});
      console.log(response.jsonBody.terms);

      res.send(response.jsonBody.terms);
    })
    .catch(e => {
      console.log(e);
    });
});

app.post("/reviews", function(req, res, next) {
  console.log("this is review");
  client
    .search({
      term: req.body.name,
      location: req.body.location
    })
    .then(response => {
      //console.log(response.jsonBody.businesses[0].alias);
      //console.log(response.jsonBody.businesses[0].alias);
      client
        .reviews(response.jsonBody.businesses[0].alias)
        .then(response => {
          //console.log(response.jsonBody.reviews[0].text);
          //console.log(response.jsonBody.reviews[1].text);
          res.send(response.jsonBody.reviews);
        })
        .catch(e => {
          console.log(e);
        });
      
    })
    .catch(e => {
      console.log(e);
    });
});

app.get("/businessdetails", function(request, response, next) {
  console.log("this is busness detail");
  client
    .business("black-bear-diner-davis")
    .then(response => {
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
    })
    .catch(e => {
      console.log(e);
    });
});

app.get("/kickoffgame", function(req, res, next) {
  voteCount = 0;
  voteYes = 0;
  console.log("start game");
  //   restaurantList[0]= 'gwkvtz084moqbnrn8jobgs';
  // console.log(restaurantList[0]);
  broadcast(JSON.stringify({ type: "command", info: restaurantList[0] }));
});

function saveRestaurants(response) {
  let rownumid = "";
  let image_url = "";
  let price = "";
  let rating = "";
  let review_count = "";
  let address = "";
  let vote = 0;

  let item = JSON.parse(response);

  rownumid = randomString();
  image_url = item.image_url;
  price = item.price;
  rating = item.rating;
  review_count = item.review_count;
  address = item.location.display_address.toString();
  name = item.name;
  vote = 0;

  /*
  console.log(rownumid );
  console.log(image_url);
  console.log(price);
  console.log(rating);
  console.log(review_count);
  console.log(address);
  console.log(name);
  console.log(vote);
 */

  let cmd =
    "INSERT INTO restaurantsTable ( queryStringId,name,image_url,price,rating, review_count, address, vote) VALUES (?,?,?,?,?,?,?,?) ";
  restaurantDB.run(
    cmd,
    rownumid,
    name,
    image_url,
    price,
    rating,
    review_count,
    address,
    vote,
    function(err) {
      if (err) {
        console.log("DB insert error", err.message);
      } else {
        //    send back query string to browser for display.html
        //  console.log(rownumid);
        // response.send(rownumid);
        restaurantList.push(rownumid);
      }
    }
  );
}

app.post("/getARestaurant", function(request, response) {
  console.log("calling database get a restaurant");
  let r = request.body.queryID;
  // let r = request.query.id;
  console.log("r is ", r);

  //let cmd = "  SELECT queryStringId FROM restaurantsTable where queryStringId NOT IN (SELECT queryStringId FROM votingTable ) LIMIT 1;";
  let cmd = "SELECT * FROM restaurantsTable WHERE queryStringId = ? ";
  restaurantDB.get(cmd, r, function(err, rows) {
    console.log(err, rows);
    if (rows == undefined) {
      console.log("No rows found");
    } else {
      console.log("Database file found:getARestaurant");

      response.json(rows);
      //   console.log("rows",rows);
    }
  });
});

function saveVoteResult(restaurantID, voteCount) {
  console.log("saving to database", restaurantID, voteCount);
  let cmd = "";
  if (INSERT_UPDATE_TYPE == 1 ) {
    console.log("insert to votingTable");
    cmd = "INSERT INTO votingTable ( queryStringId,vote_count) VALUES (?,?) ";
    restaurantDB.run(cmd, restaurantID, voteCount, function(err) {
      if (err) {
        console.log("DB insert error", err.message);
      } else {
        //    send back query string to browser for display.html
        // console.log(restaurantID);
      }
    });
  } else {
    console.log("update to votingTable");
    cmd = "UPDATE votingTable SET vote_count = ? WHERE queryStringId = ?";
    restaurantDB.run(cmd, voteCount, restaurantID, function(err) {
      if (err) {
        console.log("DB update error", err.message);
      } else {
        //    send back query string to browser for display.html
        console.log("DB update successful");
      }
    });
  }
}
