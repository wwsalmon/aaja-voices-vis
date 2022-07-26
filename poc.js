const populationLabel = "US Population";
const newsroomLabel = "US Newsroom staff";

const data = [
    {name: "Peabody Awards", label: "Judges (18)", value: 12 / 18},
    {name: populationLabel, label: "2020 census", value: 0.407},
    {name: "Pulitzer Prize", label: "Board members (19)", value: 7 / 19},
    {name: "Livingston Awards", label: "National judges (10)", value: 3 / 10},
    {name: "Loeb Awards", label: "Final judges (20)", value: 4 / 20},
    {name: newsroomLabel, label: "CJR, 2018", value: 0.17},
];

const getColor = (label) => label === populationLabel ? "#0062F1" : label === newsroomLabel ? "#F44C31" : "#222";

const width = 700;
const barHeight = 32;
const labelHeight = 24;
const margin = 32;
const unitHeight = margin + barHeight + labelHeight;
const totalHeight = data.length * unitHeight;

const xScale = d3.scaleLinear().range([0, width]).domain([0, 0.8]);

const svg = d3.select("svg").attr("viewBox", `0 0 ${width} ${totalHeight}`);

const items = svg.selectAll("g.item")
    .data(data)
    .enter()
    .append("g")
    .style("transform", (d, i) => `translateY(${i * unitHeight}px)`);

items.append("text")
    .text(d => d.name)
    .attr("dominant-baseline", "hanging")
    .attr("fill", d => getColor(d.name))
    .append("tspan")
    .text(d => d.label)
    .attr("dx", 12)
    .style("opacity", 0.5);

items.append("rect")
    .attr("width", d => xScale(d.value))
    .attr("height", barHeight)
    .attr("fill", d => getColor(d.name))
    .attr("y", labelHeight);

svg.append("line")
    .attr("x1", xScale(data.find(d => d.name === populationLabel).value))
    .attr("x2", xScale(data.find(d => d.name === populationLabel).value))
    .attr("y1", 0)
    .attr("y2", totalHeight - margin)
    .attr("stroke", "#0062F1")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "3 3")

items.append("text")
    .attr("fill", d => getColor(d.name))
    .text(d => d3.format(".0%")(d.value))
    .attr("x", d => xScale(d.value) + 12)
    .attr("y", labelHeight + barHeight / 2)
    .attr("dominant-baseline", "middle");