import { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Pane, Tooltip } from 'react-leaflet';
import { Polyline } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
// import * as d3 from 'd3';
import { csv } from 'd3-fetch'
import axios from "axios";
// import data from '../../../public/boundries.geojson'

// function fetchData() {
//   return axios.get('/boundries.geojson').then(response => {
//     return response.data;
//   });
// }

// boundries.geojson
const FlowMap = () => {

  const style = {
    color: 'red',
    fillColor: '#fff',
    fillOpacity: 0.1,
    weight: 0.4
  };

  const [map, setMap] = useState(null);
  const [polyLineData, setPolyLineData] = useState([]);
  const boroughs = ['Bronx', 'Brooklyn', 'Manhattan', 'Queens', 'Staten Island'];
  const [data, setData] = useState(null);

  useEffect(() => {
      if (map) {
      setInterval(function () {
          map.invalidateSize();
      }, 100);
      }
  }, [map]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    axios.get('/boundries.geojson')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  function onEachFeature(feature, layer) {
    console.log(layer)
    if (feature.properties && feature.properties.name) {
      layer.bindTooltip(feature.properties.name);
    }
  }

  const tooltipOptions = {
    permanent: false,
    direction: 'top',
    content: layer => {
      const feature = layer.feature;
      return feature.properties.boro_name;
    },
  };

  useEffect(() => {
      
    // const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    // const width = 800 - margin.left - margin.right;
    // const height = 600 - margin.top - margin.bottom;
    // bike_coll.csv

    const url = '/bike_routes_points1.csv';
    const geoUrl = '/boundries.geojson'
    // const rowsPerChunk = 1000;
    // let startRow = 0;
    var routes = [];    
    // var projection;
    // var w = 1000, h = 800;
    var data;

    // function initProjection() {
    //   var geoJSON = {
    //     type: "FeatureCollection",
    //     features: []
    //   }
    //   data.forEach(function (d) {
    //     geoJSON.features.push({
    //       type: "Feature",
    //       geometry: {
    //         type: "Point",
    //         coordinates: [d.lon, d.lat]
    //       }
    //     });
    //   });
    //   projection = d3.geoMercator();
    //   projection.fitSize([w, h], geoJSON);
    // }
    
    // function projectPoints() {
    //   data.forEach(function (d) {
    //     var pt = projection([d.lon, d.lat]);
    //     d.x = pt[0];
    //     d.y = pt[1];
    //   });
    // }

    // var ctx = d3.select('#map').node().getContext('2d');
    // var lineGenerator = d3.line()
    // .x(function (d) {
    //   return d.x;
    // })
    // .y(function (d) {
    //   return d.y;
    // })
    // .context(ctx);

    function updateChart() {
      // ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
      // data.forEach(function(d) {
      //   // console.log(d)
      //   ctx.fillRect(d.x, d.y, 2, 2);
      // });
      // ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'
      // routes.forEach(function (d) {
      //   ctx.beginPath();
      //   lineGenerator(d);
      //   ctx.stroke();
      // });
      var latLngs = [];
      routes.forEach(function(route) {
        latLngs.push(route);
        // route.forEach((r) => {
        // })
      });
      setPolyLineData(latLngs)
      // var polyline = L.polyline(latLngs, {color: '#f00', weight: 1, opacity:0.3}).addTo(map);
    }

    function getRoutes() {
      data.forEach(function(d) {
        // Create empty array if haven't already done so
        if(!routes[d.id]) {
          routes[d.id] = []
        }
        // Add the point's screen coordinates to the array
        // routes[d.id].push({
        //   x: d.x,
        //   y: d.y
        // });
        routes[d.id].push([d.lat,d.lon]);
      });
    }

    csv(url).then(chunk => {
      data = chunk.map((d, index) => {
        return {
          id: +d.id,
          lat: +d.lat,
          lon: +d.long
        }
      })

      // initProjection();
      // projectPoints();
      getRoutes();
      updateChart();
    });
  }, []);

  return (
    <div className="map_container" >
      <MapContainer 
        center={[40.710615, -73.995246]}
        zoom={11}
        scrollWheelZoom={false} 
        style={{ height: "800px", width: "100" }} 
        whenCreated={setMap}
        className="absolute top-0 left-0 w-full h-full z-0"
        >
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}" opacity={0.6} />        
        {/* {data && <GeoJSON data={data} style={style} />} */}
        <Pane name="geojson">
          {data && <GeoJSON data={data} style={style} onEachFeature={onEachFeature}> <Tooltip  {...tooltipOptions} className="z-40 bg-white" opacity={1} sticky /> </GeoJSON>}
        </Pane>
        {
          polyLineData.length > 0  ? 
            <Polyline positions={polyLineData} weight={1} opacity={1} color="#009ffd" smoothFactor={0.5} stroke={true} lineJoin="" />
          :
          <></>
        }
        {/* {data && <GeoJSON data={data} />} */}
      </MapContainer>
    </div>
  )
};

export default FlowMap;


// 1. Donut chart With Street Percentages
// 2. Setting up the chart with d3.image
// 3. Flowmap chart Animation
// 4. Line chart
// 5. 