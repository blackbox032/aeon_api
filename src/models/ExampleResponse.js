export default class ExampleResponse extends ResponseWrapper {
  constructor(xml) {
    //this statement calls the constructor of the parent ResponseWrapper class,
    //which produces the properties
    // this.sessionId
    // this.eventType
    // this.event
    // this.event.eventCode
    // this.event.eventDescription
    // this.innerXML
    super(xml);

    // Need code to convert this.innerXML (from the above call to the parent ResponseWrapper constructor)
    // json properties, resulting in
    //
    // this.response.property1
    // this.response.property2
    // this.response.property3
    // ...
  }
}
