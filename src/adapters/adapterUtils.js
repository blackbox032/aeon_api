var xml2json = require("xml2json");

const RESPONSECONVERSIONERROR = "ResponseConversionError";

function nested(obj, path) {
  return path.split(".").reduce((obj, level) => obj && obj[level], obj);
}

function aeonError(eventType, errorText, aeonErrorText, AeonError ) {
  return {
    SessionId: "NA",
    EventType: eventType,
    ErrorCode: -1,
    ErrorText: errorText,
    AEONErrorCode: -1,
    AEONErrorText: aeonErrorText,
    AeonErrorText: AeonError == undefined ? aeonErrorText : AeonError,
    error: true,
  };
}

function getObj(xml) {
  try {
    response = JSON.parse(xml2json.toJson(xml)).response;
    if (
      response.event != undefined &&
      response.event.EventCode != undefined &&
      response.event.EventCode == 1
    ) {
      //response is an error:
      //following code transforms the js object into one that
      //looks like the object in the aeonError function above
      delete response.event;
      response.error = true;
    }

    //All response types:
    //promote all properties in the response.data key
    //to root propertiies

    Object.keys(response.data).forEach((key) => {
      response[key] = response.data[key];
    });

    if (response.AEONErrorCode == undefined) {
      response.AEONErrorCode = response.ErrorCode;
    }

    if (response.AEONErrorText == undefined) {
      response.AEONErrorText = response.ErrorText;
    }

    delete response.data;
  } catch (ex) {
    return aeonError(
      RESPONSECONVERSIONERROR,
      ex.message,
      "Communication Error"
    );
  }
  return response;
}

module.exports = {
  RESPONSECONVERSIONERROR,
  nested,
  aeonError,
  getObj,
};
