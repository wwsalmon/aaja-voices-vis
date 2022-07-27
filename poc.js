const newsroomLabel = "US Newsrooms";

const percentPoc = 0.407;

const data = [
    {name: "Peabody Awards", label: "Judges", value: 12 / 18},
    {name: "Pulitzer Prize", label: "Board members", value: 7 / 19},
    {name: "Livingston Awards", label: "National judges", value: 3 / 10},
    {name: "Loeb Awards", label: "Final judges", value: 4 / 20},
    {name: newsroomLabel, label: "CJR", value: 0.17},
];

const getColor = (label) => "gray";

const width = 700;
const barHeight = 48;
const margin = 16;
const unitHeight = margin + barHeight;
const totalHeight = data.length * unitHeight;

const xScale = d3.scaleLinear().range([0, width]).domain([0, 0.8]);

const svg = d3.select("svg").attr("viewBox", `0 0 ${width} ${totalHeight}`);

const items = svg.selectAll("g.item")
    .data(data)
    .enter()
    .append("g")
    .style("transform", (d, i) => `translateY(${i * unitHeight}px)`);

items.append("rect")
    .attr("width", d => xScale(d.value))
    .attr("height", barHeight)
    .attr("fill", d => getColor(d.name))

items.append("text")
    .text(d => d.name)
    .attr("x", 8)
    .attr("y", barHeight / 2)
    .attr("dominant-baseline", "middle")
    .attr("fill", "white");

svg.append("line")
    .attr("x1", xScale(percentPoc))
    .attr("x2", xScale(percentPoc))
    .attr("y1", 0)
    .attr("y2", totalHeight - margin)
    .attr("stroke", "#0062F1")
    .attr("stroke-width", 4)
    .attr("stroke-dasharray", "4 4")

items.append("text")
    .attr("fill", d => getColor(d.name))
    .text(d => d3.format(".0%")(d.value))
    .attr("x", d => xScale(d.value) + 12)
    .attr("y", barHeight / 2)
    .attr("dominant-baseline", "middle")
    .style("font-weight", 700);

const lineLabel = svg.append("text")
    .attr("fill", "#0062F1")
    .attr("x", xScale(percentPoc) + 24)
    .attr("y", totalHeight - margin - barHeight / 2)
    .attr("dominant-baseline", "middle")

lineLabel.append("tspan").text("US Population");

lineLabel.append("tspan").text("41%").attr("dx", 12).style("font-weight", 700);