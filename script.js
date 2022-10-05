// $("#main_form").submit(function (e) {
//   e.preventDefault();
//   get_value();
// });

$(document).ready(function() {
  get_value();
});

function isValidJSONString(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

function get_value() {
  clear_error();
  let method = -1; // Ground
  let service_type = '-1';
  if ($("#UPS").prop("checked")) {
    method = 0; // UPS
    service_type = $("#ups_service_method_wrapper").val();
  } else if ($("#FedEx").prop("checked")) {
    method = 1; //FeDex
    service_type = $("#fedex_service_method_wrapper").val();
  // } else if ($("#Ground").prop("checked")){
  //   method = 2; //Ground
  } else {
    set_error("Please select the method");
    return;
  }

  let request_data = {
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
    method: method,
    service_type: service_type
  };
  if (Object.values(request_data).includes('')) return;
  $("#price").val('');
  $.ajax({
    method: "POST",
    url: "server.php",
    // url: "https://cors-everywhere-1.herokuapp.com/https://dev.extrahelp.us/shipcalc/server.php",
    data: request_data,
    success: function (result) {
      
      if (!isValidJSONString(result)) {
        set_error("Error occured while requesting. Please try again.");
        return;
      }
      let response = JSON.parse(result);
      console.log(response);
      handle_response(method, response);
    },
    error: function (error) {
      console.log("ERROR:", error);
    }
  });
}

$("input:radio[name='ShipMethod']").change(function() {
  $("#ups_service_method_wrapper").hide();
  $("#fedex_service_method_wrapper").hide();

  if ($(this).attr('id') == "FedEx") {
    $("#fedex_service_method_wrapper").show();
  } else if ($(this).attr('id') == "UPS"){
    $("#ups_service_method_wrapper").show();
  }
  get_value();
});

$("#fedex_service_method_wrapper").change(function() {
  get_value();
});

$("#ups_service_method_wrapper").change(function() {
  get_value();
});

function handle_response(method, response) {
  let result;
  if (method == 0) {
    result = response?.RateResponse?.RatedShipment?.TotalCharges?.MonetaryValue || '';
    if (response?.response?.errors) {
      set_error(response.response.errors[0].message);
    }
  } else if(method == 1) {
    result = response?.output?.rateReplyDetails[0]?.ratedShipmentDetails[0]?.totalNetFedExCharge || '';
  } 
  // else if (method == 2) {
  //   result = 0;
  // }
  $("#price").val(result);
}

function clear_error() {
  $("#error_line").html('');
  $("#error_line").hide();
}

function set_error(error = 'error') {
  $("#error_line").show();
  $("#error_line").html(error);
}

/// Test script ///
// $("#token_access_btn").click(function () {
//   $.ajax({
//     method: "POST",
//     url: "server.php",
//     data: {
//       method: 3 // this means we request fedex token
//     },
//     success: function (result) {
//       let response = JSON.parse(result);
//       console.log(response);
      
//     },
//     error: function (error) {
//       console.log("ERROR:", error);
//     }
//   });
// })
