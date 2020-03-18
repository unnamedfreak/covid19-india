const mapbox = () => {
        map.on('mousemove', function(e) {
            document.getElementById('info').innerHTML = JSON.stringify(e.point) + '<br />' + JSON.stringify(e.lngLat.wrap());
        });
}

const main = async () => {
    const res = await fetch("https://covid-india.firebaseio.com/locations.json");
    const locations = await res.json();

    const full = await fetch('https://covid-india.firebaseio.com/FULLSTATS.json')
    const fullstats = await full.json();
    
    mapboxgl.accessToken = 'pk.eyJ1IjoidmVlcnUxNTMiLCJhIjoiY2s3dWczdXZlMHp4OTNlbXJ0bW9kNGxpaSJ9.1nnG6uPTpIllBG7TWPt-ZA';
    let map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/dark-v10', //hosted style id
        center: [78.96, 22.59], // starting position
        zoom: 4 // starting zoom
    });

    const confirmedEl = document.getElementById("confirmed");
    const deathsEl = document.getElementById("deaths");
    const recoveredEl = document.getElementById("recovered");
    let info = document.getElementById("info");

    const confirmedTotal = document.querySelector('#confirmed > .header');
    confirmedTotal.innerHTML = `Confirmed<br><span class="value">${fullstats.confirmed}</span>`;
    const deathsTotal = document.querySelector('#deaths > .header');
    deathsTotal.innerHTML = `Deaths<br><span class="value">${fullstats["deaths"]}</span>`;
    const recoveredTotal = document.querySelector('#recovered > .header');
    recoveredTotal.innerHTML = `Recovered<br><span class="value">${fullstats["recovered"]}</span>`;
    const lastUpdate = document.getElementById('lastUpdate');
    lastUpdate.innerHTML = `Last Updated: ${fullstats["lastUpdate"]}`

    for(let key in locations) {
        let coords = locations[key].map.coordinates;
        let el = document.createElement('div');
        el.className = "marker";
        let level = locations[key].stats.active / fullstats.active;
        if(level > 0 && level < 0.25) el.classList.add("level1");
        if(level >= 0.25 && level < 0.50) el.classList.add("level2");
        if(level >= 0.50 && level < 0.75) el.classList.add("level3");
        if(level >= 0.75 && level < 1.00) el.classList.add("level3");
        new mapboxgl.Marker(el)
            .setLngLat([coords[0], coords[1]])
            .addTo(map);
        el.onclick = () => {
            info.innerHTML = `<p class="state">${key}</p>
                                <p class="value">Confirmed: <span id="infoConf">${locations[key].stats.confirmed}</span></p>
                                <p class="value">Deaths: <span id="infoDeaths">${locations[key].stats.deaths}</span></p>
                                <p class="value">Recovered: <span id="infoRec">${locations[key].stats.recovered}</span></p>
                                <p class="value">Active: <span id="infoActive">${locations[key].stats.active}</span></p>`;
            map.flyTo({
                center: [coords[0], coords[1]],
                zoom: locations[key].map.zoom,
                essential: true
            })
        }
            
        // Stats
        let sp;
        if(locations[key].stats.confirmed>0) {
            sp = document.createElement('span');
            sp.className = "stat";
            sp.innerHTML = `${key}: <span class="value">${locations[key].stats.confirmed}</span>`;
            confirmedEl.appendChild(sp);
            
            sp = document.createElement('span');
            sp.className = "stat";
            sp.innerHTML = `${key}: <span class="value">${locations[key].stats.deaths}</span>`;
            deathsEl.appendChild(sp);
            
            sp = document.createElement('span');
            sp.className = "stat";
            sp.innerHTML = `${key}: <span class="value">${locations[key].stats.recovered}</span>`;
            recoveredEl.appendChild(sp);
        }

    }
}

main();