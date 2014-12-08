// ************************************************************************
// Emotion in Motion
// Sensor Data Acquisition
// By Javier Jaimovich 2014
// Version: 0.2

// Reads voltage on Analog channel and sends over serial

#define SAMPLING_INTERVAL 10     // 10ms (100Hz) for EDA, 4ms (250Hz) for POX
#define ANALOG_PIN 0            // Analog pin connected to sensor
#define ARDUINO_HEADER 255      // Arduino Header to be identified by Max Patch. EDA=255, POX=254

int analogData;

// ************************************************************************

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
}

void SampleAndSend() {
  analogData = analogRead(ANALOG_PIN); // Read current analog pin value
  Serial.write(analogData >> 7); // shift high bits into output byte
  Serial.write(analogData % 128); // mod by 128 for the small byte
  Serial.write(ARDUINO_HEADER); // end of packet signifier
  delay(SAMPLING_INTERVAL*0.5); // delay to prevent multiple SampleAndSend per interval
}

/* MAX MSP Patch to Work with this Code

----------begin_max5_patcher----------
1979.3oc0bszaaaDD9rCP9OrPnGRacR22jrmpaSCPNz3hTzdInHfRZqLSkHE
HWl3lf9GqG6urtOHkjsjnF5nkR8fEwtjTblONy27XW4O83GcwnwE2ppFg9Vz
aPWbwmLybgaN6LWzNwEiVjd6j4oUtKbzBUUU5L0nKaNoVcq1che74WsZx+nH
WWk8Qk8DD5yvaNed5B27itpLKc9paIudQV9bk18TnsylM0coEie2SSVcoKS0
StIKe1aKUSzdoOl8LwkHAAadVHlv9II9YXzu2dOE0ZyWt9uVp72vnQqOm4Q6
Os6YSby92O9Q1ilCWBFZlTrXgJWuMzbU4z5r7BzKe9QCgHqtgxYisSfW+crA
nQi6B0HDGrwwDKfIireRwaBa2EZvA.Zp0EKR0YSP+hxpsnetnb8kMOKWMonN
WeGihgB6ncgcQFfxfcTovdffYNKu6XyMtd734p67DCNd9ZCdkWoKqmnqLR03
LM52RmWqNSfTRWPJMxaNJbFhII1AmdD84JspznppJzN7i6Gb5k+propst7iH
JS5jpT5XGowNpxH2.Aaf.48F7XMMPkmFvXEa.VMJ+e+GzWPBZfkNoHkRG2Hi
6fKRD8zDZIW8AintMtsrLKWit50O+We4qt93GbYCTJBBJIkNOWZ3Bj3DxcK0
6xUP1kTKhcTLB2qVpn8yGza11oaoQZMpQ+Pig7SFmlO6KGMTJtnKEmQBpde8
q9lqewKPOQWLa1b0mgN6ePvsQYcFcA6LNEwj8o12yFcmuRySmWLCccs4Epwy
6yP21mGsFMFQP3f5KS3xt8lslGwN3hK11WdKyCqo8nKs1n51C6CUYA.vJVpx
QYgEwXc5PIwbG+m6w05X0MlYE5CAVzGNXUuXrpbCQtzn3l7XdqJOsI3NNr3E
FR7hdfWM1VNSs.fW6w3pRMGE1rOHcWhlzmgF06Gxj8vaL.vz3ZstHuGlAzNS
af1TCUzJ0Blxc7yup+Jl.PlEwmb8Z+jlXSTlwgkyjx.fQDbhKNiDNG.DpfGd
bFeVKvnNAfAT.wMnDAXCkthWb7sSLZdYAhgw3.SBhg.SdRvHx4m+jqE.pRSn
riFNI1ENcfR6avoH2gHFbWp1+5x5hG.VHe8qSlqRKCJWTRmTQLFyWcuumHPb
CcBtEw7x9oOTaBEhFxo+eKRaRmLCDeH1y.8Z+13jfZYGGCAeZro4mcAXVVpL
EBMEsby19GDbpyLQ4FlSa2lSbsdNJA.NE.PpdgJu9zUzV75tBjoUKZVXvQe+
7ZktnPeySeY9jBy2wrm5WjFznKser97+TwT0hUyWWMdgcBiyIYCvZWrS7Xe0
MNzmvn8Lv0v0rgVy0zk1Cg0fs6V30.YLWxPIwmFC18ASebNJylNTfabOGBBg
cIMxA4RGlpl2GJUZ91UGWlucBSL.vTSM3R5IDlNw8rJlBo8w9EB5LtkU04KS
m7mnr.2QTQD.zh6KrUR5Ww8CGX80A0yiSffQw7dgQCGK9Wg1r4jAAfvP.Huy
FK4rCfrcGlJDAEhXP7yXB3A4BX6g6HcfYlfcKQzvBURHPUi6F6zEn6n1gQFG
P8e8oC6gwEZV0GxLRG8An067UMEfVyvaPbXKp37I0ugf4fJO7NlzTZ14Lwwv
s8VHw.1do9b+B41awp42qCYq6w77hJfrF16w7U3TN25LGRjasUrsb+6bY6Ze
S5W0GeC6HXLTZ3AeeE3W5CBF8coSzYuWE3hY4.hc0hZDw4WeNa12doHQjDaA
sZcgaiYD3sxB.XqYciH8oLDvjb9qysOPu+No2IQ1SbO7rpntbxp8ARypSfHq
ehSUU5r7Tcl2G9MqaOGZCQ+lroSU42wueQ1zkEFMnQRXINdKZ6Rr1X1r4nlL
GYhHW+OE2YCQMMqxRsL8.bZ8SOwGROI8VMMtEV0jD0tXpsiBnpPgnJ2Wg2gt
bzELLDAytpACsfA5c+vKW2GJ1sfYSy9rTv5s2BIQL3dK1EeI.pBm3pkiSi7M
RIY6QTpbS0zNJfpoDDOdzvaJI.QJHGdAiCRvDCufAJTU7IfU.TfmgOtCHxpg
2xWBh3gN7FX19meXtBaGj27pFJA6fPFGO7HFnWkh9GDwunytFB5CZ3FDtvDb
BHtE5fivbP4NxICufcbRe3XKVLPtJL4oQvHmiBFH9XwvGmfAxDiM79jtG4ge
UFcZDrChXT4Cr9DF2QHm3+cUyCJgLEjUYxfCwvjK2ulq9gwdTkKbGDIaMv+i
NwunQQAskPt30jieQtzDemuvaV8GFGTUgCyLB2Wkw+dfP8agWu6gaTn0ExQH
aqvHYzCmROs21L3ltq6ZpfPFuiQwL+d0v0WU2n.9NfIBSagkb+lc0uYuZa8q
jFdk432BnlWELeV71+Avr0Hp++GLsj.rvxmwf0+0g2ugBqch1egIa5dMHhFL
aCJ6DfZLHrMI8lrQ56KosRSmAqaELbiBnsIkcjZ088TFQhuWqM+SxnoAy7vF
skBZQyfDG33KZTX1ywOP1NJykciLluZTHAZfZC9D.zX3bZCrnQfsdWLw4qng
enAiwN1LYDd0n.ZdBJGoSPjCv8Sfb9IWte29eF.VylhHc4x2qJqZ9t8xznEo
uqnzNVdoebVtere6cLpT89r1aIxOUZ4jaxzpI55R+lD4VI29edE2Cz7w+ArE
rjtF
-----------end_max5_patcher-----------

*/

