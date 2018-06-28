/******************
 *      VARS      *
 ******************/


var signedIn = false;
var username = "";
var uid = "";

var db_dataset;

var currentairtemp = "";
var counter = 0;




/******************
 *     LOGIN      *
 ******************/


function google_signIn() {
    //Setup the login provider
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().useDeviceLanguage();

    firebase.auth().signInWithPopup(provider).then(function (result) {
        // Signing in was successful 
        console.log("User is signed in :)")
    }).catch(function (error) {
        // Oh no ... an error happened...
        console.error("Ohooo ... " + error);
    });
}

function signOut() {
    console.log("signOut: ...");
    firebase.auth().signOut().then(function () {
        // Signing out was successful 
        console.log("signOut(): User is logged out!");
    }).catch(function (error) {
        // Oh no ... an error happened...
        console.error("signOut(): " + error);
    });
}




/******************
 *    DISPLAY     *
 ******************/


function display_welcome_screen() {

    // Reset the right
    $("#rechter_platzhalter").html('');

    $("#main").fadeOut(400, function () {

        // Display the welcome view
        $("#main").html($("#temp_welcome").html()).fadeIn();

        // Setup the google button
        $("#google_login_bttn").off();
        $("#google_login_bttn").on("click", function () {
            google_signIn();
        })
    });

    // Disable the 'new entry'-button
    $("#new_entry_bttn").addClass("disabled");
}

function display_dashboard() {

    // Create an empty table
    display_clear_table();

    // Change the right column
    $("#rechter_platzhalter").fadeOut(400, function () {

        // Display on the right the account view
        $("#rechter_platzhalter").html($("#temp_account").html())
        $("#rechter_platzhalter").fadeIn();

        // Setup logout button
        $("#signout_bttn").off();
        $("#signout_bttn").on("click", function () { signOut(); });

        // Display name
        $("#name_span").html(username);

        //If everything is ready -> let's create the event listeners;
        db_setup_listeners();
    });

    //Enable the 'new entry'-button
    $("#new_entry_bttn").removeClass("disabled");
}

function display_clear_table() {
    $("#main").fadeOut().html($('#temp_table').html()).fadeIn();
}

function display_create_new_table_row(key, data) {
    // Update the counter
    counter++;

    // Create refrences and a new table-row
    var table_body = $("#entries tbody");
    var row = $("<tr>");

    // Append all entry-data
    row.append($("<th>").attr("scope", "row").html(counter));
    row.append($("<td>").html(data.date));
    row.append($("<td>").html(data.phvalue));
    row.append($("<td>").html(data.watertemp));

    // Append the controll buttons
    var button_group = $("<div>").addClass("btn-group btn-group-sm").attr("role", "group");
    button_group.append($("<button>").attr("type", "button").addClass("btn btn-secondary").html("Bearbeiten").on("click", function () { display_edit(key); }));
    button_group.append($("<button>").attr("type", "button").addClass("btn btn-danger").html("Löschen").on("click", function () { db_delete(key); }));

    row.append($("<td>").append(button_group));

    // Append the row to the table-body
    row.appendTo(table_body);
}

function display_create() {
    // Check users signIn status
    if (!signedIn) {
        alert("Bitte melde dich erst an, um diese Funtion nutzen zu können");
        return;
    }

    //Reset all inputs
    $("#date_inpt").val("");               // Date
    $("#phvalue_inpt").val("7");           // ph-Value
    $("#watertemp_inpt").val("");          // Watertemp
    $("#airtemp_inpt").val(currentairtemp); // Airtemp

    // Show the view
    $("#modal_create").modal();

}

function display_edit(key) {
    var dataset = db_dataset[key];

    // Prepare the modal
    $("#date_inpt_edit").val(dataset.date);           // Date
    $("#phvalue_inpt_edit").val(dataset.phvalue);     // ph-Value
    $("#watertemp_inpt_edit").val(dataset.watertemp); // Watertemp
    $("#airtemp_inpt_edit").val(dataset.airtemp);     // Airtemp
    $("#modal_edit_save_bttn").off().on("click", function() { db_update(key); });

    $("#modal_edit").modal();
}




/******************
 *    DATABASE    *
 ******************/


