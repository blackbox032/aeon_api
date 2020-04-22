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
  response = utils.getObj(xml);

  if (!response.error) {
    try {
      //look for "SMS" and "DATA" category array entries and promote them
      category = utils.nested(response, "ProductList.Category");

      if (category != undefined) {
        if (Array.isArray(category)) {
          //Category property is array of product types: e.g. [{SMS type object}, {DATA type object}, ...]
          category.forEach((cat) => {
            //if only one product in category, normalize to array if products with one element
            //if its many products will already be an array
            if (!Array.isArray(cat.Product)) {
              cat.Product = [cat.Product];
            }
            //then store that value under a product type key we create on ProductList
            response.ProductList[cat.type] = cat.Product;
          });
          delete response.ProductList.Category;
        } else {
          //Category property is single product type e.g. {SMS type object}
          //if only one product in category, normalize to array if products with one element
          //if its many products will already be an array
          if (!Array.isArray(category.Product)) {
            category.Product = [category.Product];
          }
          //then store that value under a product type key we create on ProductList
          response.ProductList[category.type] = category.Product;
        }
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
