// ************************************************************************
// Emotion in Motion
// Sensor Data Acquisition
// By Javier Jaimovich 2014
// Modified by Brennon Bortz 2017
// Version: 0.2.1

// Reads voltage on Analog channel and sends over serial

#define SAMPLING_INTERVAL 4     // 10ms (100Hz) for EDA, 4ms (250Hz) for POX
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
  if (ARDUINO_HEADER == 254) {
    analogData = analogRead(2); // Read current analog pin value
    Serial.write(analogData >> 7); // shift high bits into output byte
    Serial.write(analogData % 128); // mod by 128 for the small byte
  }
  Serial.write(ARDUINO_HEADER); // end of packet signifier
  delay(SAMPLING_INTERVAL*0.5); // delay to prevent multiple SampleAndSend per interval
}

/* MAX MSP Patch to Work with this Code

----------begin_max5_patcher----------
1971.3oc0b0riaaCD97Ff7NPXzCosaS4+RpnnnK51.jKYKRQ6kfh.YaVGkZK
YHQkrIA8EqG6SVEIkr8t1VdzFQI2C1BjRxZlONy2LbHs9ziezESllcqpXB56
PuBcwEeppmKr8Y54hlNtXxp3amsLtvdgSVoJJhWnlbY8I0pa01S7yWe0lN+y
rTcQxGUlSPnOEua+owqr8O4p7j3katkzxUIoKUZ6Sg1zaxb6klM8seSzlKcc
rd1aRRW75b0LsS5CYOUbIRPvUOKDSX9lD9TL5OZtmrRc0Ot9CqUtaXxjsmq5
Q6Ns8YSr892O9QliUGtDLzLKa0JUpden4p74kIoYnmecugPjM2P9holNva+M
1AzngsgZDhE13XhAvjAluo3cgs6BMXO.Mk5rUw5jYneUYzVzujku8xVljplk
UlpuiQwPgcz1vtfJfpB6nRg4.AyrVd2wlaZ4zoKU24I5c77kU3UZgNubltnR
pllnQ+d7xR0YBjRZCRoANyQg0PLJxzX7QzqUZUdkppJPGvOtavoS9KRlq16x
6QTlzJUozxNRCsTkA1FB1.AxGM3wVZfBGMPkUbEvpQo+6+f9BhWCrzJEoTZ4
FYbKbQBniSnkT06qD08ws04IoZzUu75e64u3l9O3xNnT.DTRJsdtT+EHwJjG
VpOjqfrMoVDZoXD1gVpn46GzHaS2MzHMF0nep1P9ISiSW7kSFJEWzlhyHdUu
u4Ee6MO6YnmnyVrXo5yPmcOH31nrVitfsFmhPxwT66Yidvgzz3kYKP2TVMfV
448YnaGyiVilhHHrW8kIbY6dyFyiPKbwE66Kum4gwzdxkFaTcygigpLO.XYq
UonD+hXrVcnjXtk+y93ZbrZGyLB8o.K5CGrJWMUkuiHmWo3U4w7ZUZbcvcre
wKLj3Ec.upssrlZd.uNhwUgZIxuYePZeJZRWFZTmeHS1AuQO.SSK05rzNXFP
aMsAZ8bnB1nVvTt9O+ptqXB.YVDN550wIMwUQYl5WNSJC.FQvQ13LR3b.PnB
d3wYbYs.i5D.FPAD2fRDfMTZKdQ+amTo44YHFFi8LIHFBL4HACHme9S1R.nx
Qz9CmDGBmNwT6qwo.6g.FbWplOsYcw8.Kja9qyVphy8JWTTqTQLFyM6dWMQf
3FZEbCh4j8wOTaDEhFxo+eKRaTqLCDWH1y.85313DuZYGFBAepso4mcAXVmq
plHzbz5cK6uWvoVyDkWwbZp1bjszyAQ.vIO.RkqToki2j1B2VUfDsZkSl9d0
p05O7CsRtvCcSNwBdDFsiwcFtZEzXsEu1bvu1aBHPFylKST33XucLX5iKQIl
rY7bc24PPHrMmONHOR+Lo2igR4U+5p9k35fvDC.LUOEZIcDgoQtjSgTHU+0s
NNmwUbpLcc7r+Bk34BZJB.fVb27RkjtM27gCr9Zu54wIPvnPdmvngiE+qP6V
aQu.PXH.jyYiEc1APlh6REBuBQLH9YLA7fbdr5tsjNvhpfcqQT+BURHPUs6F
a7Bz0qEHjwAL8stTfb+3Bsn38IURG8An0GbnlBPqY3cHNLSp37I0ugf4fJO8
FdjSImyDGC2tSgDBX2g5x8ym6NEileuBbssDwKyJ.xZXtmpeBqxYWlXehbas
hWkM+ta6qCssGcKZiqdaDLFJM7fus.bqbAAi9w3Y5j2o77jY4.hc0fZDw4WY
Jq21cwHQfDa.sRclceU34chB.XqdYeHcYZHfI4bWmcabd+MBuUhLm3d3YQVY
9rMaii5EW.Q19DmqJzIow5DmO7q1VcMzNh9aRlOWkdG+9UIyWmUoA0RBKxxa
QaVgzZylcaUm4HSDXKeo3N6mo4IEFpk4mfSqa5I9T5IoypYkagQMIAMqEZSK
OpJTHpx8U3CnK8tfggHXlh9OzBFnw9gWttOTbXAyjl8Yof0YuERjXv8VLqch
GTENwNWNNMvUHkn8aQoxcUSSKOplRP73ACuoj.Dofb3ELNHASL7BFnPUgi.q
.n.OCebGPjUCukuDDwCc3MvL0O+zbElJHu6UMTB1IgLNd3QLPCkhtGDwsny1
BB5BZXa3uvDbBHtE5fivbP4NxICuf0OoOz2hECjqBSNNBF4bTv.wGKF93DLP
lXrg2mz9HO8PYv3HXmDwnxG37SXbKgbj6uEM2qDxTPVkQCNDCStr+Yr5FF6P
UtvdPDsWC2+YD2hFE30RBYiWS5+I4RibU9Bu6r+vXupJbXlQ3tpLtwAB0sCb
ctG1V9VWH8P1V9QxnmNkdZmsYv0UW2VTAgL7.sBYt8pgstp1VdbLfI7SYgkb
2dU0sYuZJ8qj5eko+KAT8PAykEu482xdsntWmKMj.L+xmwfU+0g2ugBqbhl+
fH65dMHhFLaCJaDPMFD1lnNS1Hc0kzLSSqAqcELrs7nsIk0Sk59dJiHxUq05
2wE0EXl62nsTPKZFj3.8unQgYOG9.Y6nLa1MxP9lV9DnApM3Q.nwv4zFXQy9
LYdf3P5BW6deQETETiteSBKvMsoZZEut3N6AuGYTfIFoQA.hF9gl2ANz5IFf
2zxi.MnzAGgfjfKcB47StrugA9L.r58+Q750uSkWT+a6joIqheaVtos7RW6j
TWa2NYYRt5cIM2Rfqq37YuIQqloKyc6Glakby6HF6Cr5q+C.x7Ebc
-----------end_max5_patcher-----------

*/

