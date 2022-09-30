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
      AddressLine_from: $("#AddressLine_From").val(),
      City_From: $("#City_From").val(),
      StateProvinceCode_From: $("#StateProvinceCode_From").val(),
      PostalCode_From: $("#PostalCode_From").val(),
      AddressLine_To: $("#AddressLine_To").val(),
      City_To: $("#City_To").val(),
      StateProvinceCode_To: $("#StateProvinceCode_To").val(),
      PostalCode_To: $("#PostalCode_To").val(),
      weight: $("#weight").val(),
      Height: $("#Height").val(),
      Length: $("#Length").val(),
      Width: $("#Width").val(),
      method: method
    },
    success: function (result) {
      let response = JSON.parse(result);
      console.log(response);
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
    result = response?.output?.rateReplyDetails[0]?.ratedShipmentDetails[0]?.totalNetFedExCharge || '';
  } else if (method == 2) {
    result = 0;
  }
  $("#price").val(result);
}

/// Test script ///
$("#token_access_btn").click(function () {
  $.ajax({
    method: "POST",
    url: "server.php",
    data: {
      method: 3 // this means we request fedex token
    },
    success: function (result) {
      let response = JSON.parse(result);
      console.log(response);
      
    },
    error: function (error) {
      console.log("ERROR:", error);
    }
  });
})