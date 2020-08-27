#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
 
#include <iostream>
#include <string>
#include <string>

BLECharacteristic *pCharacteristic;
 
bool deviceConnected = false;
const int LED = 2; // Could be different depending on the dev board. I used the DOIT ESP32 dev board.
 
 
int humidity;
int temperature;
 
// Veja o link seguinte se quiser gerar seus próprios UUIDs:
// https://www.uuidgenerator.net/
 
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID_RX "beb5483e-36e1-4688-b7f5-ea07361b26a8"
 
 
class MyServerCallbacks: public BLEServerCallbacks 
{
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
    };
 
    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
    }
};
 
class MyCallbacks: public BLECharacteristicCallbacks 
{

   int indexof(std::string& text, std::string& pattern)
   {
      // where appears the pattern in the text?
      std::string::size_type loc = text.find(pattern, 0);
      if(loc != std::string::npos)
      {
          return loc;
      }
      else
      {
          return -1;
      }
   }

    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string rxValue = pCharacteristic->getValue();
      Serial.println(rxValue[0]);
 
      if (rxValue.length() > 0) {
        Serial.println("*********");
        Serial.print("Received Value: ");
        
        for (int i = 0; i < rxValue.length(); i++) {
          Serial.print(rxValue[i]);
        }
        Serial.println();
        Serial.println("*********");

        std::string SSID = "{dotA:D:S";
        std::string pass = "{dotA:D:P";
        
        if(rxValue.compare("{dotA:G:I}") == 0)
          pCharacteristic->setValue("{0001}");
        else if(rxValue.compare("{dotA:G:L}") == 0)
          pCharacteristic->setValue("{0003}");
        else if(indexof(rxValue, SSID) != -1)
          pCharacteristic->setValue(rxValue);
        else if(indexof(rxValue, pass) != -1)
          pCharacteristic->setValue(rxValue);
        else if(rxValue.compare("{dotA:G:S}") == 0)
          pCharacteristic->setValue("{sal}");
        else if(rxValue.compare("{dotA:G:P}") == 0)
          pCharacteristic->setValue("{teste}");
        else if(rxValue.compare("{dotA:V:T:0}") == 0)
          pCharacteristic->setValue("{50.1}");
        else if(rxValue.compare("{dotA:V:T:1}") == 0)
          pCharacteristic->setValue("{0.12}");
        else if(rxValue.compare("{dotA:V:T:2}") == 0)
          pCharacteristic->setValue("{10.3}");
        else if(rxValue.compare("{dotA:V:T:3}") == 0)
          pCharacteristic->setValue("{59.39}");
        else if(rxValue.compare("{dotA:V:V:0}") == 0)
          pCharacteristic->setValue("{140.23}");
        else if(rxValue.compare("{dotA:V:D:0}") == 0)
          pCharacteristic->setValue("{1}");
        else if(rxValue.compare("{dotA:V:D:1}") == 0)
          pCharacteristic->setValue("{0}");
        else if(rxValue.compare("{dotA:V:D:2}") == 0)
          pCharacteristic->setValue("{0}");
        else if(rxValue.compare("{dotA:V:D:3}") == 0)
          pCharacteristic->setValue("{1}");
        else if(rxValue.compare("{dotA:V:P:0}") == 0)
          pCharacteristic->setValue("{1}");
        else
          pCharacteristic->setValue("{0}");

      }
 
    }
};
 
void setup() {
  Serial.begin(115200);
 
  pinMode(LED, OUTPUT);
 
  // Create the BLE Device
  BLEDevice::init("ESP32"); // Give it a name
 
  // Configura o dispositivo como Servidor BLE
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());
 
  // Cria o servico UART
  BLEService *pService = pServer->createService(SERVICE_UUID);
 
                       
  //pCharacteristic->addDescriptor(new BLE2902());
 
  // cria uma característica BLE para recebimento dos dados
  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID_RX,
                                         BLECharacteristic::PROPERTY_WRITE |
                                        //BLECharacteristic::PROPERTY_NOTIFY |
                                         BLECharacteristic::PROPERTY_READ
                                       );
 
  pCharacteristic->setCallbacks(new MyCallbacks());
 
  // Inicia o serviço
  pService->start();
 
  // Inicia a descoberta do ESP32
  pServer->getAdvertising()->start();
  Serial.println("Esperando um cliente se conectar...");
}
 
void loop() {
  /*if (deviceConnected) 
  {
 
     
    pCharacteristic->setValue(dhtDataString);
     
    pCharacteristic->notify(); // Envia o valor para o aplicativo!
    Serial.print("*** Dado enviado: ");
    Serial.print(dhtDataString);
    Serial.println(" ***");
  }*/
  delay(1000);
}