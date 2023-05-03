import { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import * as d3 from 'd3';
import { csv } from 'd3-fetch'
import { OpenStreetMap } from 'leaflet';

const Map = () => {
  const [map, setMap] = useState(null);
  const [polyLineData, setPolyLineData] = useState([]);

  useEffect(() => {
    if (map) {
       setInterval(function () {
          map.invalidateSize();
       }, 100);
    }
 }, [map]);

  useEffect(() => {
      
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;
    // bike_coll.csv

    const url = '/bike_routes_points1.csv';
    const rowsPerChunk = 1000;
    let startRow = 0;
    var routes = [];    
    var projection;
    var w = 1000, h = 800;
    var data;

    function initProjection() {
      var geoJSON = {
        type: "FeatureCollection",
        features: []
      }
      data.forEach(function (d) {
        geoJSON.features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [d.lon, d.lat]
          }
        });
      });
      projection = d3.geoMercator();
      projection.fitSize([w, h], geoJSON);
    }
    
    function projectPoints() {
      data.forEach(function (d) {
        var pt = projection([d.lon, d.lat]);
        d.x = pt[0];
        d.y = pt[1];
      });
    }

    var ctx = d3.select('#map').node().getContext('2d');
    var lineGenerator = d3.line()
    .x(function (d) {
      return d.x;
    })
    .y(function (d) {
      return d.y;
    })
    .context(ctx);

    function updateChart() {
      // ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
      // data.forEach(function(d) {
      //   // console.log(d)
      //   ctx.fillRect(d.x, d.y, 2, 2);
      // });
      ctx.strokeStyle = '#ed4b2b'
      routes.forEach(function (d) {
        ctx.beginPath();
        lineGenerator(d);
        ctx.stroke();
      });
      // var latLngs = [];
      // routes.forEach(function(route) {
      //   latLngs.push(route);
      //   // route.forEach((r) => {
      //   // })
      // });
      // setPolyLineData(latLngs)
      // var polyline = L.polyline(latLngs, {color: '#f00', weight: 1, opacity:0.3}).addTo(map);
    }

    function getRoutes() {
      data.forEach(function(d) {
        // Create empty array if haven't already done so
        if(!routes[d.id]) {
          routes[d.id] = []
        }
        // Add the point's screen coordinates to the array
        routes[d.id].push({
          x: d.x,
          y: d.y
        });
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

      initProjection();
      projectPoints();
      getRoutes();
      updateChart();
    });
  }, []);

  return (
    <div className="" >
      <canvas id="map" width="1000" height="800" />
      {/* <MapContainer 
        center={[40.730610, -73.935242]}
        zoom={12} 
        scrollWheelZoom={false} 
        style={{ height: "100vh", width: "100%" }} 
        whenCreated={setMap}
        className="absolute top-0 left-0 w-full h-full z-0">
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}" />
        {
          polyLineData.length > 0  ? 
          <Polyline positions={polyLineData} weight={1} opacity={1} color="#e76919" />
          : 
          <></>
        }
      </MapContainer> */}
    </div>
  )
};

export default Map;