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

const int redLedPin     = D0;
const int greenLedPin   = D1;
const int orangeLedPin  = D2;

const int soundPin      = D3;
const int sensorPin     = D4;

int sensorValue         = 0;

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

  delay(10);
  Serial.print("Connecting to ");
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

// the loop function runs over and over again forever
void loop() {
  sensorValue = digitalRead(sensorPin);
  Serial.print(sensorValue);

  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed!!");
    return;
  }


  getNetworkData();

  delay(2000);

  sendNetworkData();
}

void reset(){
    digitalWrite(redLedPin, LOW);
    digitalWrite(orangeLedPin, LOW);
    digitalWrite(greenLedPin, LOW);
}

void getNetworkData() {
  client.print(String("GET ") + getPath + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Connection: keep-alive\r\n\r\n");

  delay(500); // wait for server to respond

  // read response
  String section = "header";
  while (client.available()) {
    String line = client.readStringUntil('\r');
    //    Serial.print(line);
    // we’ll parse the HTML body here
    if (section == "header") { // headers..
      //Serial.print(".");
      if (line == "\n") { // skips the empty space at the beginning
        section = "json";
      }
    }
    else if (section == "json") {  // if it' json
      section = "ignore";
      String result = line.substring(1);
      // Parse JSON
      int size = result.length() + 1;
      char json[size];

      result.toCharArray(json, size);
      StaticJsonBuffer<200> jsonBuffer;
      JsonObject& json_parsed = jsonBuffer.parseObject(json);

      if (!json_parsed.success()) //if its faild to parse
      {
        Serial.println("parseObject() failed");
        return;
      }

      if (strcmp(json_parsed["alarm"], "true") == 0) {
        digitalWrite(soundPin, HIGH);
      }
       if (strcmp(json_parsed["alarm"], "false") == 0) {
        digitalWrite(soundPin, LOW);
      }

      // Make the decision to turn off or on the LED
      if (strcmp(json_parsed["redLed"], "true") == 0) {
        reset();
        digitalWrite(redLedPin, HIGH);

      }
      if (strcmp(json_parsed["orangeLed"], "true") == 0) {
        reset();
        digitalWrite(orangeLedPin, HIGH);

      }
      if (strcmp(json_parsed["greenLed"], "true") == 0) {
        reset();
        digitalWrite(greenLedPin, HIGH);

      }

    }
  }
  Serial.println("closing connection. ");
}

void sendNetworkData() {

  if (client.connect(host, httpPort)) {
    String postStr = "doorStatus=";
    postStr += String(sensorValue);

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
