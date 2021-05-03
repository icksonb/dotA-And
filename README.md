# dotA-config

## Instalando as dependências
- Inicialmente instale o react-native (versão 0.63.4 ou superior) e o yarn;
- Clone este repositório;
- Na pasta raiz deste projeto execute o comando abaixo e aguarde o processo ser finalizado:
```
yarn
```
- Edite o arquivo ./android/local.properties para indicar o local do SDK do Android.

## Executando em modo de depuração
- Abra um terminal (na raiz deste projeto) e execute:
```
yarn start
```
- Conecte o smartphone com o modo de desenvolvedor ativado;
- Abra outro terminal (também na raiz deste projeto) e execute:
```
yarn android
```

## Criando o apk
- Abra um terminal (na raiz deste projeto) e execute:
```
cd ./android
./gradlew clean
./gradlew assembleRelease
```
- Ao final, o apk será gerado em android/app/build/outputs/apk/release/app-release.apk.

## Compilando
- Gere inicialmente uma chave de assinatura privada usando a ferramenta keytool, com o comando abaixo (caso você possua uma chave privada, pule este passo). Você pode mudar o alias por um outro texto.
```
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```
- Coloque a chave no diretório android/app com o nome de my-release-key.keystore;
- Edite o arquivo android/gradle.properties com as suas informações nos seguintes campos:
```
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=**
MYAPP_RELEASE_KEY_PASSWORD=*****
```
- Para compilar, entre no diretório android e execute o comando:
```
./gradlew assembleRelease
```
- Após isso, será gerados os arquivos .apk em android/app/build/outputs/apk/release/.

OBS.: No windows, você deve executar com gradle.bat no lugar de gradlew.
