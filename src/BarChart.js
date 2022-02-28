import './App.css';
import { useD3 } from './hooks/useD3';
import React from 'react';
import * as d3 from 'd3';
import { axisBottom } from 'd3-axis';
import { select, mouse } from 'd3-selection';
import d3Tip from "d3-tip";

<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.7.1/d3-tip.min.js"></script>

function BarChart({ data,index }) {
  const ref = useD3(
    (svg) => {
      const height = 350;
      const width = 1900;
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
 //data = data.filter(function(d){return d.iso_a3 === "NOR";})

console.log(index);
var format = d3.timeFormat("%Y-%b");
var mindate = d3.min(data, (d) => d.date);
var maxdate =  d3.max(data, (d) => d.date);
var currentColor;
var currentVal;
console.log(mindate);
console.log(maxdate);
      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.date))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.1);

      const y1 = d3
        .scaleLinear()
        .domain([-1, 1])
        .rangeRound([height - margin.bottom, margin.top]);

        const xAxis = g => g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .style("font-size", "11px")
        .call(
          axisBottom(x)
            // Use the player names from the data
            .tickFormat(format)
            // Remove outer tick mark

        );

      const y1Axis = (g) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .style("color", "black")
          .style("font-size", "16px")
          .call(d3.axisLeft(y1).ticks(null, "s"))
          .call((g) => g.select(".domain").remove())
          .call((g) =>
            g
              .append("text")
              .attr("x", -margin.left)
              .attr("y", 10)
              .attr("fill", "currentColor")
              .attr("text-anchor", "start")
              .text(data.y1)
          );

      svg.select(".x-axis").call(xAxis);
      svg.select(".y-axis").call(y1Axis);

        var tip = d3Tip()
        .attr('class', 'd3-tip')
        .offset([-50, 0])
        .html(function(d) {
          return "<strong>Value:</strong> <span style='color:red'>" + currentVal + "</span>";
        })

        svg.call(tip);

      function sMouseOver(d) {
        d3.select(this).style("fill", function (d) {
          currentColor = d[index] > 0 ? "blue" : "darkred";
          currentVal = d[index];
          return currentColor;
         });
        tip.show(d, this)
      };

      function sMouseOut(d) {
        // currentColor = currentColor == "darkred" ? "red" : "steelblue";
        d3.select(this).style("fill", function (d) {
          currentColor = d[index] > 0 ? "steelblue" : "red";
          return currentColor
         });
        tip.hide(d, this)	  
      };

      svg
        .select(".plot-area")
        .selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("fill", function (d) {
          if(d[index] > 0){
            currentColor = "steelblue"
            return currentColor;
          }
          else{
            currentColor = "red"
            return currentColor;
          }
         })
        .attr("x", (d) => x(d.date))
        .attr("width", x.bandwidth())
        .attr("y", (d) => y1(Math.max(0, d[index])))
        .attr("height", (d) => Math.abs(y1(d[index]) - y1(0)))
        .on('mouseover', sMouseOver)
        .on('mouseout', sMouseOut)
        // .on("mouseover", function(d) {
        //   d3.select(this).attr("r", 10).style("fill", "darkred"); 
        //   tip.show(d, this)
        // })                  
        // .on("mouseout", function(d) {
        //   d3.select(this).attr("r", 10).style("fill", "red"); 
        //   tip.hide(d, this)
        // });
        //Change the bar color back to the original color on mouseout events
    },
    [data.length,index]
  );

  return (
    <svg
      ref={ref}
      style={{
        height: 350,
        width: "100%",
        marginRight: "0px",
        marginLeft: "0px",
      }}
    >
      <g className="plot-area" />
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>
  );
}

export default BarChart;