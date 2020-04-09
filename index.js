const confirmedEl = document.getElementById("confirmed");
const deathsEl = document.getElementById("deaths");
const recoveredEl = document.getElementById("recovered");
const info = document.getElementById("info");

const confirmedTotal = document.querySelector('#confirmed > .header');
const deathsTotal = document.querySelector('#deaths > .header');
const recoveredTotal = document.querySelector('#recovered > .header');
const lastUpdate = document.getElementById('lastUpdate');


const mapboxHover = (map) => {
    map.on('mousemove', function(e) {
        let hover = document.getElementById('hover');
        hover.style.display="block"
        hover.innerHTML = JSON.stringify(e.point) + '<br />' + JSON.stringify(e.lngLat.wrap());
    });
}

const flyToLoc = (map, mapData) => {
    map.flyTo({
        center: [mapData.map.coordinates[0], mapData.map.coordinates[1]],
        zoom: mapData.map.zoom,
        essential: true
    })
}

const displayInfo = (title, source) => {
    return `<p class="state">${title}</p>
    <p class="value">Confirmed: <span id="infoConf">${source.confirmed}</span></p>
    <p class="value">Deaths: <span id="infoDeaths">${source.deaths}</span></p>
    <p class="value">Recovered: <span id="infoRec">${source.recovered}</span></p>
    <p class="value">Active: <span id="infoActive">${source.active}</span></p>`
}

const statHandler = (key, stat, el, map, mapData) => {
    let sp = document.createElement('span');
    sp.className = "stat";
    sp.innerHTML = `${key}: <span class="value">${stat}</span>`;
    el.appendChild(sp);

    sp.onclick = () => {
        flyToLoc(map, mapData);
        info.innerHTML = displayInfo(key, mapData.stats);
    }
}

const main = async () => {
    const res = await fetch("https://covid-india.firebaseio.com/locations.json");
    const locations = await res.json();

    const full = await fetch('https://covid-india.firebaseio.com/FULLSTATS.json')
    const fullstats = await full.json();

    mapboxgl.accessToken = "pk.eyJ1IjoidmVlcnUxNTMiLCJhIjoiY2s3eW5mb3Q3MDd3cjNrbXl6Zm52dm92NCJ9.cP2m0g27T5o0ggAkzulbVA";
    let map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/dark-v10', //hosted style id
        center: [78.96, 22.59], // starting position
        zoom: 4 // starting zoom
    });

    // mapboxHover(map)

    confirmedTotal.innerHTML = `Confirmed<br><span class="value">${fullstats.confirmed+fullstats.foreign}</span>`;
    deathsTotal.innerHTML = `Deaths<br><span class="value">${fullstats.deaths}</span>`;
    recoveredTotal.innerHTML = `Recovered<br><span class="value">${fullstats.recovered}</span>`;
    lastUpdate.innerHTML = `Last Updated: ${fullstats.lastUpdate}`

    info.innerHTML = displayInfo("Total", fullstats);

    for(let key in locations) {
        let coords = locations[key].map.coordinates;
        let el = document.createElement('div');
        el.className = "marker";
        let level = locations[key].stats.active / fullstats.active;
        if(level > 0 && level < 0.05) el.classList.add("level1");
        if(level >= 0.05 && level < 0.15) el.classList.add("level2");
        if(level >= 0.15 && level < 0.25) el.classList.add("level3");
        if(level >= 0.25 && level < 0.50) el.classList.add("level4");
        if(level >= 0.50 && level < 1.00) el.classList.add("level5");
        new mapboxgl.Marker(el)
            .setLngLat([coords[0], coords[1]])
            .addTo(map);
        el.onclick = () => {
            info.innerHTML = displayInfo(key, locations[key].stats);
            flyToLoc(map, locations[key]);
        }
            
        // Stats
        if(locations[key].stats.confirmed>0) {
            statHandler(key, locations[key].stats.confirmed, confirmedEl, map, locations[key]);
            statHandler(key, locations[key].stats.deaths, deathsEl, map, locations[key]);
            statHandler(key, locations[key].stats.recovered, recoveredEl, map, locations[key]);
        }

    }
    let mapDiv = document.querySelector('#map > div.mapboxgl-canvas-container.mapboxgl-interactive.mapboxgl-touch-drag-pan.mapboxgl-touch-zoom-rotate > canvas');
    mapDiv.onclick = () => {
        info.innerHTML = displayInfo("Total", fullstats);
    }
}

main();
