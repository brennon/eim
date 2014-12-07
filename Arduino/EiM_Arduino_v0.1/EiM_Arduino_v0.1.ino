// ************************************************************************
// Emotion in Motion
// Sensor Data Acquisition
// By Javier Jaimovich 2014
// Version: 0.1

// Reads voltage on Analog channel and sends over serial

#define SAMPLING_INTERVAL 10     // 10ms (100Hz) for EDA, 4ms (250Hz) for POX
#define ANALOG_PIN 0            // Analog pin connected to sensor
#define ARDUINO_ID "EDA"        // Arduino ID to be identified by Max Patch. Must be 3 letters long (e.g. EDA, POX)

int analogData;

// ************************************************************************

void setup() {
  Serial.begin(57600);
  handShake();
}

void handShake() {
  while (Serial.available() <= 0) { //Loop until serial received
    Serial.print("$"); //packet signifier
    Serial.print(ARDUINO_ID);   // send Arduino ID
    delay(300);
  }
}

void loop() { 
  long periodCheck = millis()%SAMPLING_INTERVAL;
  if (periodCheck == 0)
  {
    SampleAndSend();
//    Serial.println(millis()); // report time elapsed between SampleAndSend
  }
}

void SampleAndSend() {
  analogData = analogRead(ANALOG_PIN); // Read current analog pin value
  Serial.write(analogData >> 7); // shift high bits into output byte
  Serial.write(analogData % 128); // mod by 128 for the small byte
  Serial.write(255); // end of packet signifier
  delay(SAMPLING_INTERVAL*0.5); // delay to prevent multiple SampleAndSend per interval
}

