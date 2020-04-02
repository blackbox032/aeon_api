//XML without a corresponding XSD schema file provides no implicit
//way of determining whether a tag's nested tags are elements of an
//array or not. i.e. whether the parent tag should be converted to
//an array property in the resulting JS object
//
//The xml2js library used in our adapters therefore infers whether
//nested tags represent array elements by checking if the same nested tag
//is repeated multiple times. The problem with this is that the returned
//XML may sometimes have repeating tags nested inside a parent tag
//and sometimes only one tag, so the same property may sometimes
//be returned as an array propery and sometimes be return single valued
//This function normalizes the returned js object by ensuring
//that array props are always returned as array values, even if
//only one or no elements are returned nested in the parent tag
//
//Params:
//  object is any js object
//  arraykeys is an array of strings, where each string is a
//    path to a property key in the js object that we must
//    ensure is an array property
//    e.g. ["response.data.Productlist.Category", "response.data.Productlist.Category.Product"]
//
//The function returns a transformed version of the object
//with all array properties appropriately transformed.
function transformArrayKeys(object, arrayKeys) {
  //sort to ensure the innermost Keys are transformed first,
  //where both nested leaf keys and their parent keys must be transformed
  //as in above example. w
  arrayKeys.sort(function(a, b) {
    return b.length - a.length;
  });
  console.log(arrayKeys);
  //now start transforming
  arrayKeys.foreach(arrayKey => {
    //make each arrayKey path string an array
    //so we can do head/tail recursive logic
    //"response.data.Productlist.Category" becomes
    //["response","data","Productlist","Category"]
    keyPath = arrayKey.split(".");
    keyPath.foreach(key => {});
    transformKeys(object, shift(keyPath), keyPath);
  });
}

function transformKeys(object, path, head, tail) {}
