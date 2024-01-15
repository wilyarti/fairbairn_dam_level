#include <ESP8266WiFi.h>          //ESP8266 Core WiFi Library (you most likely already have this in your sketch)
#include <DNSServer.h>            //Local DNS Server used for redirecting all requests to the configuration portal
#include <ESP8266WebServer.h>     //Local WebServer used to serve the configuration portal
#include <WiFiManager.h>          //https://github.com/tzapu/WiFiManager WiFi Configuration Magic
#include <MD_MAX72xx.h>           //https://github.com/MajicDesigns/MD_MAX72XX
#include <ArduinoJson.h>
#include <ESP8266HTTPClient.h>

#define MAX_DEVICES 4
#define CLK_PIN   D5  // or SCK
#define DATA_PIN  D7  // or MOSI
#define CS_PIN    D8  // or SS
#define HARDWARE_TYPE MD_MAX72XX::FC16_HW

/*
   CLK D5
   DOUT D7
   CS D8
   GND
   3V VCC
*/
MD_MAX72XX mx = MD_MAX72XX(HARDWARE_TYPE, CS_PIN, MAX_DEVICES);
WiFiUDP UDP;                     // Create an instance of the WiFiUDP class to send and receive
WiFiManager wifiManager;

IPAddress timeServerIP;          // time.nist.gov NTP server address
const char* NTPServerName = "0.au.pool.ntp.org";


void setup() {
  mx.begin();
  Serial.begin(115200);          // Start the Serial communication to send messages to the computer
  delay(10);
  Serial.println("\r\n");

  wifiManager.autoConnect();

  if (!WiFi.hostByName(NTPServerName, timeServerIP)) { // Get the IP address of the NTP server
    Serial.println("DNS lookup failed. Rebooting.");
    Serial.flush();
    ESP.reset();
  }
}

unsigned long intervalNTP = 30000; // Request NTP time every minute
unsigned long prevNTP = 0;
unsigned long lastNTPResponse = millis();
uint32_t timeUNIX = 0;

unsigned long prevActualTime = 0;

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - prevNTP > intervalNTP) { // If a minute has passed since last NTP request
    prevNTP = currentMillis;
    Serial.println("\r\nUpdating stuff ...");
        WiFiClient client; // Declare a WiFiClient object
    HTTPClient http;

    // Send request
    
    http.begin(client,"http://dingbat.app:3000/percentage");
    http.GET();

    // Print the response
    //Serial.println(http.getString());
    String percentage = http.getString();
    Serial.println(percentage);

    // Length (with one extra character for the null terminator)
    int str_len = percentage.length() + 1;

    // Prepare the character array (the buffer)
    char char_array[str_len];

    // Copy it over
    percentage.toCharArray(char_array, str_len);
    if (str_len >= 4) {
      mx.clear();
      for (int i = 0; i < 2; i++) {
        Serial.println(char_array[i]);
        mx.setChar((COL_SIZE * (4 - i)) - (2 - i), char_array[i]);

      }
      for (int i = 2; i < 4; i++) {
        Serial.println(char_array[i]);
        mx.setChar((COL_SIZE * (4 - i)) - 3, char_array[i]);

      }
      char *d = ".";
      mx.setChar((COL_SIZE * 2) , *d);
      mx.update();
    }
    // Disconnect
    http.end();
  }
  //spiral();

}

void spiral()
// setPoint() used to draw a spiral across the whole display
{
  int  rmin = 0, rmax = ROW_SIZE - 1;
  int  cmin = 0, cmax = (COL_SIZE * MAX_DEVICES) - 1;

  mx.clear();
  while ((rmax > rmin) && (cmax > cmin))
  {
    // do row
    for (int i = cmin; i <= cmax; i++)
    {
      mx.setPoint(rmin, i, true);
      delay(100 / MAX_DEVICES);
    }
    rmin++;

    // do column
    for (uint8_t i = rmin; i <= rmax; i++)
    {
      mx.setPoint(i, cmax, true);
      delay(100 / MAX_DEVICES);
    }
    cmax--;

    // do row
    for (int i = cmax; i >= cmin; i--)
    {
      mx.setPoint(rmax, i, true);
      delay(100 / MAX_DEVICES);
    }
    rmax--;

    // do column
    for (uint8_t i = rmax; i >= rmin; i--)
    {
      mx.setPoint(i, cmin, true);
      delay(100 / MAX_DEVICES);
    }
    cmin++;
  }
}
void cross()
// Combination of setRow() and setColumn() with user controlled
// display updates to ensure concurrent changes.
{
  mx.clear();
  mx.control(MD_MAX72XX::UPDATE, MD_MAX72XX::OFF);

  // diagonally down the display R to L
  for (uint8_t i = 0; i < ROW_SIZE; i++)
  {
    for (uint8_t j = 0; j < MAX_DEVICES; j++)
    {
      mx.setColumn(j, i, 0xff);
      mx.setRow(j, i, 0xff);
    }
    mx.update();
    delay(100);
    for (uint8_t j = 0; j < MAX_DEVICES; j++)
    {
      mx.setColumn(j, i, 0x00);
      mx.setRow(j, i, 0x00);
    }
  }

  // moving up the display on the R
  for (int8_t i = ROW_SIZE - 1; i >= 0; i--)
  {
    for (uint8_t j = 0; j < MAX_DEVICES; j++)
    {
      mx.setColumn(j, i, 0xff);
      mx.setRow(j, ROW_SIZE - 1, 0xff);
    }
    mx.update();
    delay(100);
    for (uint8_t j = 0; j < MAX_DEVICES; j++)
    {
      mx.setColumn(j, i, 0x00);
      mx.setRow(j, ROW_SIZE - 1, 0x00);
    }
  }

  // diagonally up the display L to R
  for (uint8_t i = 0; i < ROW_SIZE; i++)
  {
    for (uint8_t j = 0; j < MAX_DEVICES; j++)
    {
      mx.setColumn(j, i, 0xff);
      mx.setRow(j, ROW_SIZE - 1 - i, 0xff);
    }
    mx.update();
    delay(100);
    for (uint8_t j = 0; j < MAX_DEVICES; j++)
    {
      mx.setColumn(j, i, 0x00);
      mx.setRow(j, ROW_SIZE - 1 - i, 0x00);
    }
  }
  mx.control(MD_MAX72XX::UPDATE, MD_MAX72XX::ON);
}
