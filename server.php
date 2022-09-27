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

    curl_setopt($curl, CURLOPT_URL, $url);

    $result = curl_exec($curl);

    curl_close($curl);

    return $result;
}


function get_ups_rate() {
  global $param;
  $requestBody = json_decode(file_get_contents('UPS.json'));
  $requestBody->RateRequest->Shipment->ShipTo->Address->AddressLine = $param['ShipTo'];
  $requestBody->RateRequest->Shipment->ShipFrom->Address->AddressLine = $param['ShipFrom'];
  $requestBody->RateRequest->Shipment->ShipmentTotalWeight->Weight = $param['weight'];
  $requestBody->RateRequest->Shipment->Package->Dimensions->Height = $param['Height'];
  $requestBody->RateRequest->Shipment->Package->Dimensions->Length = $param['Length'];
  $requestBody->RateRequest->Shipment->Package->Dimensions->Width = $param['Width'];
  $requestBody->RateRequest->Shipment->Package->PackageWeight->Weight = $param['weight'];

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
  return $response;
}

function get_fedex_rate() {
  return "FEDEX";
}

function get_ground_rate() {
  return 0;
}

$method = $param['method'];
$result = null;
if ($method == 0) {
  $result = get_ups_rate();
} else if ($method == 1) {
  $result = get_fedex_rate();
} else if ($method == 2) {
  $result = get_ground_rate();
}

echo $result;
?>