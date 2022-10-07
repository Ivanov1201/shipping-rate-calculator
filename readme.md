# [Shipping Rate Calulator](https://github.com/Ivanov1201/shipping-rate-calculator)

## Project architecture
* **ShipForm.html:** This is where the main components are.
* **Script.js:** This is where we put the client-side scripts.
* **Server.php:** The main part to make calls to the UPS and FedEx API and send them to the front-end.
* **UPS.json:** Main schema for UPS API.
* **FedEx.json:** Main schema for FedEx API.

## Workflow.
* **Input the shipper and receiver details and package details.**
* **Select the service(UPS or FedEx) and service type (Ground, Next Day Air, FedEx 2Day, etc).**
* **Then request is sent from the front-end to the backend.**
* **On the backend, the request body is replaced depending on the details(shippment detail and service type) from the existing schema.**
* **Backend returns the response from the UPS or FedEx API to the front-end once it's successful.**

## Service API endpoints

### UPS
https://onlinetools.ups.com/ship/v1/rating/Rate

### FedEx
https://apis-sandbox.fedex.com/rate/v1/rates/quotes

https://apis-sandbox.fedex.com/oauth/token

## Main factors to replace in the schema for the request

### UPS
* **RateRequest->Shipment->ShipTo:** This is where to replace the address of the receiver.
* **RateRequest->Shipment->ShipFrom:** This is where to put the address of the shipper.
* **RateRequest->Shipment->Service:** This is where to put the service type.<br>
Valid types for domestic service: (Code and Description)<br>
01 = Next Day Air <br>
02 = 2nd Day Air <br>
03 = Ground <br>
12 = 3 Day Select <br>
13 = Next Day Air Saver <br>
14 = UPS Next Day Air Early <br>
59 = 2nd Day Air A.M. <br>

* **RateRequest->Shipment->ShipmentTotalWeight->Weight:** Package weight
* **RateRequest->Shipment->Package->Dimensions->Length:** Package length
* **RateRequest->Shipment->Package->Dimensions->Width:** Package width
* **RateRequest->Shipment->Package->Dimensions->Height:** Package height
* **RateRequest->Shipment->Package->PackageWeight->Weight:** Package weight again.

### Fedex
* **requestedShipment->shipper->address->postalCode :** Shipper address Postal code.
* **requestedShipment->recipient->address->postalCode :** Receiver address Postal code.
* **requestedShipment->requestedPackageLineItems[0]->weight->value :** Package weight. FedEx just needs the weight for the package detail.
* **requestedShipment->serviceType :** This is where to put the service type. <br>
FEDEX_GROUND <br>
FEDEX_EXPRESS_SAVER <br>
FEDEX_2_DAY <br>
FEDEX_2_DAY_AM <br>
STANDARD_OVERNIGHT <br>
PRIORITY_OVERNIGHT <br>
FIRST_OVERNIGHT <br>

## Necessary credentials

### UPS

* **transId**
* **transactionSrc**
* **AccessLicenseNumber**
* **Username**
* **Password**

### FedEx

* **accountNumber**
* **authorization:**
This is the Bearer token that can be fetched with FedEx Account info from<br>
https://apis-sandbox.fedex.com/oauth/token <br> 
grant_type=client_credentials&client_id=NEED_TO_BE_UPDATED&client_secret=NEED_TO_BE_UPDATED

## Available references
* [UPS View Rate Spec](https://developer.ups.com/en-us/catalog/rating/view-rate-spec)
* [FedEx Rates and Transit Times API](https://developer.fedex.com/api/en-us/catalog/rate/v1/docs.html)