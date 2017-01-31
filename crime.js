var myTable = {};
var lst_crime = [];
var zIndex = 0;


window.onload = function() {
	setVisible();
	// console.log("This is location" + location);
  //initMap();
}




function setVisible() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
	// chrome.runtime.sendMessage ( {command: "gimmeGimme"}, function (response) {
	// 	var location = response.geoLocation;
	// 	var loc = location.split(",");
	// 	findMissingChild(loc[0], loc[1]);
 //        // $.post( "https://maps.googleapis.com/maps/api/geocode/json?latlng="+loc[0]+"," + loc[1]+ "&key=AIzaSyCngncdCEqVb_fy5xpIs1MTxSaYn9sszkc", function( data ) {
 //        //     // $( ".result" ).html( data );
 //        //     var address = data.results[0]["formatted_address"].split(",");
 //        //     findMissingChild(address);
 //        // });
	//     // console.log(response.geoLocation);
	//     // console.log("123");
	// } );
}

function showPosition(position) {
    print(position.coords.latitude +" "+ position.coords.longitude);
    findMissingChild(position.coords.latitude, position.coords.longitude);
}

function findMissingChild(latitude, longtitude) {
	
		$.get( "https://data.seattle.gov/resource/b7bc-eh2a.json", function( data ) {
            determineNearby(data, latitude, longtitude);
        });
   
}

function determineNearby(data, latitude, longitude) {
	//console.log(latitude, longitude);
    // console.log("")
	var curr_date = new Date();
	var curr_string_date = "" + curr_date.getFullYear() + (curr_date.getMonth() + 1) + curr_date.getDate();
	//console.log(curr_string_date);


	for(var i = 0; i < data.length; i++) {
        var info_paragraph = "";
		var distance_km = line(latitude, longitude, data[i].latitude, data[i].longitude);
		var crime_date = new Date(data[i].occurred_date_or_date_range_start);
		var crime_string_date = "" + crime_date.getFullYear() + (crime_date.getMonth() + 1) + crime_date.getDate();
		//console.log(crime_string_date);
		//var notif_div = document.getElementById("notif");
		if (distance_km < 2) {
			$.get( "http://maps.googleapis.com/maps/api/geocode/json?latlng="+data[i].latitude+"," + data[i].longitude
                + "&sensor=true", callbackASDF(i, data, crime_date, distance_km, data[i].latitude, data[i].longitude));
           // if (!myTable[data[i].general_offense_number]) {
           //      myTable[data[i].general_offense_number] = "contain";
           //      info_paragraph = "Location: " + address + "\n";
           //      info_paragraph += "Distance: " + distance_km.toFixed(2) + " kilometer(s) away \n";
           //      info_paragraph += "Time Occurred: " + crime_date.toDateString() + " " + crime_date.getHours() + ":" + crime_date.getMinutes() + " AM/PM";
           //      info_paragraph += "Crime Description: " + data[numberThing].summarized_offense_description;
           //      info_paragraph += "Crime Type: " + data[numberThing].offense_type;
           //      console.log(info_paragraph);
           //  }
            

		}
		//console.log(data[i].longitude + " " + data[i].latitude);
	}
  initMap(latitude, longitude);
  //console.log(myTable);
}


function callbackASDF(numberThing, data, crime_date, distance_km, latitude, longitude) {
    return function(data_add) {
        if (!myTable[data[numberThing].general_offense_number]) {
            myTable[data[numberThing].general_offense_number] = "contain";
            var crime_info = [];

            var address = data_add.results[0].formatted_address.split(",");



            info_paragraph = "Location: " + address + "\n";
            info_paragraph += "Distance: " + distance_km.toFixed(2) + " kilometer(s) away \n";
            info_paragraph += "Time Occurred: " + crime_date.toDateString() + " " + crime_date.getHours() + ":" + crime_date.getMinutes() + " AM/PM \n";
            info_paragraph += "Crime Description: " + data[numberThing].summarized_offense_description + "\n";
            info_paragraph += "Crime Type: " + data[numberThing].offense_type + "\n";
            // console.log(info_paragraph);

            lst_crime.push(info_paragraph);
            lst_crime.push(latitude);
            lst_crime.push(longitude);
            lst_crime.push(zIndex);
            zIndex++;


        }
    }
}

// return distance
function line(lat1, lon1, lat2, lon2) {
	    //Radius of the earth in:  1.609344 miles,  6371 km  | var R = (6371 / 1.609344);
 var R = 6371; // Radius of the earth in km
  var dLat = (lat2 - lat1) * Math.PI / 180;  // deg2rad below
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a = 
     0.5 - Math.cos(dLat)/2 + 
     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
     (1 - Math.cos(dLon))/2;

  return R * 2 * Math.asin(Math.sqrt(a));

}


      // The following example creates complex markers to indicate beaches near
      // Sydney, NSW, Australia. Note that the anchor is set to (0,32) to correspond
      // to the base of the flagpole.

      function initMap(latitude, longitude) {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: {lat: latitude, lng: longitude}
        });

        setMarkers(map, latitude, longitude);
      }

      // Data for the markers consisting of a name, a LatLng and a zIndex for the
      // order in which these markers should display on top of each other.
      // var beaches = [
      //   ['Bondi Beach', -33.890542, 151.274856, 4],
      //   ['Coogee Beach', -33.923036, 151.259052, 5],
      //   ['Cronulla Beach', -34.028249, 151.157507, 3],
      //   ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
      //   ['Maroubra Beach', -33.950198, 151.259302, 1]
      // ];
      //console.log(beaches);

      function setMarkers(map, latitude, longitude) {
        // Adds markers to the map.

        // Marker sizes are expressed as a Size of X,Y where the origin of the image
        // (0,0) is located in the top left of the image.

        // Origins, anchor positions and coordinates of the marker increase in the X
        // direction to the right and in the Y direction down.
        var image = {
          url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(20, 32),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
        };
        // Shapes define the clickable region of the icon. The type defines an HTML
        // <area> element 'poly' which traces out a polygon as a series of X,Y points.
        // The final coordinate closes the poly by connecting to the first coordinate.
        var shape = {
          coords: [1, 1, 1, 20, 18, 20, 18, 1],
          type: 'poly'
        };

        var marker = new google.maps.Marker({
            position: {lat: latitude, lng: longitude},
            map: map,
            icon: image,
            shape: shape,
            title: "I'm here",
            zIndex: 1
        });

        // console.log(lst_crime);
        // for (var i = 0; i < beaches.length; i++) {
        //   var beach = beaches[i];
        //   var marker = new google.maps.Marker({
        //     position: {lat: beach[1], lng: beach[2]},
        //     map: map,
        //     icon: image,
        //     shape: shape,
        //     title: beach[0],
        //     zIndex: beach[3]
        //   });
        // }
        console.log("here");
        console.log(lst_crime);
        // for (var i = 0; i < lst_crime.length; i++) {
          // console.log(i);
          var crime = lst_crime[0];
          var marker = new google.maps.Marker({
            position: {lat: crime[1], lng: crime[2]},
            map: map,
            icon: image,
            shape: shape,
            title: crime[0],
            zIndex: crime[3]
          });
        // }

      }





