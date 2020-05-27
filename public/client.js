// client-side js, loaded by index.html
// run by the browser each time the page is loaded

const url = "wss://solar-rectangular-fan.glitch.me";
const connection = new WebSocket(url);

let e = document.getElementById("newMsg");
e.addEventListener("change", sendNewMsg);


let button1 = document.getElementById("btn1");
let button2 = document.getElementById("btn2");
let progressBar = document.getElementById("progress");
let aRestaurant = document.getElementById("restaurant");


button1.addEventListener("click", () => {
   let cmdObj= {
     "type": "command",
     "selection":1
   }
   connection.send(JSON.stringify(cmdObj));
});

button2.addEventListener("click", () => {
   let cmdObj= {
     "type": "command",
     "selection":0
   }
  
   connection.send(JSON.stringify(cmdObj));
});
function sendNewMsg() {
  let e = document.getElementById("newMsg");
  let msgObj = {
    "type": "message",
    "from": "a client",
    "msg": e.value
  }
  connection.send(JSON.stringify(msgObj));
  e.value = null;
}

let addMessage = function(message) {
  const pTag = document.createElement("p");
  pTag.appendChild(document.createTextNode(message));
  document.getElementById("messages").appendChild(pTag);
};


connection.onopen = () => {
  connection.send(JSON.stringify({"type": "helloClient"}));
};

connection.onerror = error => {
  console.log(`WebSocket error: ${error}`);
};


connection.onmessage = event => {
  console.log(event.data);
  let msgObj = JSON.parse(event.data);
  if (msgObj.type == "message") {
    addMessage(msgObj.from+": "+msgObj.msg);
  } 
  else if (msgObj.type == 'command') {
 //   button1.textContent = msgObj.info[0];
 //   button2.textContent = msgObj.info[1];
     aRestaurant.textContent = msgObj.info;
     let restaurant = msgObj.info;
    //send AJAX request to server to get a restaurant
  
     console.log("this is:",restaurant);
     getRestaurant(restaurant);
  }
  else {
    addMessage(msgObj.type);
  }
};


