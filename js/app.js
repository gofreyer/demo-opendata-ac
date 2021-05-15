"use strict";

const url_sr = getRequestURL("ST%C3%84DTEREGION");
const url_ac = getRequestURL("AACHEN");
const url_al = getRequestURL("ALSDORF");
const url_ba = getRequestURL("BAESWEILER");
const url_es = getRequestURL("ESCHWEILER");
const url_he = getRequestURL("HERZOGENRATH");
const url_mo = getRequestURL("MONSCHAU");
const url_ro = getRequestURL("ROETGEN");
const url_st = getRequestURL("STOLBERG");
const url_wu = getRequestURL("W%C3%9CRSELEN");
const url_si = getRequestURL("SIMMERATH");

const url_rki =
  "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=GEN%20%3D%20%27ST%C3%84DTEREGION%20AACHEN%27&outFields=GEN,cases,deaths,cases7_per_100k,last_update&outSR=4326&f=json";

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
  url_wu
];

let _listeKuerzel = [
  "sr",
  "ac",
  "al",
  "ba",
  "es",
  "he",
  "mo",
  "ro",
  "si",
  "st",
  "wu"
];

let results = [];

let _listeButtons = [];
let i = 0;
for (let _kuerzel of _listeKuerzel) {
  let buttonID = `#req_${_kuerzel}`;
  let url = _listeURLs[i];
  let _button = document.querySelector(buttonID);
  let _i = i;
  _button.addEventListener("click", () => newRequest(url, results, _i));
  _listeButtons[i] = _button;
  i++;
}

let btUeberblick = document.querySelector("#ueberblick");
btUeberblick.addEventListener("click", () => ueberblick());

/*
let btRKI = document.querySelector("#rki");
btRKI.addEventListener("click", () => newRequest(url_rki, null, -1));
*/
async function newRequest(url, results, i, fillTab = true) {
  let timeStamp = `&timestamp=${new Date().getTime()}`;
  try {
    await requestOpenData(url + (i >= 0 ? "" : timeStamp), results, i, fillTab);
  } catch (e) {
    console.log(`newRequest ${i}: Keine Daten!`);
  }

  return;

  /*

  // veraltete Benutzung von XMLHttpRequest 

  const Http = new XMLHttpRequest();

  Http.open('GET', url);
  Http.send();

  let json_text;
  let json_obj;
  let req_header = [];
  let req_row = [];
  results[i] = [];

  Http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //console.log(Http.responseText)
      json_text = Http.responseText;
      json_obj = JSON.parse(json_text);

      let tabCols = [];
      let col = 0;
      for (col = 0; col < json_obj.fields.length; col++) {
        tabCols[col] = json_obj.fields[col].name;

        req_header[col] = tabCols[col];
      }
      tabCols.push('neue Fälle (berechnet)');
      req_header.push('neue Fälle (berechnet)');

      let parentNode = addTableHeader('#tabelle', tabCols);

      let lastPositiv = 0;
      let currentPositiv = 0;
      let tabCells = [];
      let refNode = null;
      json_obj.features.forEach((feature) => {
        currentPositiv = 0;
        tabCells = [];
        req_row = [];
        for (col = 0; col < json_obj.fields.length; col++) {
          if (json_obj.fields[col].type === 'esriFieldTypeDate') {
            let datum = new Date(feature.attributes[tabCols[col]]);
            let datum_str = datum.toUTCString();
            var options = {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            };
                      
            tabCells[col] = `${datum.toLocaleString(
              'de-DE',
              options
            )} (${datum.toLocaleTimeString('de-DE', {
              hour: '2-digit',
              minute: '2-digit',
            })})`;
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

          req_row[col] = tabCells[col];
        }

        let neueFaelle = `${currentPositiv - lastPositiv}`;
        tabCells.push(neueFaelle);
        req_row.push(neueFaelle);
        lastPositiv = currentPositiv;

        if (refNode !== null) {
          refNode.classList.remove('row-selected');
        }
        refNode = addTableRow(parentNode, refNode, tabCells);
        refNode.classList.add('row-selected');
      });

      results[i] = [req_header, req_row];
    }
  };
  */
}