function db_setup_listeners() {

    // Setup listenes for the entry
    firebase.database().ref('nutzer/' + uid + '/einträge').on('value', function (snapshot) {
        // Reset the vars and the table
        counter = 0;
        display_clear_table();

        //Save the snapshot local
        db_dataset = snapshot.val();

        //Create a new table-row for each entry
        $.each(snapshot.val(), function (key, data) {
            console.info("KEY: " + key + " - DATA: " + data.date);

            display_create_new_table_row(key, data);
        })

        // Empty space in the console
        console.log("");

    });

    // Get the city ID
    firebase.database().ref('nutzer/' + uid + '/cityid').on('value', function (snapshot) {
        var cID = snapshot.val();

        if (cID) {
            // Founded the users cID
            get_weather_for(cID);

            // Hide the modal
            $("#modal_cityid").hide();
        } else {
            // No cID founded

            // Reset the 'save' button, because maybe something has failed while loading the local weather so the cID has benn deleted
            $(this).removeClass("disabled");

            // Show the modal
            $("#modal_cityid").show();

            // Setup the 'save'-button
            $("#save_cityid_bttn").off();
            $("#save_cityid_bttn").on("click", function () {
                $(this).addClass("disabled");
                firebase.database().ref('nutzer/' + uid + '/cityid').set($("#cityid_inpt").val());
            })
        }
    });

}

function db_create_new() {

    // Create refences
    var date = $("#date_inpt");
    var wtemp = $("#watertemp_inpt");
    var atemp = $("#airtemp_inpt");
    var phVal = $("#phvalue_inpt");

    // Create a dataset
    var dataset = {
        date: date.val(),
        watertemp: wtemp.val(),
        airtemp: atemp.val(),
        phvalue: phVal.val()
    }

    // Create a new entry with an generetic key form firebase
    var entrykey = firebase.database().ref('nutzer/' + uid + '/einträge').push().key;
    firebase.database().ref('nutzer/' + uid + '/einträge/' + entrykey).set(dataset);

    // Hide the view
    $("#modal_create").modal("hide");
}

function db_update(key) {
    // Create refences
    var date = $("#date_inpt_edit");
    var wtemp = $("#watertemp_inpt_edit");
    var atemp = $("#airtemp_inpt_edit");
    var phVal = $("#phvalue_inpt_edit");

    // Create a dataset
    var updateset = {
        date: date.val(),
        watertemp: wtemp.val(),
        airtemp: atemp.val(),
        phvalue: phVal.val()
    }

    firebase.database().ref('nutzer/' + uid + '/einträge/' + key).update(updateset);

    // Hide the view
    $("#modal_edit").modal("hide");
}

function db_delete(key) {
    // Get the entry-date
    var date = db_dataset[key].date;

    // 'Are you sure ?'
    if (confirm('Möchtest du den Eintrag vom ' + date + ' wirklich löschen?')) {
        // YES i am -> delete
        firebase.database().ref('nutzer/' + uid + '/einträge').child(key).remove();
    } else {
        // oh NO! -> do nothing   
    }
}




/******************
 *      API       *
 ******************/


function get_weather_for(cID) {

    // Let's make a request to openweathermap.prg for the current weather
    /*$.get("http://api.openweathermap.org/data/2.5/weather",
        {
            zip: cID + ",de",
            APPID: "0bddd68b0f92de61a11669aafbc54ccc",
        }, function (data) {

            //Convert form kelvin to celsius
            var temp = data.main.temp - 273.15
            console.info("Aktuelle Temperatur: " + temp + " C");
            
            //Save the temp
            currentairtemp = temp;
        }).fail(function (x) {
            if (x.statCode = 401) {
                alert("Dein API-Key ist ungültig");
            } else {
                alert("Mit deiner Stadt ist was schief gelaufen, bitte gebe deine Plz erneut an!");
                firebase.database().ref('nutzer/' + uid + '/cityid').remove();
            }
        });*/
    currentairtemp = 76;
}




/******************
 *      MAIN      *
 ******************/
function setup() {
    // Check login
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log("onAuthStateChanged: User is signed in");
            signedIn = true;
            username = user.displayName;
            uid = user.uid;

            display_dashboard();
        } else {
            // No user is signed in.
            console.log("onAuthStateChanged: No user is signed in");
            signedIn = false;
            username = "";
            uid = "";

            display_welcome_screen();
        }
    });
}

setup();