const productListAdapter = require("../src/adapters/productListAdapter");

xml = productListAdapter.toXML("1234", "11111", "123456", "MTN");

console.log("XML: " + xml);

const json = require("./testResponse.json");

console.log(
  "JS:  " +
    JSON.stringify(
      productListAdapter.toJS(
        '<response><SessionId>c438600e-c376-4fa8-a6a8-cbee334c67af</SessionId><EventType>GetProductList</EventType><event><EventCode>0</EventCode></event><data><ProductList><Category type="SMS"><Name>SMS</Name><Product><Description>Description1</Description><Amount>12.00</Amount><ProductCode>1</ProductCode><Top5Seller>true</Top5Seller></Product><Product><Description>Description2</Description><Amount>13.00</Amount><ProductCode>2</ProductCode><Top5Seller>true</Top5Seller></Product></Category><Category type="DATA"><Name>DATA</Name><Product><Description>Description3</Description><Amount>22.00</Amount><ProductCode>3</ProductCode><Top5Seller>true</Top5Seller></Product><Product><Description>Description4</Description><Amount>29.00</Amount><ProductCode>4</ProductCode><Top5Seller>true</Top5Seller></Product></Category></ProductList></data></response>'
      )
    )
);
