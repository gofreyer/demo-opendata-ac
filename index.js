'use strict';

const url_sr =
  'https://services-eu1.arcgis.com/2ypUQspLVcN0KOBE/arcgis/rest/services/CoronavirusFallzahlen_%C3%B6ffentlich/FeatureServer/1/query?where=Kommune%20%3D%20%27ST%C3%84DTEREGION%27&outFields=Kommune,Meldedatum,Positiv,Genesen,Tote,Aktiv,Inzidenz,Creator&outSR=4326&f=json';
const url_ac =
  'https://services-eu1.arcgis.com/2ypUQspLVcN0KOBE/arcgis/rest/services/CoronavirusFallzahlen_%C3%B6ffentlich/FeatureServer/1/query?where=Kommune%20%3D%20%27AACHEN%27&outFields=Kommune,Meldedatum,Positiv,Genesen,Tote,Aktiv,Inzidenz,Creator&outSR=4326&f=json';
const url_al =
  'https://services-eu1.arcgis.com/2ypUQspLVcN0KOBE/arcgis/rest/services/CoronavirusFallzahlen_%C3%B6ffentlich/FeatureServer/1/query?where=Kommune%20%3D%20%27ALSDORF%27&outFields=Kommune,Meldedatum,Positiv,Genesen,Tote,Aktiv,Inzidenz,Creator&outSR=4326&f=json';
const url_ba =
  'https://services-eu1.arcgis.com/2ypUQspLVcN0KOBE/arcgis/rest/services/CoronavirusFallzahlen_%C3%B6ffentlich/FeatureServer/1/query?where=Kommune%20%3D%20%27BAESWEILER%27&outFields=Kommune,Meldedatum,Positiv,Genesen,Tote,Aktiv,Inzidenz,Creator&outSR=4326&f=json';
const url_es =
  'https://services-eu1.arcgis.com/2ypUQspLVcN0KOBE/arcgis/rest/services/CoronavirusFallzahlen_%C3%B6ffentlich/FeatureServer/1/query?where=Kommune%20%3D%20%27ESCHWEILER%27&outFields=Kommune,Meldedatum,Positiv,Genesen,Tote,Aktiv,Inzidenz,Creator&outSR=4326&f=json';
const url_he =
  'https://services-eu1.arcgis.com/2ypUQspLVcN0KOBE/arcgis/rest/services/CoronavirusFallzahlen_%C3%B6ffentlich/FeatureServer/1/query?where=Kommune%20%3D%20%27HERZOGENRATH%27&outFields=Kommune,Meldedatum,Positiv,Genesen,Tote,Aktiv,Inzidenz,Creator&outSR=4326&f=json';
const url_mo =
  'https://services-eu1.arcgis.com/2ypUQspLVcN0KOBE/arcgis/rest/services/CoronavirusFallzahlen_%C3%B6ffentlich/FeatureServer/1/query?where=Kommune%20%3D%20%27MONSCHAU%27&outFields=Kommune,Meldedatum,Positiv,Genesen,Tote,Aktiv,Inzidenz,Creator&outSR=4326&f=json';
const url_ro =
  'https://services-eu1.arcgis.com/2ypUQspLVcN0KOBE/arcgis/rest/services/CoronavirusFallzahlen_%C3%B6ffentlich/FeatureServer/1/query?where=Kommune%20%3D%20%27ROETGEN%27&outFields=Kommune,Meldedatum,Positiv,Genesen,Tote,Aktiv,Inzidenz,Creator&outSR=4326&f=json';
const url_st =
  'https://services-eu1.arcgis.com/2ypUQspLVcN0KOBE/arcgis/rest/services/CoronavirusFallzahlen_%C3%B6ffentlich/FeatureServer/1/query?where=Kommune%20%3D%20%27STOLBERG%27&outFields=Kommune,Meldedatum,Positiv,Genesen,Tote,Aktiv,Inzidenz,Creator&outSR=4326&f=json';
const url_wu =
  'https://services-eu1.arcgis.com/2ypUQspLVcN0KOBE/arcgis/rest/services/CoronavirusFallzahlen_%C3%B6ffentlich/FeatureServer/1/query?where=Kommune%20%3D%20%27W%C3%9CRSELEN%27&outFields=Kommune,Meldedatum,Positiv,Genesen,Tote,Aktiv,Inzidenz,Creator&outSR=4326&f=json';
