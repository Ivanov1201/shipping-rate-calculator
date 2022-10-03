$("#main_form").submit(function (e) {

  e.preventDefault();
  let method = -1; // Ground
  if ($("#UPS").prop("checked")) {
    method = 0; // UPS
  } else if ($("#FedEx").prop("checked")) {
    method = 1; //FeDex
    fedex_response = null;
  } else if ($("#Ground").prop("checked")){
    method = 2; //Ground
  } else {
    alert("Please select the method");
    return;
  }

  $.ajax({
    method: "POST",
    url: "server.php",
    // url: "https://cors-everywhere-1.herokuapp.com/https://dev.extrahelp.us/shipcalc/server.php",
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

$("input:radio[name='ShipMethod']").change(function() {
  if ($(this).attr('id') == "FedEx") {
    $("#service_method_wrapper").show();
  } else {
    $("#service_method_wrapper").hide();
  }
});

$("#service_method_wrapper").change(function() {
  handle_fedex_response();
});

let fedex_response = null;

function handle_response(method, response) {
  $("#service_method_wrapper").hide();
  let result;
  if (method == 0) {
    result = response?.RateResponse?.RatedShipment?.TotalCharges?.MonetaryValue || '';
  } else if(method == 1) {
    $("#service_method_wrapper").show();
    fedex_response = response?.output?.rateReplyDetails;
    result = handle_fedex_response();
  } else if (method == 2) {
    result = 0;
  }
  $("#price").val(result);
}

function handle_fedex_response() {
  if (!fedex_response) return;
  let fedex_service_types  = ['fedex_fo', 'fedex_fpo', 'fedex_fso', 'fedex_f2a', 'fedex_f2', 'fedex_fes', 'fedex_fg'];
  let service_type = $("#service_method_wrapper").val();
  let fedex_service_type_id = fedex_service_types.indexOf(service_type);
  return (fedex_service_type_id >= 0) ? fedex_response[fedex_service_type_id].ratedShipmentDetails[0].totalNetFedExCharge : '';
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
