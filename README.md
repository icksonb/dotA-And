# dotA-config

## Instalando as dependências
- Inicialmente instale o react-native (versão 0.63.4 ou superior) e o yarn;
- Clone este repositório;
- Na pasta raiz deste projeto execute o comando abaixo e aguarde o processo ser finalizado:
```
yarn
```

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

## Criado o apk
- Abra um terminal (na raiz deste projeto) e execute:
```
cd ./android
./gradlew clean
./gradlew assembleRelease
```
- Ao final, o apk será gerado em android/app/build/outputs/apk/release/app-release.apk.

OBS1.: No windows, você deve executar com gradle.bat no lugar de gradlew.
OBS2.: Para gerar um apk a ser enviado para Play Store, siga o seguinte link: https://tableless.com.br/react-native-build-release-android/