/* MAX MSP Patch to Work with this Code

----------begin_max5_patcher----------
2055.3oc2bssaaaCF95jmBBiNfcHMiG0gc05VVA5EqYnCa2TLTHay5nNaICI
p1rVzWrc4dxl3A43lXSQoHwnVTTaPF4v++O9e7iz4Cmdxr44WyKmA9AvKAmb
xGN8jSTSIm3Dy3SlsI45EqSJUO1rE4a1vyDyNS+yD7qEp4eRwxpzrbvytn4G
kUsIMaMWn9bHyjaSDKtJMa0qJ3KD50EgHmyNCPComCOCDDJeECOGB9KymIco
ZExm+lGiiZ9s+57LQVxFtYwSSVu25lWIZVX3dOeY56UOOBe9toKVMW8XmCkS
7wSOU9xY2WvnRjuIQjt.76bonA9s7hcO05zL9h7pL0ih6HXEViL0fENfIeCA
IRzhDdDzB2WzZd074q46KKdE+dQM.kUJJpVHJqUx4oBvelrthOHPHNTauwTV
ZwwxAGEAQelhfWvE7hZ7fWBtqm48B9ps7jNnQP4agpAL7gQOT78C8JSWx2WD
8DltgWVlrhawqtT6UWajVCjBP1+8ufGgNXbuFQWqih+YKWihylsCvNDFGfT9
0TEHiBwp2hNLJ24PhGC75ATkweWsHbGjZaQZl.7jWbwe7rmeYWyGzn7AAJ+S
rs7AgCU5fdn6Jk4fJGrWa5rHUnHlZOGyZd8Ppcf8M1lfBMFsfe1Xn90ySxV8
Myl.JKA4ptxbWWu74e+kO8ofuVjuZ0ZduzS8JzUSVLTYqxhPsqOD6FlexdWV
x57UfKqp24pcn5kBcDOTAXN.AfVUz6riJsdlclzXPz7l8nXx83HEzPY1biQz
ft5HSF8fXBP9VdFHsaXj7y3D3.Uk6RTYsZbDNF7PXcEdvCH7TsYNunanfwBQ
Yv3RhN2PAX6nv1jh54qq84U7rDSwBvQGgNrATIeMniUEz3gYGzzUcg09Tj.q
fV26XZ.Al4UBQdVOBxXS8wlVfB2o31T+vij9XpnMlr9QNoLrgSYNZPOXcdg4
8xa2UmdiJifwpLCsX+Rd.yLnKjn6fgCA9wHlK633tGXa.sFpWvhb.ABg8HLl
KffNDVHxNH.mdc3nZelWTmx5fHCqEWkl+6pwhlarPhUbp6saS8PQT5dAWrlm
zwZHTePIHo+rV6lfPzMJqIkvpOUL4KsDhMZOE2dDkX7DOeHRmIzMkA5g7gng
M7ei9YLRo1zunII0N75NbVB1tGi1tgLVgEZcfNIOrwJRYCisBKgOfvRUc24U
MqRpfuwb5Iy9o0UbQdt3pG+rr5l3qUuGqY8GL6L4K27y+07k7M6lupb9F4D0
V7nafnNU3UqcLPnQ5VETnKhXkSsnfgrMKh2rHS1Jea.sIaPMhp7j3HqfFa54
p990fTYMJckYZWslfph2n18UoOjLWbXbond03GO.18FXLclFX2Ki7EJkNMbg
pO6B6T5Dg+7hQmprsIK9aPZWIEzQBSMPGU2ZXf0thXgSOGquqa9StBGQz1gC
JZ5E+8aA6w91vBIZ2Jh0PuzIXayRJQwL1HPJpAYHLGRJQlf9N0IqWUmXZK.O
vIkZ.FiWjUJDHAOf.yXP1loaKm3JlP8CWaqJeWZsfNz6yFUk.2Kz.4HWLCRO
nUDOfzJJkdvubwSFvh0izWpmXR6DJhClfAFUrc8ZvWUJ+2AwEx8AWzUiEa+x
0MA6gIUjmzMznsPBZ.oIOg0Ce.SmlYPezHj+z.K5rD1OSQLYBm9jLvgUM9Ol
Rxsl8DO8fk60EwRq5lF4reOrPQOfWDKo19obQeywzrNurikT35QyDpODSMO0
Hn8ywi4CJ01S4qgB0ZqtLJFHKWeYJG7iGDAA+XxBQ5a4851N3PsqMfLx5kHZ
RFrVcOQS.rv.nDlpD4pKUDrW7G3BVYNRUj81kQiPnJ05ntaw25KTfRXky+o.
XYdUwhcWaJyIyAP6D2k7RQZVhHUaL+xaXmFbiNcU5xk7r88U1jtbadMfYDBR
rJJFt4xFXLg1ejoV.BKbWkA2HDokRmQExcXCiNocvVzNTGUtZGCoxgBatRAM
iFCE.6fBbKs7tZv.JOPGjG4Qn4I44VK0gkGYSlSI4oiFbnXl+L3jmy2Pq.Tj
p.WJNTSsX7cGgwA6qbxQigxE3RvtP+YsvbwaJvexC0E4g4O4wkv2Qdz61knw
9KXrKwZ7mwbfKANv9y3QdXMs5rKOBi8dnQWdZCfnP+gOtrew5Zjd8ccP0xtN
xtZvHDKmhbI1.1avI0kJinH+IOCPd7gSZHtX7SB7q7flPxiKQOY9KXNwEyGh
+7tTKUq6Wg9UdZCevzdUnOgpBepOUE0fQH7I1oz09qQN2jGZGIhPigLrJsDK
9NCzeodzGTY33PAA1k7rX+EoA6hmM1eEwhcoFereEGzzQbbAb7WM0p5AQCL8
F3XMYgv8Y..BGEuwaGA4HDpA6lJnCffv5uR.5n3pQilFftuEtOzBDt0N+vcz
r.ZN+AE2QrfnCLJhnujZJ1lUiFC.mvFAJxCn56du9Bq1PCd.dDUgAlUOCrSz
87wPv6NBSX66SSXij14Doz9yg.6DIvxu4X641LtRjS6+dLqudsZKnQbGiYDn
YQVR4fxVTcPMpQigYmSUtP5XO.rXMe3l+JzXn9mNRYCcpZm1CcOjRD1IK0nd
EqBSTkZDDQ2MZTPU2zAnGQUnyQj7jDcq05HRDgM4jHX+xRBUwhBBg6FMFVdt
TnhGCx6JGRnIi3n9aWQufG8MwHY612xKJM+RUhxrMIuIuPNL3L0vzL8P0MOY
VA+soMOejZljhEWkJ3KDUE5qHx00EWdpbc93o+Ov5UAKW
-----------end_max5_patcher-----------

*/

