#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

const char* ssid     = "SennyK";
const char* password = "27031990!";

const char* host        = "iot.dolstra.me";
String getPath          = "/api/status/leds";
String postPath         = "/api";
const int httpPort      = 80;

//leds
const int redLedPin     = D0;
const int greenLedPin   = D1;
const int orangeLedPin  = D2;

//senors and sound
const int soundPin      = D3;
const int sensorPin     = D4;

int sensorValue         = 0;

WiFiClient client;

void setup() {
  //set pins sensors
  pinMode(sensorPin, INPUT);

  //setpint leds
  pinMode(redLedPin, OUTPUT);
  pinMode(greenLedPin, OUTPUT);
  pinMode(orangeLedPin, OUTPUT);
  //sound pin
  pinMode(soundPin, OUTPUT);

  //set greenlight on for test
  digitalWrite(greenLedPin, HIGH);

  //set serial
  Serial.begin(9600);

  //set up wifi
  delay(10);
  Serial.print("Connecting to ");
  Serial.println(ssid);

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

void loop() {
  sensorValue = digitalRead(sensorPin);

  if (!client.connect(host, httpPort)) { //print if connection is failed
    Serial.println("connection failed");
    return;
  }

  getNetworkData();

  delay(2000);

  sendNetworkData();

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
    Serial.print(line);
    if (section == "header") {
      Serial.print(".");
      if (line == "\n") {
        section = "json";
      }
    }
    else if (section == "json") { // if it' json
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
      if(strcmp(json_parsed["alarm"], "true") == 0){
         digitalWrite(soundPin, HIGH);
      }

      // Make the decision to turn off or on the LED
      if (strcmp(json_parsed["status"], "open") == 0) {
        digitalWrite(greenLedPin, HIGH);

      }
      else if (strcmp(json_parsed["status"], "longopen") == 0) {
        digitalWrite(orangeLedPin, HIGH);
      }
      else if (strcmp(json_parsed["status"], "warning") == 0) {
        digitalWrite(redLedPin, HIGH);
      }
      else {
        digitalWrite(greenLedPin, LOW);
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

