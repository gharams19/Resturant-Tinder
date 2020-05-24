// client-side js, loaded by index.html
// run by the browser each time the page is loaded

const url = "wss://glitch-websocket-chat.glitch.me";
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

connection.onopen = () => {
  connection.send(JSON.stringify({"type":"helloHost"}));
};

connection.onerror = error => {
  console.log(`WebSocket error: ${error}`);
};

connection.onmessage = event => {
  let msgObj = JSON.parse(event.data);
  if (msgObj.type == "message") {
    addMessage(msgObj.from+": "+msgObj.msg);
  } else {
    addMessage(msgObj.type);
  }
};



document.querySelector('#go').addEventListener('click', () => {
 
  let location = document.getElementById("location").value;
  let search_word = document.getElementById("autocompletelist").options[0].value;

 
  alert(location);
   alert(search_word);
  // new HttpRequest instance 
  var xmlhttp = new XMLHttpRequest();   
  xmlhttp.open("POST", '/getRestaurant');
  // important to set this for body-parser
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  // setup callback function
   
  xmlhttp.onloadend = function(e) {
  console.log(xmlhttp.responseText);
    
   let responseStr = xmlhttp.responseText;  // get the JSON string 
  //  alert(responseStr);
    let  restaurantList = JSON.parse(responseStr);  // turn it into an object
      
    let dataList = document.getElementById("image_panel");
        
         // Loop over the JSON array.
    restaurantList.forEach(function(item) {
        // Create a new <option> element.
 //      document.getElementById("restaurantImg").src=data[0].image_url;
       //alert('here');
         var gallery_div = document.createElement('div');
      gallery_div.className="gallery";
      //  alert('here');
         var img = document.createElement('img');
       // alert('here');
        // Set the value using the item in the JSON array.
        img.src = item.image_url;
      //  alert('here');
        gallery_div.appendChild(img);
      //   alert('here');
        var desc_div = document.createElement('div');
      desc_div.className="desc";
      //  alert(item.text);
        // Add the <option> element to the <datalist>.
        
        desc_div.textContent=item.name;
        gallery_div.appendChild(desc_div);
        dataList.appendChild(gallery_div);
       
      });

   // document.getElementById("restaurantImg").src="https://s3-media2.fl.yelpcdn.com/bphoto/LTfgfyCJaboZdhHWemxl5A/o.jpg"
   
  alert(xmlhttp.responseText);
  }
  // all set up!  Send off the HTTP request
  xmlhttp.send(JSON.stringify({ "param1":location , "param2":search_word }));
});

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

let keyword = document.getElementById("keyword");
keyword.addEventListener("change", autoComplete);

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
      //  alert(item.text);
        // Add the <option> element to the <datalist>.
        dataList.appendChild(option);
      });
      } 
 
      
  
 
  // Actually send request to server
xhr.send(JSON.stringify({ "keyword":search_word }));
}
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
  