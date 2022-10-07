<?php

$param = $_POST;

function CallAPI($method, $url, $requestHeader, $requestBody = false)
{
    $curl = curl_init();

    switch ($method)
    {
      case "POST":
        curl_setopt($curl, CURLOPT_POST, 1);

        if ($requestBody)
          curl_setopt($curl, CURLOPT_POSTFIELDS, $requestBody);
        break;
      default:
        if ($requestBody)
          $url = sprintf("%s?%s", $url, http_build_query($requestBody));
    }

    // Optional Authentication:
    curl_setopt($curl, CURLOPT_HTTPHEADER, $requestHeader);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    curl_setopt($curl, CURLOPT_URL, $url);

    $result = curl_exec($curl);
    // echo json_encode(curl_getinfo($curl));
    curl_close($curl);
    return $result;
}

//

function get_ups_rate() {
  global $param;
  $requestBody = json_decode(file_get_contents('UPS.json'));
  $requestBody->RateRequest->Shipment->ShipFrom->Address->AddressLine = $param['AddressLine_from'];
  $requestBody->RateRequest->Shipment->ShipFrom->Address->City = $param['City_From'];
  $requestBody->RateRequest->Shipment->ShipFrom->Address->StateProvinceCode = $param['StateProvinceCode_From'];
  $requestBody->RateRequest->Shipment->ShipFrom->Address->PostalCode = $param['PostalCode_From'];
  
  $requestBody->RateRequest->Shipment->ShipTo->Address->AddressLine = $param['AddressLine_To'];
  $requestBody->RateRequest->Shipment->ShipTo->Address->City = $param['City_To'];
  $requestBody->RateRequest->Shipment->ShipTo->Address->StateProvinceCode = $param['StateProvinceCode_To'];
  $requestBody->RateRequest->Shipment->ShipTo->Address->PostalCode = $param['PostalCode_To'];

  $requestBody->RateRequest->Shipment->ShipmentTotalWeight->Weight = $param['weight'];
  $requestBody->RateRequest->Shipment->Package->Dimensions->Height = $param['Height'];
  $requestBody->RateRequest->Shipment->Package->Dimensions->Length = $param['Length'];
  $requestBody->RateRequest->Shipment->Package->Dimensions->Width = $param['Width'];
  $requestBody->RateRequest->Shipment->Package->PackageWeight->Weight = $param['weight'];

  $ups_service_description = (object) [
    '01' => 'Next Day Air',
    '02' => '2nd Day Air',
    '03' => 'Ground',
    '12' => '3 Day Select',
    '13' => 'Next Day Air Saver',
    '14' => 'UPS Next Day Air Early',
    '59' => '2nd Day Air A.M.',
  ];
  
  $requestBody->RateRequest->Shipment->Service->Code = $param['service_type'];
  $requestBody->RateRequest->Shipment->Service->Description = $ups_service_description->{$param['service_type']};

  $UPS_API_ENDPOINT = "https://onlinetools.ups.com/ship/v1/rating/Rate";
  $requestHeader = array(
    "transId: NEED_TO_BE_UPDATED",
    "transactionSrc: NEED_TO_BE_UPDATED",
    "AccessLicenseNumber: NEED_TO_BE_UPDATED",
    "Username: NEED_TO_BE_UPDATED",
    "Password: NEED_TO_BE_UPDATED",
    "contentType: application/json",
  );
  $response = CallAPI("POST", $UPS_API_ENDPOINT, $requestHeader, json_encode($requestBody));
  echo $response;
}

function get_fedex_token() {
  $FEDEX_AUTH_REQUEST_TOKEN = "https://apis-sandbox.fedex.com/oauth/token";
  $auth_requestHeader = array (
    "Content-Type: application/x-www-form-urlencoded"
  );
  // you can update client_id and client_secret here;
  $auth_requestBody = "grant_type=client_credentials&client_id=NEED_TO_BE_UPDATED&client_secret=NEED_TO_BE_UPDATED";
  $response = CallAPI("POST", $FEDEX_AUTH_REQUEST_TOKEN, $auth_requestHeader, $auth_requestBody);
  return json_decode($response)->access_token;
}

function get_fedex_rate() {
  global $param;
 
  $token = get_fedex_token();

  $requestBody = json_decode(file_get_contents('Fedex.json'));
  $requestBody->accountNumber->value = "NEED_TO_BE_UPDATED";
  $requestBody->requestedShipment->shipper->address->postalCode = $param['PostalCode_From'];
  $requestBody->requestedShipment->recipient->address->postalCode = $param['PostalCode_To'];
  $requestBody->requestedShipment->requestedPackageLineItems[0]->weight->value = $param['weight'];
  $requestBody->requestedShipment->serviceType = $param['service_type'];
  $requestHeader = array (
    "Content-Type: application/json",
    "authorization: Bearer ".$token
  );
  $FEDEX_API_ENDPOINT = "https://apis-sandbox.fedex.com/rate/v1/rates/quotes";
  $response = CallAPI("POST", $FEDEX_API_ENDPOINT, $requestHeader, json_encode($requestBody));
  echo $response;
}

function get_ground_rate() {
  echo 0;
}

$method = $param['method'];
$result = null;
if ($method == 0) {
  get_ups_rate();
} else if ($method == 1) {
  get_fedex_rate();
} else if ($method == 2) {
  get_ground_rate();
} else if ($method == 3) {
  test_fedex_token();
}
?>