window.addEventListener('load', function(){

  var height = document.body.scrollHeight
  var main = document.getElementById("main-div");
  main.style.height = height + "px";

  var slider = document.getElementById("rangeSlider")

  slider.addEventListener('input', function(){
    getAllJson(renderAll.bind(this));
  })

  var renderAll = function(data){
    document.getElementById("box-container").innerHTML = "";
    data.forEach(function(animal){
      renderContainer(animal, this.value)
    }.bind(this));
  }
});



var getAllJson = function(callback){

  var request = new XMLHttpRequest();
  var url = "http://localhost:3005/species/all";

  request.open("GET", url);
  request.send();

  request.addEventListener('load', function () {
    if (request.status === 200) {
      var jsonString = request.responseText;
      var data = JSON.parse(jsonString);
      callback(data);
    }
  });
}

var getSpeciesJson = function(speciesName, callback){

  switch(speciesName) {
    case "africanElephant":
        url = "http://localhost:3005/species/12392";
        break;
    case "africanLion":
        url = "http://localhost:3005/species/15951";
        break;
    case "blueWhale":
        url = "http://localhost:3005/species/2477";
        break;
    case "loggerheadTurtle":
        url = "http://localhost:3005/species/3897";
        break;
  }

  var request = new XMLHttpRequest();

  request.open("GET", url);
  request.send();
  request.addEventListener('load', function () {
    if (request.status === 200) {
      var jsonString = request.responseText;
      var data = JSON.parse(jsonString);
      console.log("Data received from server: ", data);
      callback(data);
    }
  });
}

var renderContainer = function(animal, year){
  console.log("Animal!: ", animal)
  var div = document.createElement("div");
  div.className = "circle-div";
  var outer = document.getElementById("box-container")

  var head = document.createElement("p");
  console.log("animal id 72", animal.id)
  head.innerText = animal.name;
  div.appendChild(head)

  div.appendChild(renderCircle(animal, year));
  outer.appendChild(div);
}

var renderCircle = function(animal, year){
  var bgCircle = document.createElement("div");
  bgCircle.className = "bg-circle";
  var inner = renderInnerCircle(animal, year)
  bgCircle.appendChild(inner);
  return bgCircle;
}

var renderInnerCircle = function(animal, year){
  var currentStatus = getCurrentStatus(animal, year);

  var innerCircle = document.createElement("div");
  // innerCircle.className = "inner-circle";

  var newClass;
  if (currentStatus === "Vulnerable"){
    newClass = "vulnerable"
  } else {
    newClass = "endangered"
  }


  innerCircle.className = "inner-circle " + newClass;
  innerCircle.id = animal.id;
  // innerCircle.innerText = animal.name;
  // need a function somewhere to render to a specific size and assign colour - by class?
  return innerCircle;
}

var getCurrentStatus = function(animal, currentYear){
  var assessmentArray = animal.result
  var arrayLength = assessmentArray.length

  console.log("Looking for status at: ", currentYear)

  var index = 0;
  while ( index < (arrayLength-1) && (Number(assessmentArray[index].year) > Number(currentYear))){
    index++;
  }

  var currentStatus = assessmentArray[index].category;
  console.log("Conservation status at "+currentYear+" is ", currentStatus);

  return currentStatus;

}