function addTableHeader(tableID, tableColumns) {
  let tab = document.querySelector(tableID);
  tab.innerHTML = "";
  let tabHeader = document.createElement("tr");
  tab.appendChild(tabHeader);
  tabHeader.classList.add("th");
  for (let col = 0; col < tableColumns.length; col++) {
    let tabCol = document.createElement("th");
    tabCol.innerText = tableColumns[col];
    if (col === tableColumns.length - 1 && col >= 6) {
      tabCol.classList.add("has-text-danger");
    }
    tabHeader.appendChild(tabCol);
  }

  return tab;
}

function addTableRow(parentNode, refNode, tableColumns) {
  let tabRow = document.createElement("tr");
  if (refNode === null) {
    parentNode.appendChild(tabRow);
  } else {
    parentNode.insertBefore(tabRow, refNode);
  }

  for (let col = 0; col < tableColumns.length; col++) {
    let tabCell = document.createElement("td");
    tabCell.innerText = tableColumns[col];
    if (col === tableColumns.length - 1 && col >= 6) {
      tabCell.classList.add("berechnet");
    }
    tabRow.appendChild(tabCell);
  }

  return tabRow;
}

function processOpenData(json_obj, results, i, fillTab = true) {
  let req_header = [];
  let req_row = [];
  results[i] = [];

  let tabCols = [];
  let col = 0;

  for (col = 0; col < json_obj.fields.length; col++) {
    tabCols[col] = json_obj.fields[col].name;
    req_header[col] = tabCols[col];
  }
  tabCols.push("neue Fälle (berechnet)");
  req_header.push("neue Fälle (berechnet)");

  let parentNode = null;
  if (fillTab && i >= 0) {
    parentNode = addTableHeader("#tabelle", tabCols);
  }

  let lastPositiv = 0;
  let currentPositiv = 0;
  let tabCells = [];
  let refNode = null;
  let counter = 0;
  json_obj.features.forEach((feature) => {
    counter++;
    currentPositiv = 0;
    tabCells = [];
    req_row = [];
    for (col = 0; col < json_obj.fields.length; col++) {
      if (json_obj.fields[col].type === "esriFieldTypeDate") {
        let datum = new Date(feature.attributes[tabCols[col]]);
        let datum_str = datum.toUTCString();
        var options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        };
        tabCells[col] = `${datum.toLocaleString(
          "de-DE",
          options
        )} (${datum.toLocaleTimeString("de-DE", {
          hour: "2-digit",
          minute: "2-digit"
        })})`;
      } else if (json_obj.fields[col].name === "Inzidenz") {
        tabCells[col] = parseFloat(feature.attributes[tabCols[col]]).toFixed(2);
        if (isNaN(tabCells[col])) {
          tabCells[col] = "";
        }
      } else {
        tabCells[col] = feature.attributes[tabCols[col]];
      }

      if (json_obj.fields[col].name === "Positiv") {
        currentPositiv = parseInt(tabCells[col]);
      }

      req_row[col] = tabCells[col];
    }

    let neueFaelle = `${currentPositiv - lastPositiv}`;
    tabCells.push(neueFaelle);
    req_row.push(neueFaelle);
    lastPositiv = currentPositiv;

    if (fillTab) {
      if (refNode !== null) {
        refNode.classList.remove("row-selected");
      }
      refNode = addTableRow(parentNode, refNode, tabCells);
      refNode.classList.add("row-selected");
      /*
      if (counter % 2 === 0)
      {
        refNode.classList.add("has-background-grey-lighter");  
      }
      */
    }
  });

  results[i] = [req_header, req_row];

  return json_obj;
}

