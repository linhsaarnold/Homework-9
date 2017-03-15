var locations = [
    [
        "McPherson Library",
        48.463449,
         -123.309662
    ],
    [
    		"UVIC Bookstore",
        48.466247,
        -123.309753
    ],    
    [
        "Student Union Building",
        48.465173,
         -123.308397
    ],
]

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: new google.maps.LatLng(48.463152,  -123.311588),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {  
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2], locations[i][3]),
        map: map
      });

    var count = 0;

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
           if (locations[i][1]) {
            alert("Latitude,Longitude: 48.463449,-123.309662");
            alert(count++);
        } else if (locations[i][2]) {
            alert("Latitude,Longitude: 48.466247,-123.309753" + count);
            alert(count++);
        } else {
            alert("Latitude,Longitude: 48.465173,-123.308397" + count)
            alert(count++);
        };
        }
      })(marker, i));
    }

//Test for browser compatibility
if (window.openDatabase) {
    //Create the database the parameters are 1. the database name 2.version number 3. a description 4. the size of the database (in bytes) 1024 x 1024 = 1MB
    var mydb = openDatabase("locations_db", "0.1", "A Database of Locations", 1024 * 1024);

    //create the cars table using SQL for the database using a transaction
    mydb.transaction(function(t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY ASC, name TEXT, lat TEXT, long TEXT)");
    });



} else {
    alert("WebSQL is not supported by your browser!");
}

//function to output the list of cars in the database

function updatelocationlist(transaction, results) {
	console.log(transaction);
    console.log(results);
    //initialise the listitems variable
    var listitems = "";
    //get the car list holder ul
    var listholder = document.getElementById("locationlist");

    //clear cars list ul
    listholder.innerHTML = "";

    var i;
    //Iterate through the results
    for (i = 0; i < results.rows.length; i++) {
        //Get the current row
        var row = results.rows.item(i);

        listholder.innerHTML += "<li>" + row.name + " - " + row.lat + " - " + row.long + " (<a href='javascript:void(0);' onclick='deletelocation(" + row.id + ");'>Delete Location</a>)";
    }

}

//function to get the list of cars from the database

function outputlocations() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function(t) {
            t.executeSql("SELECT * FROM locations", [], updatelocationlist);
        });
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}

//function to add the car to the database

function addlocation() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //get the values of the make and model text inputs
        var name = document.getElementById("name").value;
        var lat = document.getElementById("lat").value;
        var long = document.getElementById("long").value;

        //Test to ensure that the user has entered both a make and model
        if (name !== "" && lat !== "" && long !== "") {
            //Insert the user entered details into the cars table, note the use of the ? placeholder, these will replaced by the data passed in as an array as the second parameter
            mydb.transaction(function(t) {
                t.executeSql("INSERT INTO locations (name, lat, long) VALUES (?, ?, ?)", [name, lat, long]);
                outputlocations();
            });
        } else {
            alert("You must enter a name, latitude, and longitude!");
        }
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}


//function to remove a car from the database, passed the row id as it's only parameter

function deletelocation(id) {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function(t) {
            t.executeSql("DELETE FROM locations WHERE id=?", [id], outputlocations);
        });
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}

outputlocations();