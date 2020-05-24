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

//start our server
server.listen(process.env.PORT, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});


const yelp = require('yelp-fusion');

const apiKey = process.env.YELP_API_KEY;
const client = yelp.client(apiKey);




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
