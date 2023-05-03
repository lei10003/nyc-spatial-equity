import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineChart = ({ data }) => {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const margin = { top: 20, right: 30, bottom: 30, left: 100 };
    const width = 960 - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Remove existing graph
    svg.selectAll('*').remove();

    if (data.length <= 0 ){
        return
    }
    const nestedData = Array.from(d3.group(data, d => d.year), ([key, values]) => ({ key, values }));

    const x = d3.scaleBand()
      .domain(monthNames)
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(nestedData, d => d3.max(d.values, d => d.total))])
        .range([height, 0]);

    const color = d3.scaleOrdinal()
        .domain(nestedData.map(d => d.key))
        .range(d3.schemeCategory10);

    // const grid = svg.append('g')
    //     .attr('class', 'grid');

    // grid.selectAll('.grid-line')
    //     .data(y.ticks())
    //     .enter()
    //     .append('line')
    //     .attr('class', 'grid-line')
    //     .attr('x1', 0)
    //     .attr('x2', width)
    //     .attr('y1', d => y(d))
    //     .attr('y2', d => y(d))
    //     .style('stroke', '#ddd')
    //     .style('stroke-width', 1)
    //     .style('shape-rendering', 'crispEdges')
    //     .lower();

    // svg.append('g')
    //     .attr('class', 'y-axis')
    //     .call(d3.axisLeft(y));

    // svg.append('g')
    // .attr('class', 'y-axis')
    // .call(d3.axisLeft(y).ticks(5).tickSize(6).tickPadding(10))
    // .style('font-size', '14px');

    const line = d3.line()
        .x(d => x(d.month) + x.bandwidth() / 2)
        .y(d => y(d.total))
        .curve(d3.curveCatmullRom.alpha(0.8));

    svg.selectAll(".line")
        .data(nestedData)
        .enter().append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", d => color(d.key))
        .attr("stroke-width", 2)
        .attr("d", d => line(d.values));

    svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d.month) + x.bandwidth() / 2)
        .attr('cy', d => y(d.total))
        .attr('r', 5)
        .attr('fill', d => color(d.year))
        .attr('stroke-width', 1);
    
    // svg.append('g')
    //     .attr('class', 'y-axis')
    //     .call(d3.axisLeft(y).ticks(5))
    //     .style('font-size', '14px');
    
      
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5))
        .style('font-size', '16px');

    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(10,${height})`)
        .call(d3.axisBottom(x))
        .style('font-size', '18px');

    // svg.append("g")
    //     .call(d3.axisBottom(x))
    //     .style('font-size', '14px');  

  }, [data, dimensions]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setDimensions({
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height
      });
    });

    resizeObserver.observe(svgRef.current.parentElement);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className='p-10'>
        <div className='m-5'>
            <svg ref={svgRef}></svg>
        </div>
    </div>
  );
};

export default LineChart;