function getRestaurant(queryStringID){

  let data = {    
    "queryID": queryStringID
  }

  // new HttpRequest instance 
  var xmlhttp = new XMLHttpRequest();   
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  let url = '/getARestaurant';
  xmlhttp.open("POST", url);
  // important to set this for body-parser

  // setup callback function
   
  xmlhttp.onloadend = function(e) {
    //console.log("call back now...");
    
//  alert(xmlhttp.responseText);
  console.log(xmlhttp.responseText);
     console.log("call back now...");
   let responseStr = xmlhttp.responseText;  // get the JSON string 
  //  alert(responseStr);
/*    let  restaurantList = JSON.parse(responseStr);  // turn it into an object      
    let dataList = document.getElementById("restaurant");    
    
    //clean up
    dataList.textContent='';
    // Loop over the JSON array.
    restaurantList.forEach(function(item) {
           console.log("iterating...");
           var gallery_div = document.createElement('div');
           gallery_div.className="gallery";
           var img = document.createElement('img');
           img.src = item.image_url;
     
           gallery_div.appendChild(img);
      
           var desc_div = document.createElement('div');
           desc_div.className="desc";
           desc_div.textContent=item.name + " " + item.price ;
            
           var title_div = document.createElement('div');
           title_div.className="title";
           title_div.textContent=item.location.display_address;
       
           let  rating_div = document.createElement('div');
           rating_div.className="rating";
          
      
          
           if(item.rating==5) {
              var rating1 = document.createElement('i');
              rating1.className="fas fa-star";
             
              var rating2 = document.createElement('i');
              rating2.className="fas fa-star";
             
              var rating3 = document.createElement('i');
              rating3.className="fas fa-star"
             
              var rating4 = document.createElement('i');
              rating4.className="fas fa-star"
             
              var rating5 = document.createElement('i');
              rating5.className="fas fa-star"
             
             rating_div.appendChild(rating1);
             rating_div.appendChild(rating2);
             rating_div.appendChild(rating3);
             rating_div.appendChild(rating4);
             rating_div.appendChild(rating5);
             
           }
           else if(item.rating==4) {
              var rating1 = document.createElement('i');
              rating1.className="fas fa-star";
             
              var rating2 = document.createElement('i');
              rating2.className="fas fa-star";
             
              var rating3 = document.createElement('i');
              rating3.className="fas fa-star"
             
              var rating4 = document.createElement('i');
              rating4.className="fas fa-star"
             
              var rating5 = document.createElement('i');
              rating5.className="far fa-star"
          
              rating5.textContent=item.review_count + " reviews";
              rating_div.appendChild(rating1);
              rating_div.appendChild(rating2);
              rating_div.appendChild(rating3);
              rating_div.appendChild(rating4);
              rating_div.appendChild(rating5);
             
           } 
           else if(item.rating==4.5) {
             
              var rating1 = document.createElement('i');
              rating1.className="fas fa-star";
            
              var rating2 = document.createElement('i');
              rating2.className="fas fa-star";
             
              var rating3 = document.createElement('i');
              rating3.className="fas fa-star"
             
              var rating4 = document.createElement('i');
              rating4.className="fas fa-star"
             
              var rating45 = document.createElement('i');
              rating45.className="fas fa-star-half-alt"
              rating45.textContent=item.review_count + " reviews";
             
              rating_div.appendChild(rating1);
              rating_div.appendChild(rating2);
              rating_div.appendChild(rating3);
              rating_div.appendChild(rating4);
              rating_div.appendChild(rating45);
             
             
           } 
           else if(item.rating==3) {
            var rating1 = document.createElement('i');
              rating1.className="fas fa-star";
             
              var rating2 = document.createElement('i');
              rating2.className="fas fa-star";
             
              var rating3 = document.createElement('i');
              rating3.className="fas fa-star"
          
               var rating4 = document.createElement('i');
              rating4.className="far fa-star"
             
              var rating5 = document.createElement('i');
              rating5.className="far fa-star"
              rating5.textContent=item.review_count + " reviews";
              rating_div.appendChild(rating1);
              rating_div.appendChild(rating2);
              rating_div.appendChild(rating3);
              rating_div.appendChild(rating4);
              rating_div.appendChild(rating5);
          
           }
           else if(item.rating==3.5) {
              var rating1 = document.createElement('i');
              rating1.className="fas fa-star";
             
              var rating2 = document.createElement('i');
              rating2.className="fas fa-star";
             
              var rating3 = document.createElement('div');
              rating3.className="fas fa-star"
             
            
             
              var rating35 = document.createElement('i');
                               
              rating35.className="fas fa-star-half-alt"
             
              var rating4 = document.createElement('i');
              rating4.className="far fa-star"
              rating4.textContent=item.review_count + " reviews";
             
              rating_div.appendChild(rating1);
              rating_div.appendChild(rating2);
              rating_div.appendChild(rating3);
              rating_div.appendChild(rating35);
              rating_div.appendChild(rating4);
           }
           else if(item.rating==2) {
              var rating1 = document.createElement('i');
              rating1.className="fas fa-star";
             
              var rating2 = document.createElement('i');
              rating2.className="fas fa-star";
              
              var rating3 = document.createElement('i');
              rating3.className="far fa-star"
              var rating4 = document.createElement('i');
              rating4.className="far fa-star"
              var rating5 = document.createElement('i');
              rating5.className="far fa-star"
              rating5.textContent=item.review_count + " reviews";
              rating_div.appendChild(rating1);
              rating_div.appendChild(rating2);
              rating_div.appendChild(rating3);
              rating_div.appendChild(rating4);
              rating_div.appendChild(rating5);
            
           }
           else if(item.rating==2.5) {
              var rating1 = document.createElement('i');
              rating1.className="fas fa-star";
             
              var rating2 = document.createElement('i');
              rating2.className="fas fa-star";
             
              var rating25 = document.createElement('i');
              rating25.className="fas fa-star-half-alt"
             
              var rating4 = document.createElement('i');
              rating4.className="far fa-star"
              var rating5 = document.createElement('i');
              rating5.className="far fa-star"
              rating5.textContent=item.review_count + " reviews";
             
              rating_div.appendChild(rating1);
              rating_div.appendChild(rating2);           
              rating_div.appendChild(rating25);
              rating_div.appendChild(rating4);
              rating_div.appendChild(rating5);
             
           }
           else if(item.rating==1) {
              var rating1 = document.createElement('i');
              rating1.className="fas fa-star";      
            
              var rating2 = document.createElement('i');
              rating2.className="far fa-star"
              var rating3 = document.createElement('i');
              rating3.className="far fa-star"
           
             
             
              var rating4 = document.createElement('i');
              rating4.className="far fa-star"
              var rating5 = document.createElement('i');
              rating5.className="far fa-star"
              rating5.textContent=item.review_count + " reviews";
             
              rating_div.appendChild(rating1);
              rating_div.appendChild(rating2);
              rating_div.appendChild(rating3);
              rating_div.appendChild(rating4);
              rating_div.appendChild(rating5);
           
           }
           else if(item.rating==1.5) {
             var rating1 = document.createElement('i');
             rating1.className="fas fa-star";
             
             var rating15 = document.createElement('i');
             rating15.className="fas fa-star-half-alt"
             
             var rating3 = document.createElement('i');
             rating3.className="far fa-star"
           
             
             
             var rating4 = document.createElement('i');
             rating4.className="far fa-star"
             var rating5 = document.createElement('i');
             rating5.className="far fa-star"
             rating5.textContent=item.review_count + " reviews";
             rating_div.appendChild(rating1);
             rating_div.appendChild(rating15);
             rating_div.appendChild(rating3);
             rating_div.appendChild(rating4);
             rating_div.appendChild(rating5);
           }
      
           gallery_div.appendChild(desc_div);
           gallery_div.appendChild( title_div);     
           gallery_div.appendChild(rating_div);          
           dataList.appendChild(gallery_div);
     
      });

  */ 
  }
  // all set up!  Send off the HTTP request
 //    var data = JSON.stringify({ "name": name.value, "email": email.value }); 
  
  xmlhttp.send(JSON.stringify(data));
}

//reviews();
function reviews() {
  let url = "reviews";
  
  let xhr = new XMLHttpRequest;
  xhr.open("GET",url);
  // Next, add an event listener for when the HTTP response is loaded
  xhr.addEventListener("load", function() {
      if (xhr.status == 200) {
        let responseStr = xhr.responseText;  // get the JSON string 
        let gList = JSON.parse(responseStr);  // turn it into an object
    //    display(gList);  // print it out as a string, nicely formatted
      } else {
        console.log(xhr.responseText);
      }
  });
  // Actually send request to server
  xhr.send();
}