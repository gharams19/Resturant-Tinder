// client-side js, loaded by index.html
// run by the browser each time the page is loaded

const url = "wss://solar-rectangular-fan.glitch.me";
const connection = new WebSocket(url);

let e = document.getElementById("newMsg");
e.addEventListener("change", sendNewMsg);

function sendNewMsg() {
  let e = document.getElementById("newMsg");
  let msgObj = {
    "type": "message",
    "from": "host",
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

let displayProgress = function(message) {
  const pTag = document.getElementById("progress");
  pTag.textContent=message;
 
};

connection.onopen = () => {
  connection.send(JSON.stringify({"type":"helloHost"}));
};

connection.onerror = error => {
  console.log(`WebSocket error: ${error}`);
};

let progressBar = document.getElementById("progress");
let aRestaurant = document.getElementById("restaurant_page");
let keyword_input = document.getElementById("keyword");
let locatino_input = document.getElementById("location");
let autocompletelist = document.getElementById("autocompletelist");

keyword_input.value='';
locatino_input.value='';
//autocompletelist.value='';

autocompletelist.options.length = 0;

/*
connection.onmessage = event => {
  let msgObj = JSON.parse(event.data);
  if (msgObj.type == "message") {
    addMessage(msgObj.from+": "+msgObj.msg);
  }
  else if (msgObj.type == 'command') {
 //   button1.textContent = msgObj.info[0];
 //   button2.textContent = msgObj.info[1];
    aRestaurant.textContent=msgObj.info;
 
     let restaurant = msgObj.info;
    //  alert('got another restaurant ' + restaurant);
    //send AJAX request to server to get a restaurant
     getRestaurant(restaurant);
    
  }
  else if (msgObj.type == 'progress') {
 
 
     displayProgress(msgObj.info);
    
  }
  else {
    addMessage(msgObj.type);
  }
};
*/
connection.onmessage = event => {
 
  //console.log("from client", event.data);
  let msgObj = JSON.parse(event.data);
  if (msgObj.type == "message") {
    addMessage(msgObj.from+": "+msgObj.msg);
  } 
  else if (msgObj.type == 'command') {
 //   button1.textContent = msgObj.info[0];
 //   button2.textContent = msgObj.info[1];
    aRestaurant.textContent=msgObj.info;
 
     let restaurant = msgObj.info;
    //  alert('got another restaurant ' + restaurant);
    //send AJAX request to server to get a restaurant
     getRestaurant(restaurant);
    
  }
   else if (msgObj.type == 'gameover') {
 //   button1.textContent = msgObj.info[0];
 //   button2.textContent = msgObj.info[1];
    aRestaurant.textContent=msgObj.info;
 
     let restaurant = msgObj.info;
    //  alert('got another restaurant ' + restaurant);
    //send AJAX request to server to get a restaurant
     getWinningRestaurant(restaurant);
    
  }
  else if (msgObj.type == 'startover') {
    alert('next round');
    aRestaurant.textContent=msgObj.info;
 
     let restaurant = msgObj.info;
    //  alert('got another restaurant ' + restaurant);
    //send AJAX request to server to get a restaurant
      getRestaurant(restaurant);
    
  }
  else if (msgObj.type == 'abort') {
    alert('next round');
    aRestaurant.textContent=msgObj.info;
 
     let restaurant = msgObj.info;
    //  alert('got another restaurant ' + restaurant);
    //send AJAX request to server to get a restaurant
      getRestaurant(restaurant);
    
  }
  else if (msgObj.type == 'progress') {
 
 
     displayProgress(msgObj.info);
    
  }
  else {
    addMessage(msgObj.type);
  }
};
/* 
setInterval(() => {
  let msg = "hearbeat";
  addMessage("host:" + msg)
  connection.send(msg);
}, 4000);
*/

let keyword = document.getElementById("keyword");
keyword.addEventListener("input", autoComplete);

  //let msg = document.querySelector('#message');
 // let img = document.querySelector('#cardImg');
 // let selected_image = document.querySelector('#selected_image');
//autoComplete();
  function autoComplete() {

  
  let url = "/autoComplete";
  let search_word = document.getElementById("keyword").value;
  let data = {
    "keyword": search_word
  }
  //alert(data.keyword);
  console.log(data.keyword);
  let xhr = new XMLHttpRequest;
 
  xhr.open("POST",url);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  // setup callback function
  xhr.onloadend = function(e) {
    //console.log(e);
    console.log(xhr.responseText);         
   // show_popup( xhr.responseText);
    let responseStr = xhr.responseText;  // get the JSON string 
  //  alert(responseStr);
    let wordList = JSON.parse(responseStr);  // turn it into an object
      
    let dataList = document.getElementById("autocompletelist");
        
         // Loop over the JSON array.
    wordList.forEach(function(item) {
        // Create a new <option> element.
        var option = document.createElement('option');
        // Set the value using the item in the JSON array.
        option.value = item.text;  
    //   alert(option.value);
      console.log(option.value);
        dataList.appendChild(option);
      });
      } 
 
      
  
 
  // Actually send request to server
//xhr.send(JSON.stringify({ "keyword":search_word }));
   // xhr.send(data);
    
    xhr.send(JSON.stringify({ "keyword":search_word }));
     // event.stopPropagation();
}

document.querySelector('#start').addEventListener('click', () => {
 
 // let location = document.getElementById("location").value;
 // let search_word = document.getElementById("autocompletelist").options[0].value;
let msgObj = {
    "type": "message",
    "from": "host",
    "msg": "lets start"
  }
  connection.send(JSON.stringify(msgObj))
// connection.send(JSON.stringify(msgObj));
  // new HttpRequest instance 
  var xmlhttp = new XMLHttpRequest();   
  xmlhttp.open("GET", '/kickoffgame');
  // important to set this for body-parser
//  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  // setup callback function
   
  xmlhttp.onloadend = function(e) {
  console.log(xmlhttp.responseText);
    
   
  
 }
  // all set up!  Send off the HTTP request
 xmlhttp.send();
 //  alert('redirecting...');
 
// window.location.href = "https://brainy-ionian-find.glitch.me/client.html";
});


document.querySelector('#go').addEventListener('click', () => {
 
  let location = document.getElementById("location").value;
  let search_word = document.getElementById("autocompletelist").options[0].value;


  // new HttpRequest instance 
  var xmlhttp = new XMLHttpRequest();   
  xmlhttp.open("POST", '/retrieveRestaurants');
  // important to set this for body-parser
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  // setup callback function
   
  xmlhttp.onloadend = function(e) {
  console.log(xmlhttp.responseText);
    
   let responseStr = xmlhttp.responseText;  // get the JSON string 
  //  alert(responseStr);
    let  restaurantList = JSON.parse(responseStr);  // turn it into an object      
    let dataList = document.getElementById("image_panel");
  
    
    
    //clean up
    dataList.textContent="";
    // Loop over the JSON array.
/*    restaurantList.forEach(function(item) {
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
  xmlhttp.send(JSON.stringify({ "param1":location , "param2":search_word }));
});

/*
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

*/

  // all set up!  Send off the HTTP request
//  xmlhttp.send(JSON.stringify(data));

 //businessdetails();
  function businessdetails() {
   
  let url = "businessdetails";
  
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

function getRestaurant(queryStringID){

     
          var xmlhttp = new XMLHttpRequest();   
          xmlhttp.open("POST", '/getARestaurant');
     
          xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          // setup callback function
          xmlhttp.onloadend = function(e) {
       
           let responseStr = xmlhttp.responseText;  // get the JSON string 

           let  item = JSON.parse(responseStr);  // turn it into an object      
           let dataList = document.getElementById("restaurant");
            dataList.style.background = "#ff6b6b";
           
           let restaurantPage = document.getElementById("restaurant_page");
         
             
            //clean up
            dataList.textContent="";          
            restaurantPage.textContent="";
         
            var yes_btn_div = document.createElement("div");          
            var no_btn_div = document.createElement("div");
            var yes_btn = document.createElement('img');    
            var no_btn = document.createElement('img'); 
            
            
            yes_btn.src="https://cdn.glitch.com/6fccf2e6-5025-49e3-bef1-5d3addbc924c%2FheartButton.svg?v=1590786125475";
            no_btn.src="https://cdn.glitch.com/6fccf2e6-5025-49e3-bef1-5d3addbc924c%2FrejectButton.svg?v=1590786117124";
            yes_btn.className="image-button";
            no_btn.className="image-button"
            yes_btn_div.appendChild(yes_btn);
            no_btn_div.appendChild(no_btn);
   
            
            yes_btn.addEventListener("click", () => {
           let cmdObj= {
             "type": "command",
             "selection":1
           }
           connection.send(JSON.stringify(cmdObj));
          });

          no_btn.addEventListener("click", () => {
             let cmdObj= {
               "type": "command",
               "selection":0
             }

             connection.send(JSON.stringify(cmdObj));
          });

           dataList.appendChild(no_btn_div);
            
           var gallery_div = document.createElement("div");
           gallery_div.className="gallery";
           var img = document.createElement("img");
           img.src = item.image_url;
     
           gallery_div.appendChild(img);
    
   
      
           var desc_div = document.createElement("div");
           desc_div.className="desc";
           desc_div.textContent=item.name + " " + item.price ;
            
           var title_div = document.createElement("div");
           title_div.className="title";
           title_div.textContent=item.address;
       
           var  rating_div = document.createElement("div");
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
           restaurantPage.appendChild(gallery_div);
           dataList.appendChild(restaurantPage);
           dataList.appendChild(yes_btn_div);
        
   //   });

 
  

  }
  // all set up!  Send off the HTTP request
 //    var data = JSON.stringify({ "name": name.value, "email": email.value }); 
  
  xmlhttp.send(JSON.stringify({ "queryID": queryStringID }));
}
function getWinningRestaurant(queryStringID){

     
          var xmlhttp = new XMLHttpRequest();   
          xmlhttp.open("POST", '/getARestaurant');
     
          xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          // setup callback function
          xmlhttp.onloadend = function(e) {
       
           let responseStr = xmlhttp.responseText;  // get the JSON string 

           let  item = JSON.parse(responseStr);  // turn it into an object      
           let dataList = document.getElementById("restaurant");
             let restaurantPage = document.getElementById("restaurant_page");
              let progress = document.getElementById("progress");
              progress.textContent="We got a winner!";
            
            //clean up
            dataList.textContent="";          
            restaurantPage.textContent="";
         
            
           var gallery_div = document.createElement("div");
           gallery_div.className="gallery";
           var img = document.createElement("img");
           img.src = item.image_url;
     
           gallery_div.appendChild(img);
    
   
      
           var desc_div = document.createElement("div");
           desc_div.className="desc";
           desc_div.textContent=item.name + " " + item.price ;
            
           var title_div = document.createElement("div");
           title_div.className="title";
           title_div.textContent=item.address;
       
           var  rating_div = document.createElement("div");
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
           restaurantPage.appendChild(gallery_div);
           dataList.appendChild(restaurantPage);
    //      dataList.appendChild(no_btn_div);
        
   //   });

 
  

  }
  // all set up!  Send off the HTTP request
 //    var data = JSON.stringify({ "name": name.value, "email": email.value }); 
  
  xmlhttp.send(JSON.stringify({ "queryID": queryStringID }));
}