const url_si =
  'https://services-eu1.arcgis.com/2ypUQspLVcN0KOBE/arcgis/rest/services/CoronavirusFallzahlen_%C3%B6ffentlich/FeatureServer/1/query?where=Kommune%20%3D%20%27SIMMERATH%27&outFields=Kommune,Meldedatum,Positiv,Genesen,Tote,Aktiv,Inzidenz,Creator&outSR=4326&f=json';

let _listeURLs = [
  url_sr,
  url_ac,
  url_al,
  url_ba,
  url_es,
  url_he,
  url_mo,
  url_ro,
  url_si,
  url_st,
  url_wu,
];

let _listeKuerzel = [
  'sr',
  'ac',
  'al',
  'ba',
  'es',
  'he',
  'mo',
  'ro',
  'si',
  'st',
  'wu',
];
let _listeButtons = [];
let i = 0;
for (let _kuerzel of _listeKuerzel) {
  let buttonID = `#req_${_kuerzel}`;
  console.log(buttonID);
  let url = _listeURLs[i];
  console.log(url);
  let _button = document.querySelector(buttonID);
  _button.addEventListener('click', () => newRequest(url));
  _listeButtons[i] = _button;
  i++;
}

/*
const btnReqAC = document.querySelector('#req_ac');
const btnReqSR = document.querySelector('#req_sr');
btnReqAC.addEventListener('click', () => newRequest(url_ac));
btnReqSR.addEventListener('click', () => newRequest(url_sr));
*/

newRequest(url_sr);

function newRequest(url) {
  const Http = new XMLHttpRequest();

  Http.open('GET', url);
  Http.send();

  let json_text;
  let json_obj;

  Http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //console.log(Http.responseText)
      json_text = Http.responseText;
      json_obj = JSON.parse(json_text);

      let tabCols = [];
      let col = 0;
      for (col = 0; col < json_obj.fields.length; col++) {
        tabCols[col] = json_obj.fields[col].name;
      }
      tabCols.push('neue Fälle (berechnet)');

      let parentNode = addTableHeader('#tabelle', tabCols);

      let lastPositiv = 0;
      let currentPositiv = 0;
      let tabCells = [];
      let refNode = null;
      json_obj.features.forEach((feature) => {
        currentPositiv = 0;
        tabCells = [];
        for (col = 0; col < json_obj.fields.length; col++) {
          if (json_obj.fields[col].type === 'esriFieldTypeDate') {
            let datum = new Date(feature.attributes[tabCols[col]]);
            let datum_str = datum.toUTCString();
            tabCells[col] = datum_str;
          } else if (json_obj.fields[col].name === 'Inzidenz') {
            tabCells[col] = parseFloat(
              feature.attributes[tabCols[col]]
            ).toFixed(2);

            if (isNaN(tabCells[col])) {
              tabCells[col] = '';
            }
          } else {
            tabCells[col] = feature.attributes[tabCols[col]];
          }

          if (json_obj.fields[col].name === 'Positiv') {
            currentPositiv = parseInt(tabCells[col]);
          }
        }

        let neueFaelle = `${currentPositiv - lastPositiv}`;
        tabCells.push(neueFaelle);
        lastPositiv = currentPositiv;

        refNode = addTableRow(parentNode, refNode, tabCells);
      });
    }
  };
}

function addTableHeader(tableID, tableColumns) {
  let tab = document.querySelector(tableID);
  tab.innerHTML = '';
  let tabHeader = document.createElement('tr');
  tab.appendChild(tabHeader);
  tabHeader.classList.add('th');
  for (let col = 0; col < tableColumns.length; col++) {
    let tabCol = document.createElement('th');
    tabCol.innerText = tableColumns[col];
    tabHeader.appendChild(tabCol);
  }

  return tab;
}

function addTableRow(parentNode, refNode, tableColumns) {
  let tabRow = document.createElement('tr');
  if (refNode === null) {
    parentNode.appendChild(tabRow);
  } else {
    parentNode.insertBefore(tabRow, refNode);
  }

  for (let col = 0; col < tableColumns.length; col++) {
    let tabCell = document.createElement('td');
    tabCell.innerText = tableColumns[col];
    tabRow.appendChild(tabCell);
  }

  return tabRow;
}
