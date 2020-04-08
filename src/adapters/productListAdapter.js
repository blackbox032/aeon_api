var utils = require("./adapterUtils");

function toXML(userPin, deviceId, deviceSer, transType) {
  ret =
    `<request>` +
    `<EventType>GetProductList</EventType>` +
    `<event>` +
    `<UserPin>${userPin}</UserPin>` +
    `<DeviceId>${deviceId}</DeviceId>` +
    `<DeviceSer>${deviceSer}</DeviceSer>` +
    `<TransType>${transType}</TransType>` +
    `</event>` +
    `</request>`;
  return ret + "\n";
}

//may return success response
//or standard error object
function toJS(xml) {
  response = utils.getObj(userPin, deviceId, deviceSer, transType);

  if (!response.error) {
    try {
      //look for "SMS" and "DATA" category array entries and promote them
      category = utils.nested(response, "ProductList.Category");

      if (category != undefined && Array.isArray(category)) {
        category.forEach((cat) => {
          if (!Array.isArray(cat.Product)) {
            cat.Product = [cat.Product];
          }
          response.ProductList[cat.type] = cat.Product;
        });
        delete response.ProductList.Category;
      } else {
        response.ProductList = {};
      }
      return response;
    } catch (ex) {
      utils.aeonError(
        utils.RESPONSECONVERSIONERROR,
        "Failed to convert product list xml",
        "Communication Error"
      );
    }
  }
}

module.exports = {
  toXML,
  toJS,
};
