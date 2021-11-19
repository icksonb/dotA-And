import VersionInfo from 'react-native-version-info';

async function VersaoApp() {
    let result = false;
    const response = await fetch('https://play.google.com/store/apps/details?id=com.dota');
    await response.text().then(function(response) {
        var version = "";
        var index = response.indexOf('Version');
        if(index == -1)
            index = response.indexOf('Versão');
        if(index == -1) {
            result = false;
            return;
        }
        index = response.indexOf('span', index);
        index = response.indexOf('span', index+4);
        index = response.indexOf('>', index);
        for(var i = index+1; i < index + 20; i++) {
            if(response[i] != '<')
                version += response[i];
            else 
                break;
        }
        
        var versaoLocal = parseFloat(VersionInfo.appVersion);
        version = parseFloat(version);

        if (versaoLocal < version) {
            result = true;
        } 
        
    });
    return result;
}

export default VersaoApp;