const requestBody = {
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
          AddressLine: "1814 College Pkwy",
          City: "Lewisville",
          StateProvinceCode: "TX",
          PostalCode: "75077",
          CountryCode: "US",
        },
      },
      ShipFrom: {
        Name: "Trade Show Solutions",
        Address: {
          AddressLine: "13188 Cardinal Creek Road",
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
        Weight: "70",
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
          Length: "10",
          Width: "7",
          Height: "5",
        },
        PackageWeight: {
          UnitOfMeasurement: {
            Code: "LBS",
          },
          Weight: "45",
        },
      },
    },
  },
};

$("#main_form").submit(function (e) {
  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "https://onlinetools.ups.com/ship/v1/rating/Rate",
    headers: {
      transId: "",
      transactionSrc: "",
      AccessLicenseNumber: "",
      Username: "",
      Password: "",
      contentType: "application/json"
    },

    data: JSON.stringify(requestBody),
    success: function (result) {
      console.log(result);
    },
  });
});
