

$("#main_form").submit(function (e) {
  e.preventDefault();
  
  if ($("#UPS").prop("checked")) {
    let requestBody = {
      RateRequest: {
        Request: {
          SubVersion: "1704",
          TransactionReference: {
            CustomerContext: " ",
          },
        },
        Shipment: {
          ShipmentRatingOptions: {
            UserLevelDiscountIndicator: "TRUE",
          },
          Shipper: {
            Name: "Trade Show Solutions",
            ShipperNumber: " ",
            Address: {
              AddressLine: "13188 Cardinal Creek Road",
              City: "Eden Prairie",
              StateProvinceCode: "MN",
              PostalCode: "55346",
              CountryCode: "US",
            },
          },
          ShipTo: {
            Name: "Steve Davis",
            Address: {
              AddressLine: $("#ShipTo").val(),
              City: "Lewisville",
              StateProvinceCode: "TX",
              PostalCode: "75077",
              CountryCode: "US",
            },
          },
          ShipFrom: {
            Name: "Trade Show Solutions",
            Address: {
              AddressLine: $("#ShipFrom").val(),
              City: "Eden Prairie",
              StateProvinceCode: "MN",
              PostalCode: "55346",
              CountryCode: "US",
            },
          },
          Service: {
            Code: "03",
            Description: "Ground",
          },
          ShipmentTotalWeight: {
            UnitOfMeasurement: {
              Code: "LBS",
              Description: "Pounds",
            },
            Weight: $("#weight").val(),
          },
          Package: {
            PackagingType: {
              Code: "02",
              Description: "Package",
            },
            Dimensions: {
              UnitOfMeasurement: {
                Code: "IN",
              },
              Length: $("#Length").val(),
              Width: $("#Width").val(),
              Height: $("#Height").val(),
            },
            PackageWeight: {
              UnitOfMeasurement: {
                Code: "LBS",
              },
              Weight: $("#weight").val(),
            },
          },
        },
      },
    };
    $.ajax({
      type: "POST",
      url: "https://cors-everywhere-1.herokuapp.com/https://onlinetools.ups.com/ship/v1/rating/Rate",
      headers: {
        transId: "NEED_TO_BE_UPDATED",
        transactionSrc: "NEED_TO_BE_UPDATED",
        AccessLicenseNumber: "NEED_TO_BE_UPDATED",
        Username: "NEED_TO_BE_UPDATED",
        Password: "NEED_TO_BE_UPDATED",
        contentType: "application/json",
      },
      data: JSON.stringify(requestBody),
      success: function (result) {
        console.log(result);
      },
    });
    console.log(requestBody)
  } else if ($("#FedEx").prop("checked")) {
    let requestBody = {
      "accountNumber": {
        "value": "NEED_TO_BE_UPDATED"
      },
      "requestedShipment": {
        "shipper": {
          "address": {
            "postalCode": 65247,
            "countryCode": "US"
          }
        },
        "recipient": {
          "address": {
            "postalCode": 75063,
            "countryCode": "US"
          }
        },
        "pickupType": "DROPOFF_AT_FEDEX_LOCATION",
        "rateRequestType": [
          "ACCOUNT",
          "LIST"
        ],
        "requestedPackageLineItems": [
          {
            "weight": {
              "units": "LB",
              "value": 10
            }
          }
        ]
      }
    };
    $.ajax({
      type: "POST",
      url: "https://cors-everywhere-1.herokuapp.com/https://apis.fedex.com/rate/v1/rates/quotes",
      headers: {
        contentType: "application/json",
        authorization: "NEED_TO_BE_UPDATED"
      },
      data: JSON.stringify(requestBody),
      success: function (result) {
        console.log(result);
      },
    });
  } else if ($("#Ground").prop("checked")){
    $("#price").val(0);
  } else {
    alert("Please select the method");
  }
 
});
