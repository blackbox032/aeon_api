const xmlTemplate =
  "<request><SessionId>$sessionId</SessionId><EventType>$eventType</EventType><event>$event</event></request>";

export default class RequestWrapper {
  constructor(sessionId, eventType, request) {
    this.sessionId = sessionId;
    this.eventType = eventType;
    this.request = request;
  }

  toXML() {
    const requestXML = request.toXML();
    return xmlTemplate
      .replace("$sessionId", this.sessionId)
      .replace("$eventType", this.eventType)
      .replace("$event", this.requestXML);
  }
}
