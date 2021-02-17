// set map 
var map = new L.map('mapid');

map = map.on('load', onMapLoad).setView([41.400, 2.206], 9);
//map.locate({setView: true, maxZoom: 17});
	
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

//en el clusters almaceno todos los markers
var markers 	 = L.markerClusterGroup();
var dataFood 	 = [];

// leaflet general
var marker = new L.Marker();
var popUp  = new L.Popup();

//  general
let allTypes;
let types;
let findMe;
let foundMe = false;


function onMapLoad() {
	// get the data 
	
	 let ownUrl = "https://my-json-server.typicode.com/bcnActivaRepositorio/leafletGps/bares"
	 myPosition();
	// 1) Relleno el data_markers con una petición a la api
	$.getJSON(ownUrl, function(data){
		// we get the whole object
		allTypes = data;
		console.log(allTypes);
		// send it ro render
		render_to_map(allTypes, "all");
		// get rid of repeated types of food
		dataFood = cleanArr(dataFood);
		// 2) Añado de forma dinámica en el select los posibles tipos de restaurantes con numero de indice
		for(let f in dataFood){
			  $('#kind_food_selector').append($('<option>', {value: f, text: dataFood[f]}));
		  }  
	});	
}

$('#kind_food_selector').on('change', function() {
  render_to_map(dataFood, this.value);
});

function render_to_map(data,filter){
	if (filter == "all"){
		// add todos
		dataFood.unshift("Todos");
		// iterate through each 
		$.each(data, function(index){
			// print them all
			makeMarkers(data[index]);
			// kind_food into var, string type
			types = data[index].kind_food;
			// fill the array with the kind of food. Separate them => str to arr
			dataFood.push(types.split(','));
			// unnest the array 
			dataFood = dataFood.flat();
			// all of data has gone here. Clean Arr and dispose repeated data
			dataFood = cleanArr(dataFood);
		});
	} else {
		markers.clearLayers();
		let index = 0;
		let match = "";
		let match2 = [];
		index = parseInt(filter);
		// get rid of repeated types of food
		dataFood = cleanArr(dataFood);
		match = (dataFood[index]);
		// if I click on select "Todos"
		if(match == "Todos")
		// make the makers again
			render_to_map(allTypes, "all");
		// even with a million restaurants I MUST iterate through all of them
		for (let unit of allTypes){
			// safe Keeping in an array to iterate again
			match2 = unit.kind_food.split(',');
			// search array for each word | type of food
			foundMe = match2.includes(match);
			if (foundMe == true)  makeMarkers(unit);
		}
	}
		
}
/**********************************************AUXILIAR FUNCTIONS*************************************************/
function makeMarkers(data){
			data_markers = [];
			marker = new L.Marker(new L.LatLng(data.lat, data.lng));
			// fill the arr for delete and add
			data_markers.push(marker);
			let info = (`${data.name} <br/> ${data.address}<br/> <strong>Tipo de cocina</strong>:<br/> ${data.kind_food}<br/>${data.photo}`);
			addInfo(info);
}
// clear arr from repeated data
const cleanArr = (arr) => arr.filter((foodType, position) => arr.indexOf(foodType) == position );

// function myPosition
function myPosition() {
  // my icon for the gps
  let myIcon = L.icon({
    iconUrl: './img/arch.png',
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    popupAnchor: [0, -30],
   
});
  // only gets THE current position when loading page, doesn't follow!!
  navigator.geolocation.getCurrentPosition(
	  (position) => {
    let myLat = position.coords.latitude;
    let myLng = position.coords.longitude;
    console.log(myLat, myLng);
    // my own Icon to define myt position in map
    marker = new L.Marker([myLat,myLng], {icon: myIcon});
    let info = (`This is my current position. <br/> Latitude: ${myLat.toFixed(2)}<br/> Longitude: ${myLng.toFixed(2)}`);
    addInfo(info);
  },
  (error) => {
	  console.log(error);
  });
};
// add info
function addInfo(str){
	popUp = new L.Popup({maxHeight: 175, maxWidth: 400}).setContent(str);
    markers.addLayer(marker.bindPopup(popUp));
	markers.addTo(map);
}

/*****************************************************************************************************************/
// RESEARCH 

// Fill a select
// https://stackoverflow.com/questions/170986/what-is-the-best-way-to-add-options-to-a-select-from-a-javascript-object-with-jq

// Remove repeated items
// https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array

// Clean markers before making new ones
// https://stackoverflow.com/questions/28636723/how-to-clear-leaflet-map-of-all-markers-and-layers-before-adding-new-ones
// https://github.com/Leaflet/Leaflet/issues/3238

// CORS
// https://stackoverflow.com/questions/31276220/cors-header-access-control-allow-origin-missing
