# Pool Log - Web Portal

Hey :),
diese kleine Webapp habe ich für private Zwecke geschrieben, um die täglichen Messwerte von meinem Pool zu speichern. Die Werte weden dabei mit deinem Google-Konto in einer Firebase Datenbank gespeichert.

Momentan werden folgende Werte unterstützt:
* Datum
* ph-Wert
* Wassertemperatur
* Lufttemperatur
* Notizen - COMING SOON
* Chlor Werte - COMING SOON

Du bist natürlich herzlich eingeladen, dir für private Zwecke eine eigene Version dieser Seite einzurichten. Dazu mehr in dem Abschnitt **Eintrichtung** :)

## Lizenz

Wird noch hinzufügt, somit hast du momentan noch kein Recht meine Quellcode zu verwenden   


## Einrichtung

Zum Einrichten benötigst du nur einen Google-Account, alles andere wird von Firebase geregelt 🔝👍. 

Solltest du die Web-App auf einem privaten Server oder einem Raspberry Pi hosten, kannst du dir die Schritte für die Einrichtung des Firebase CLI und der anschließenden Schritte zum Hochladen der Webseite zur Firebase Hosting Platform sparen. Befolge dann einfach nur die Schritte "Firebase konfigurieren" und "openweathermap.org API einrichten". Den Rest bekommst du dann selbst hin ;)

### 1. Schritt: Firebase CLI - Einrichten

Unter [console.firebase.google.com](https://console.firebase.google.com) richtest du dir ein neues Projekt ein. Welche Daten du dort eingibst und/oder auswählst hat keine Auswirkungen auf den weiteren Verlauf.

Damit du die Webseite bei Firebase hosten kannst, benötigst du noch das Firebasse CLI. Befolge einfach die Schritte in dieser [QuickStart Anleitung](https://firebase.google.com/docs/hosting/quickstart) um alles Notwendige einzurichten. **Nachdem du dich mit ```$ firebase login``` erfolgreich angemeldet hast, fahre hier fort!**

Führe nun folgendes im Terminal aus:
```bash
 mkdir poollog-firebase && cd poollog-firebase && firebase init
 ```

Wähle nun **Database** und **Hosting** mit der *Space*-Taste aus und bestätige mit *Enter*! Danach musst du ein Projekt verknüpfen -> Wähle hierbei dein neu erstelltes Projekt aus.

In den nächsten Schritten bestätigst du ```database.rules.json``` und ```public```mit *Enter* und auf die Frage *Configure as a single-page app?* anwortest du mit **YES** oder **y**!

Folgende Befehle helfen dir nun das Repository einzurichten und alle notwendigen Dateien an die richtige Stelle zu kopieren:
```bash 
rm -rf public && \
rm -f database.rules.json && \
git clone https://github.com/tjarbo/pool-log.git public && \
mv public/database.rules.json database.rules.json
```

### 2. Schritt: Firebase konfigurieren

Auf der [Startseite](https://console.firebase.google.com/project/_/overview) deines Projektes wird dir nun angeboten, Firebase zu deiner iOS-, Android- und Web-App hinzuzufügen. Dich interressiert natürlich letzteres 🛸 -> Klicke dort auf die entsprechende Option "*Firebase zu meiner Web-App hinzufügen*" und kopiere den JavaScript Inhalt in die Vorlage unter ```./static/js/firebase.js```. Ersetze den dortigen Code durch deine Kopie. 

Der Inhalt sollte nun so aussehen:

```JS
// Initialize Firebase
var config = {
  apiKey: "anj324nhji2r3u24n34nc2234bj34",
  authDomain: "projekt-1234.firebaseapp.com",
  databaseURL: "https://projekt-1234.firebaseio.com",
  projectId: "projekt-1234",
  storageBucket: "projekt-1234.appspot.com",
  messagingSenderId: "1234567890"
};

var owm_apikey = << YOUR OPENWEATHERMAP API-KEY - SEE NEXT STEP >>;

firebase.initializeApp(config);
```

**Jetzt bist du fertig mit der Einrichtung von Firebase 🎉🍾**

### 3. Schritt: openweathermap.org API einrichten

Damit das lokale Wetter automatisch geladen werden kann, brauchen wir noch einen API-KEY. Besuche [openweathermap.org](https://openweathermap.org/), erstelle dir dort ein Konto (FREE-PLAN) und unter **API Keys** kopiere dir dort den schon eingerichteten Schlüssel. Natürlich kannst du dir auch einen neuen erstellen.

Wie du dir vermutlich schon vom vorletzten Schritt denken kannst, kopierst du diesen Schlüssel
unter ```/static/js/firebase.js``` nun an die entsprechende Stelle:
```JS
var owm_apikey = "abcdefghijk123456";
```

### 4. Schritt: Authentication und "$ firebase deploy"

Nachdem du alles richtig eingestellt hast, fehlt nur noch die Freischaltung der Anmeldemethode über Google. Besuche dafür die [Seite der Anmeldemethoden](https://console.firebase.google.com/project/_/authentication/providers) und aktiviere dort die Google Anmeldemethode :)

Zu guter Letzt gehe noch einmal ins Terminal und führe folgenden Befehl aus:

```$ firebase deloy```

Nun ist deine WebApp unter der angebenen URL erreichbar ✅


## Entwicklung - Beitragen

Du möchtest eigene Ideen mit in das Projekt einbringen? Dann lese bitte einmal die [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) durch, denn dort erfährst du alles Notwendige über den Ablauf einer Pull Request!

### Versionen

Um eine einheitliche Versionsstruktur zu erhalten, verwende ich [SemVer](http://semver.org/)verwendet. Um die verfügbaren Versionen einzusehen, besuche [Tags des Repositorys](https://github.com/tjarbo/Pool-Log/tags).

### Verwendete Software

* [Bootstrap 4](https://getbootstrap.com)
* [Firebase](https://firebase.google.com)
* [openweathermap.org](https://openweathermap.org/)


## Autoren / Authors

* **Tjark [tjarbo](http://www.github/tjarbo)**

Werfe ebenfalls einen Blick auf die Liste der Mitwirkenden ([contributors](https://github.com/tjarbo/Pool-Log/CONTRIBUTORS.md)), welche ebenfalls mitgeholfen haben!
