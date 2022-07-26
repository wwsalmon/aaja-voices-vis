const width = 800;
const margin = 24;
const singleWidth = (width - (5 * margin)) / 4;
const squaresPerRow = 5;
const squareMargin = 4;
const squareWidth = singleWidth / squaresPerRow - squareMargin;
const labelHeight = 48;

const labels = {
    "Pulitzer": "Pulitzer Prize",
    "Peabody": "Peabody Awards",
    "Livingston": "Livingston Awards",
    "Loeb": "Loeb Awards",
};

const judgeType = {
    "Pulitzer": "Board member",
    "Peabody": "Judge",
    "Livingston": "National judge",
    "Loeb": "Final judge",
}

function render(highlight, boxPercent) {
    const svg = d3.select("svg");

    d3.json("./judges.json").then(data => {
        const tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("padding", "8px")
            .style("border", "1px solid black")
            .style("display", "none");

        const containers = svg
            .attr("viewBox", `0 0 ${width} 300`)
            .style("width", "100%")
            .selectAll("g.awardContainer")
            .data(Object.keys(labels))
            .enter()
            .append("g")
            .style("transform", (d, i) => `translateX(${margin + i * (singleWidth + margin)}px)`);

        containers.append("text")
            .attr("dominant-baseline", "hanging")
            .text(d => labels[d]);

        containers.append("text")
            .attr("dominant-baseline", "hanging")
            .style("opacity", 0.5)
            .attr("y", 20)
            .text(d => judgeType[d]);

        containers.selectAll("rect.judge")
            .data(d => data.filter(x => x.award === d).sort((a, b) => +highlight.includes(b.name) - +highlight.includes(a.name)))
            .enter()
            .append("rect")
            .attr("width", squareWidth)
            .attr("height", squareWidth)
            .attr("rx", 4)
            .attr("x", (d, i) => (i % squaresPerRow) * singleWidth / squaresPerRow)
            .attr("y", (d, i) => Math.floor(i / squaresPerRow) * (singleWidth / squaresPerRow) + labelHeight)
            .attr("fill", d => highlight.includes(d.name) ? "#0062F1" : "#bbb")
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
                d3.select(this).attr("fill", highlight.includes(d.name) ? "#0062F1" : "#bbb");
                tooltip.style("display", "none");
            });;

        containers.append("rect")
            .attr("width", d => boxPercent * data.filter(x => x.award === d).length * singleWidth / squaresPerRow)
            .attr("height", squareWidth + 2)
            .attr("x", -1)
            .attr("y", labelHeight - 1)
            .attr("stroke", "#a13b58")
            .style("opacity", 0.5)
            // .attr("stroke-dasharray", "3 3")
            .attr("stroke-width", 3)
            .attr("fill", "transparent")
            .attr("pointer-events", "none");

        svg.append("rect")
            .attr("width", squareWidth - 2)
            .attr("height", squareWidth - 2)
            .attr("stroke", "#a13b58")
            .style("opacity", 0.5)
            .attr("stroke-width", 3)
            .attr("fill", "transparent")
            .attr("x", margin)
            .attr("y", 216);

        svg.append("text")
            .text(`If proportional to US population (${d3.format(".0%")(boxPercent)})`)
            .attr("dominant-baseline", "middle")
            .attr("x", margin + squareWidth + 16)
            .attr("y", 216 + (squareWidth - 2) / 2);
    });
}
