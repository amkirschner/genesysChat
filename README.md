# GenesysChat

This repo contains files for the Gensys Web Chat App. This chat App helps to communicate between the web application and the Genesys software that are being used by help desk to help troubleshoot.

###Developers:

  API: Mike Bautista<br />
  Web App: Sahaj Bajracharya<br />
  Genesys Services(IS): John Seeman

## Getting Started

The application is built in Angular2, Typescript.</br>
This project was generated with [angular-cli](https://github.com/angular/angular-cli)</br>
The API is build in PHP.


## Development server

* Clone or download the Repo
* Make sure Angular CLI is installed
* Make sure the MAMP is running and you have the latest version files from the CornerStone for the APIs which can be found at `/data/http/moo/api/application/views/genesys`.
* Goto the root folder of the App run `yarn` to download the dependencies.
* Run `ng serve` for a dev server. Navigate to `http://localhost:4200/?firstName=Sahaj&lastName=Bajra&nickName=Bajras&subject=test&email=sahaj@gmail.com&type=service-desk&customerSegment=Employee&prefPhoneNumber=4021231234&userID=req90402&computerSerial=123123123132&businessType=ASC&targetType=ServiceDesk`. The app will automatically reload if you change any of the source files.
* Run `ng build --prod --aot=false --base-href /genesys/chat/` flag for a production build. The build artifacts will be stored in the `dist/` directory.
* Add the content of dist folder to ITG/CAT/Prod1/Prod2 inside moo/genesys/chat/
