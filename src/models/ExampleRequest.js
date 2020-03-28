const xmlTemplate =
  "<property1>$property1</property1><property2>$property2</property2>";

export default class ExampleRequest {
  constructor(object) {
    this.property1 = object.property1;
    this.property2 = object.property2;
  }

  toXML() {
    return xmlTemplate
      .replace("$property1", this.property1)
      .replace("$property2", this.property2);
  }
}
