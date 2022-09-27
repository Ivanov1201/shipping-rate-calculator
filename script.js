$("#main_form").submit(function (e) {

  e.preventDefault();
  let method = -1; // Ground
  if ($("#UPS").prop("checked")) {
    method = 0; // UPS
  } else if ($("#FedEx").prop("checked")) {
    method = 1; //FeDex
  } else if ($("#Ground").prop("checked")){
    method = 2; //Ground
  } else {
    alert("Please select the method");
    return;
  }

  $.ajax({
    method: "POST",
    url: "server.php",
    data: {
      ShipFrom: $("#ShipFrom").val(),
      ShipTo: $("#ShipTo").val(),
      weight: $("#weight").val(),
      Height: $("#Height").val(),
      Length: $("#Length").val(),
      Width: $("#Width").val(),
      method: method
    },
    success: function (result) {
      let response = JSON.parse(result);
      handle_response(method, response);
    },
    error: function (error) {
      console.log("ERROR:", error);
    }
  });
});

function handle_response(method, response) {
  let result;
  if (method == 0) {
    result = response?.RateResponse?.RatedShipment?.TotalCharges?.MonetaryValue || '';
  } else if(method == 1) {
    result = "FEDEX";
  } else if (method == 2) {
    result = 0;
  }
  $("#price").val(result);
}