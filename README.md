# dotA-And

Aplicativo para Android para configuração de dispositivo ESP32 através do bluetooth desenvolvido por React Native.

Deve-se seguir os seguintes passos para a criação do projeto, instalação das dependência e testes do projeto.

OBS.: antes de iniciar o projeto é necessário a instalação do React Native, bem como as bibliotecas e softwares necessário para compilação para Android.

### 1 - CRIANDO O PROJETO

Para criar o projeto, deve-se entrar no diretório desejado e executar:
```
npx react-native init dota
```
Após o projeto ser criado, coloque os arquivos deste repositório no diretório **dota** criado (exceto os diretórios **ESP32** e **Releases**).

### 2 - INSTALANDO DEPENDÊNCIAS
Será necessário instalar diversas dependências, utilizando os comandos abaixo (os comandos devem ser utilizandos no diretório **dota** que foi criado anteriomente).
```
npm install galio-framework
npm install react-native-restart
npm install react-native-bluetooth-serial-next
react-native link react-native-bluetooth-serial-next
npm install convert-string
npm install react-navigation
npm install react-navigation-stack
npm install react-native-vector-icons
npm install react-native-gesture-handler
npm install @react-native-community/masked-view
npm install react-native-screens
npm install react-native-wifi-reborn
react-native link react-native-wifi-reborn
```

Deve-se, então, alterar o arquivo build.gradle localizado em dota/node_modules/react-native-bluetooth-serial-next/android, alterando as seguintes configurações:

```
...
android {

	compileSdkVersion 29	

	defaultConfig {
		minSdkVersion 18
        targetSdkVersion 29
        ...
	}
}
...
```

### 3 - CRIANDO VERSÃO PARA ANDROID
Para criar a release para Android, inicialmente se abrir e alterar o arquivo build.gradle localizado em dota/android:
```
minSdkVersion = 21
```

Deve-se, também, criar o arquivo **local.properties** no diretório android, que deverá conter os caminhos do sdk e ndk do Android. Como exemplo, ficaria:
```
ndk.dir=/usr/lib/android-sdk/ndk-bundle
sdk.dir=/usr/lib/android-sdk
```

Para compilar, deve-se utilizar os seguintes comandos (considerando o diretório atual sendo o **dota**):
```
cd android
./gradlew assembleRelease
```

O arquivo final foi criado em *dota/android/app/build/outputs/apk/release/*