function processRKIOpenData(json_obj, fillTab = true) {
  let tabCols = [];
  let tabColNames = [];
  let col = 0;

  for (col = 0; col < json_obj.fields.length; col++) {
    tabCols[col] = json_obj.fields[col].name;
    tabColNames[col] = json_obj.fields[col].alias;
    if (tabColNames[col] === "GEN") {
      tabColNames[col] = "RKI-Landkreis";
    } else if (tabColNames[col] === "Fälle letzte 7 Tage/100.000 EW") {
      tabColNames[col] = "RKI-Inzidenz";
    }
  }

  let parentNode = null;
  if (fillTab) {
    parentNode = addTableHeader("#rki_tabelle", tabColNames);
  }

  let tabCells = [];
  let refNode = null;
  let counter = 0;
  json_obj.features.forEach((feature) => {
    counter++;
    tabCells = [];
    for (col = 0; col < json_obj.fields.length; col++) {
      if (json_obj.fields[col].name === "cases7_per_100k") {
        tabCells[col] = parseFloat(feature.attributes[tabCols[col]]).toFixed(2);
        if (isNaN(tabCells[col])) {
          tabCells[col] = "";
        }
      } else {
        tabCells[col] = feature.attributes[tabCols[col]];
      }
    }

    if (fillTab) {
      if (refNode !== null) {
        refNode.classList.remove("row-selected");
      }
      refNode = addTableRow(parentNode, refNode, tabCells);
      refNode.classList.add("row-selected");
    }
  });

  return json_obj;
}

const getOpenData = async (url) => {
  try {
    const config = {}; /*{ headers: { "Cache-Control": "no-cache" } };*/
    const res = await axios.get(url, config);
    return res;
  } catch (e) {
    return "getOpenData: Keine Daten!";
  }
};

const requestOpenData = async (url, results, index, fillTab = true) => {
  let _body = document.body;
  if (fillTab) {
    enableWaitCursor();
  }
  try {
    const res = await getOpenData(url);
    let res2 = null;
    if (index >= 0) {
      res2 = processOpenData(res.data, results, index, fillTab);
    } else {
      res2 = processRKIOpenData(res.data, fillTab);
    }

    if (fillTab) {
      enableWaitCursor(false);
    }
    return res2;
  } catch (e) {
    if (fillTab) {
      enableWaitCursor(false);
    }
    return "requestOpenData: Keine Daten!";
  }
};

async function ueberblick() {
  enableWaitCursor();

  for (let i = 0; i < 11; i++) {
    if (results[i] == undefined) {
      let url = _listeURLs[i];
      try {
        await requestOpenData(url, results, i, false);
      } catch (e) {
        console.log(`ueberblick ${i}: Keine Daten!`);
      }

      //await requestOpenData(url, results, i);
    }
  }

  if (results[0] != undefined && results[0][0] != undefined) {
    let parentNode = addTableHeader("#tabelle", results[0][0]);
    let refNode = null;
    for (let row = 0; row < 11; row++) {
      //console.log(results[row][1]);
      if (results[row] != undefined && results[row][1] != undefined) {
        let tabrow = addTableRow(parentNode, refNode, results[row][1]);
        if (row == 0) {
          tabrow.classList.add("row-selected");
        }
        if (row % 2 === 0) {
          tabrow.classList.add("has-background-grey-lighter");
        }
      }
    }
  }

  enableWaitCursor(false);
}

function enableWaitCursor(enable = true) {
  let _body = document.body;
  if (enable) {
    _body.classList.add("waiting");
  } else {
    _body.classList.remove("waiting");
  }
}

function getRequestURL(kommune) {
  return `https://services-eu1.arcgis.com/2ypUQspLVcN0KOBE/arcgis/rest/services/CoronavirusFallzahlen_%C3%B6ffentlich/FeatureServer/1/query?where=Kommune%20%3D%20%27${kommune}%27&outFields=Kommune,Meldedatum,Positiv,Genesen,Tote,Aktiv,Inzidenz&outSR=4326&f=json`;
}

newRequest(url_rki, null, -1);
newRequest(url_sr, results, 0);
//ueberblick();
