import { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, LayerGroup } from 'react-leaflet';
import { Polyline } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import * as d3 from 'd3';
import { csv } from 'd3-fetch'
import { OpenStreetMap } from 'leaflet';
import { Element } from 'react-scroll';



const Map = ({minInjury}) => {
    const [pointsByLocation, setPointsByLocation] = useState({});
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
      setPointsByLocation({})
      updateChartWithInjuries(minInjury)
    }, [minInjury])


    function updateChartWithInjuries(minInjury) {
        const url = '/nyc_injuries.csv';
        minInjury = parseInt(minInjury)
        console.log('Min Injury', typeof minInjury)
        csv(url).then(data => {
            // Group data points by location
           const points_data = {}
           for (const point of data) {
               if (point['NUMBER OF CYCLIST INJURED'] >= minInjury) {
                   const { LATITUDE, LONGITUDE } = point;        
                   const location = `${LATITUDE},${LONGITUDE}`;
                   
                   if (!points_data[location]) {
                       points_data[location] = 0;
                   }
                   
                   points_data[location] += +point['NUMBER OF CYCLIST INJURED'];
               }
           }
           setPointsByLocation(points_data)
         });
        
    }

    // Compute circle radius based on number of data points in location
    // const maxPoints = Math.max(...Object.values(pointsByLocation).map((points) => points));
    // console.log(maxPoints)
    // const medianp = median([...Object.values(pointsByLocation).map((points) => points)]);    
    // console.log(medianp)
    const radiusScale = (count) => count * 30;
    // console.log(radiusScale)

  useEffect(() => {

  }, []);

  useEffect(() => {
      
    // const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    // const width = 800 - margin.left - margin.right;
    // const height = 600 - margin.top - margin.bottom;
    // bike_coll.csv

    const url = '/bike_routes_points1.csv';
    // const rowsPerChunk = 1000;
    // let startRow = 0;
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
    //         center={[40.730610, -73.935242]}
    <div className="map_container" >
      <MapContainer 
        center={[40.730610, -73.995242]}
        zoom={11}
        scrollWheelZoom={false} 
        style={{ height: "800px", width: "100" }} 
        whenCreated={setMap}
        className="absolute top-0 left-0 w-full h-full z-0"
        >
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}" opacity={0.6} />        
        {
          polyLineData.length > 0  ? 
            <Polyline positions={polyLineData} weight={1} opacity={1} color="#009ffd" smoothFactor={0.5} stroke={true} lineJoin="" />
          :
          <></>
        }
        <LayerGroup>
          {Object.entries(pointsByLocation).map(([location, points]) => {
              const [lat, lon] = location.split(',');
              const radius = radiusScale(points);
              return (
                <Circle key={location} center={[lat, lon]} radius={radius} stroke={true} opacity={1} fillOpacity={0.6} fillColor="#e47700" color="#f5f7f6" weight={1} />
              );
          })}
        </LayerGroup>
      </MapContainer>
    </div>
  )
};

export default Map;