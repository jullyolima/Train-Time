$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAJsJXw_lZXa31odn6vR6Dh_S1ie4ZOVOw",
        authDomain: "trainhw-9de32.firebaseapp.com",
        databaseURL: "https://trainhw-9de32.firebaseio.com",
        projectId: "trainhw-9de32",
        storageBucket: "",
        messagingSenderId: "885556117779"
    };
    firebase.initializeApp(config);

    var database = firebase.database()

    //-----------------------------------------------------------------

    $("#submitButton").on("click", function (event) {
            event.preventDefault()
            //get all the data from the form
            var name = $("#trainName").val().trim();
            var destination = $("#destination").val();
            var firstTime = $("#firstTime").val().trim();
            var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

            // Difference between the times
            var timeDifference = moment().diff(moment(firstTimeConverted), "minutes");
            var frequency = $("#frequency").val().trim();

            var tRemainder = timeDifference % frequency;
            // Minute Until Train
            var tMinutesTillTrain = frequency - tRemainder;
            // Next Train
            var nextTrain = moment().add(tMinutesTillTrain, "minutes");
            var nextTrain1 = moment(nextTrain).format("hh:mm");
            //save all the input to an object
            var newTrain = {
                name: name,
                destination: destination,
                frequency: frequency,
                nextArrival: nextTrain1,
                minsaway: tMinutesTillTrain,
            }
            //push the data to the DB
            database.ref().push(newTrain);
            //clear the form after submit
            $('#form').each(function () {
                this.reset();
            });
    })

    database.ref().on("child_added", function (snapshot) {
        newTrain = snapshot.val();

        var newTr = $("<tr>");
        var newTd1 = $("<td>");
        var newTd2 = $("<td>");
        var newTd3 = $("<td>");
        var newTd4 = $("<td>");
        var newTd5 = $("<td>");

        newTd1.text(newTrain.name);
        newTd2.text(newTrain.destination);
        newTd3.text(newTrain.frequency);
        newTd4.text(newTrain.nextArrival);
        newTd5.text(newTrain.minsaway);

        newTr.append(newTd1, newTd2, newTd3, newTd4, newTd5);
        var tableBody = $(".table")
        tableBody.append(newTr)
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    })

});