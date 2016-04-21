#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

//setup wifi
const char* ssid     = "XXX";
const char* password = "XXXX";

//setup host
const char* host        = "iot.dolstra.me"; // Your domain
String getPath          = "/api/status";
String postPath         = "/api";
const int httpPort      = 80;

//setup ledpins
const int redLedPin     = D0;
const int greenLedPin   = D1;
const int orangeLedPin  = D2;

//setup sensors and sound pin
const int soundPin      = D3;
const int sensorPin     = D4;

//sensor value
int sensorValue         = 0;

//change WiFiClient to client var
WiFiClient client;

void setup() {
  //set serial
  Serial.begin(9600);

  //setpint leds
  pinMode(redLedPin, OUTPUT);
  pinMode(greenLedPin, OUTPUT);
  pinMode(orangeLedPin, OUTPUT);

  //set pins sensors
  pinMode(soundPin, OUTPUT);
  pinMode(sensorPin, INPUT);

  Serial.println("Connecting to ");
  Serial.println(ssid);

  //start wifi
  WiFi.begin(ssid, password);
  int wifi_ctr = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  //print when wifi is connected
  Serial.println("WiFi connected");
  Serial.println("IP address: " + WiFi.localIP());
}

// the loop function
void loop() {
  //read the sensor
  sensorValue = digitalRead(sensorPin);
  //print the sensor value
  Serial.println(sensorValue);

  //if the connection is faild with the website
  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed!!");
    return;
  }

  //get the light status
  getNetworkData();

  delay(2000);

  //post the data to the site
  sendNetworkData();
}

//reset all lights
void reset() {
  digitalWrite(redLedPin, LOW);
  digitalWrite(orangeLedPin, LOW);
  digitalWrite(greenLedPin, LOW);
}

//get request to the site
void getNetworkData() {
  client.print(String("GET ") + getPath + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Connection: keep-alive\r\n\r\n");

  delay(500); // wait for server to respond

  // read response
  String section = "header";
  while (client.available()) {

    //get every line form response if connection is open
    String line = client.readStringUntil('\r');

    // parse the json
    if (section == "header") { // headers..
      if (line == "\n") { // skip the enter
        section = "json";
      }
    }
    else if (section == "json") {  // if it's json data
      section = "ignore";
      String result = line.substring(1);

      // Parse JSON
      int size = result.length() + 1;
      char json[size]; // get the json size

      result.toCharArray(json, size);
      StaticJsonBuffer<200> jsonBuffer;
      JsonObject& json_parsed = jsonBuffer.parseObject(json);

      if (!json_parsed.success()) //if its faild to parse
      {
        Serial.println("parseObject() failed");
        return;
      }
      reset(); //reset the pins, if I don' do this all pins wil go on if the status changes

      //turn on the alarm if the alarm is true
      if (strcmp(json_parsed["alarm"], "true") == 0) {
        digitalWrite(soundPin, HIGH);
      }
      //turn off the alarm if the alarm is false
      if (strcmp(json_parsed["alarm"], "false") == 0) {
        digitalWrite(soundPin, LOW);
      }
      //turn red led on if the redLed is true
      if (strcmp(json_parsed["redLed"], "true") == 0) {
        digitalWrite(redLedPin, HIGH);
      }
       //turn orange led on if the orangeLed is true
      if (strcmp(json_parsed["orangeLed"], "true") == 0) {
        digitalWrite(orangeLedPin, HIGH);
      }
       //turn green ornage on if the greenLed is true
      if (strcmp(json_parsed["greenLed"], "true") == 0) {
        digitalWrite(greenLedPin, HIGH);
      }
    }
  }
  Serial.println(" closing connection. ");
}

// post to the server
void sendNetworkData() {

  //post to the server if
  if (client.connect(host, httpPort)) {
    String postStr = "doorStatus=";
    postStr += String(sensorValue);

    //post headers
    client.println("POST /api HTTP/1.1");
    client.println("Host: " + String(host));
    client.println("Content-Type: application/x-www-form-urlencoded");
    client.println("Connection: close");
    client.print("Content-Length: ");
    client.println(postStr.length());
    client.println();
    client.print(postStr);
    client.println();
    Serial.println("Data send");

  }
}
