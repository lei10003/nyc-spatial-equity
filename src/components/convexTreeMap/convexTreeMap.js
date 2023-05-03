import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

const data = [
  { numberOfBikeLanes: 10, boroughName: 'Brooklyn', bikeLaneClass: 'Class A' },
  { numberOfBikeLanes: 15, boroughName: 'Queens', bikeLaneClass: 'Class A' },
  { numberOfBikeLanes: 20, boroughName: 'Manhattan', bikeLaneClass: 'Class B' },
  { numberOfBikeLanes: 5, boroughName: 'Bronx', bikeLaneClass: 'Class C' },
  { numberOfBikeLanes: 8, boroughName: 'Staten Island', bikeLaneClass: 'Class C' },
];

const groupByBorough = d3.group(data, (d) => d.boroughName);
const nestedData = Array.from(groupByBorough, ([boroughName, boroughData]) => ({
  boroughName,
  values: Array.from(d3.group(boroughData, (d) => d.bikeLaneClass), ([bikeLaneClass, bikeLaneData]) => ({
    bikeLaneClass,
    numberOfBikeLanes: d3.sum(bikeLaneData, (d) => d.numberOfBikeLanes),
  })),
}));

const root = d3
  .hierarchy({ values: nestedData }, (d) => d.values)
  .sum((d) => d.numberOfBikeLanes)
  .sort((a, b) => b.value - a.value);

const treemapLayout = d3.treemap().size([500, 500]).padding(1).round(true).tile(d3.treemapResquarify);

treemapLayout(root);

const colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);

const ConvexTreeMap = () => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const cell = svg.selectAll('g').data(root.leaves()).join('g').attr('transform', (d) => `translate(${d.x0},${d.y0})`);

    cell
      .append('rect')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('fill', (d) => colorScale(d.parent.data.boroughName));

    cell
      .append('text')
      .attr('x', 5)
      .attr('y', 15)
      .text((d) => `${d.parent.data.boroughName} - ${d.data.bikeLaneClass}: ${d.data.numberOfBikeLanes}`);
  }, []);

  return <svg ref={svgRef} width={500} height={500} />;
};

export default ConvexTreeMap;
