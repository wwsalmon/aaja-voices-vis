const svg = d3.select("svg");

const width = 800;
const margin = 24;
const singleWidth = (width - (3 * margin)) / 4;
const squaresPerRow = 8;
const squareMargin = 4;
const squareWidth = singleWidth / squaresPerRow - squareMargin;
const labelHeight = 24;

const labels = {
    "Pulitzer": "Pulitzer Prize",
    "Peabody": "Peabody Awards",
    "Livingston": "Livingston Awards",
    "Loeb": "Loeb Awards",
};

d3.json("./judges.json").then(data => {
    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("padding", "8px")
        .style("border", "1px solid black")
        .style("display", "none");

    const containers = svg
        .attr("viewBox", `0 0 ${width} 200`)
        .style("width", "100%")
        .selectAll("g.awardContainer")
        .data(Object.keys(labels))
        .enter()
        .append("g")
        .style("transform", (d, i) => `translateX(${i * (singleWidth + margin)}px)`);

    containers.append("text")
        .attr("dominant-baseline", "hanging")
        .text(d => labels[d]);

    containers.selectAll("rect.judge")
        .data(d => data.filter(x => x.award === d))
        .enter()
        .append("rect")
        .attr("width", squareWidth)
        .attr("height", squareWidth)
        .attr("x", (d, i) => (i % squaresPerRow) * singleWidth / squaresPerRow)
        .attr("y", (d, i) => Math.floor(i / squaresPerRow) * (singleWidth / squaresPerRow) + labelHeight)
        .attr("fill", "black")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "gray");

            tooltip
                .style("left", Math.min(event.pageX + 8, window.innerWidth - 200) + "px")
                .style("top", event.pageY + 8 + "px")
                .style("display", "block")
                .text(d.name + ((d.title || d.organization) && ` | ${d.title && `${d.title}, `}${d.organization}`));
        })
        .on("mousemove", function(event) {
            tooltip
                .style("left", Math.min(event.pageX + 8, window.innerWidth - 200) + "px")
                .style("top", event.pageY + 8 + "px");
        })
        .on("mouseout", function(e, d) {
            d3.select(this).attr("fill", "black");
            tooltip.style("display", "none");
        });;
});

const awardCounts = {
    "Pulitzer Prize": 19,
    "Livingston Awards": 10,
    "Loeb Awards": 22,
    "Peabody Awards": 20,
};

