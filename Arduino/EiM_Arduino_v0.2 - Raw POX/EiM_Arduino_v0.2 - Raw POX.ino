// ************************************************************************

#define SAMPLING_INTERVAL 10     // 10ms (100Hz) for EDA, 4ms (250Hz) for POX
#define ANALOG_PIN 0            // Analog pin connected to sensor
#define ARDUINO_HEADER 254      // Arduino Header to be identified by Max Patch. EDA=255, POX=254

int analogData;

void setup() {
  Serial.begin(57600);
}


void loop() { 
  long periodCheck = millis()%SAMPLING_INTERVAL;
  if (periodCheck == 0)
  {
    SampleAndSend();
//    Serial.println(millis()); // report time elapsed between SampleAndSend
  }
//  Serial.write(millis()); <-- This one
}

// I'm not certain this is the most recent version from Javier. In fact, it must not be.
// The line up above was sending data we weren't expecting.

void SampleAndSend() {
  analogData = analogRead(ANALOG_PIN); // Read current analog pin value
  Serial.write(analogData >> 7); // shift high bits into output byte
  Serial.write(analogData % 128); // mod by 128 for the small byte

  if (ARDUINO_HEADER == 254) {
    int rawPoxData = analogRead(2);
    Serial.write(rawPoxData >> 7);
    Serial.write(rawPoxData % 128);
  }
  
  Serial.write(ARDUINO_HEADER); // end of packet signifier
  delay(SAMPLING_INTERVAL*0.5); // delay to prevent multiple SampleAndSend per interval
}
