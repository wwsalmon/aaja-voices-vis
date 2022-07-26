const width = 700;
const yearWidth = 64;
const numCirclesPerRow = 9;
const circlePadding = 8;
const lineWidth = 4;
const lineHeight = 48;

const circleWidth = (width - yearWidth) / numCirclesPerRow;
const circleRadius = (circleWidth / 2) - circlePadding;



d3.json("pulitzers.json").then(data => {
    const height = circleWidth * (Math.floor(data.length / numCirclesPerRow)) + 2 * circleRadius + lineHeight;

    const svg = d3
        .select("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("width", "100%")
        .style("max-width", "800px")
        .style("display", "block");

    console.log(data);

    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("padding", "8px")
        .style("border", "1px solid black")
        .style("display", "none");

    const years = svg.append("g");

    const judges = svg.append("g")
        .style("transform", `translateX(${yearWidth}px)`);

    const labelYears = data
        .map((d, i) => ({year: d.board_years[0], index: i}))
        .filter((d, i, a) => i === 0 || Math.floor(d.year / 10) !== Math.floor(a[i - 1].year / 10))
        .filter((d, i, a) => i === 0 || Math.floor(d.index / numCirclesPerRow) > Math.floor(a[i - 1].index / numCirclesPerRow))
        .filter((d, i, a) => i === 0 || Math.floor(d.year / 10) !== Math.floor(a[i-1].year / 10));

    judges.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", circleRadius)
        .attr("fill", (d, i) => {
            if (labelYears.some(x => x.index === i)) {
                years.append("text")
                    .text(i === 0 ? d.board_years[0] : Math.floor(d.board_years[0] / 10) * 10)
                    .attr("y", circleWidth * (Math.floor(i / numCirclesPerRow)))
                    .attr("dominant-baseline", "hanging")
            }

            if (d.name === "Viet Thanh Nguyen") {
                console.log("vtn");

                judges.append("rect")
                    .attr("x", circleWidth * (i % numCirclesPerRow) + circleRadius - lineWidth / 2)
                    .attr("y", circleWidth * (Math.floor(i / numCirclesPerRow)) + 2 * circleRadius)
                    .attr("width", lineWidth)
                    .attr("height", lineHeight)
                    .attr("fill", "red");

                return "red";
            }

            return "black";
        })
        .attr("cx", (d, i) => circleWidth * (i % numCirclesPerRow) + circleRadius)
        .attr("cy", (d, i) => circleWidth * (Math.floor(i / numCirclesPerRow)) + circleRadius)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "gray");

            tooltip
                .style("left", Math.min(event.pageX + 8, window.innerWidth - 200) + "px")
                .style("top", event.pageY + 8 + "px")
                .style("display", "block")
                .text(d.name + ` (on board ${d.board_years[0] - 1} - ${d.board_years[d.board_years.length - 1]})`);
        })
        .on("mousemove", function(event) {
            tooltip
                .style("left", Math.min(event.pageX + 8, window.innerWidth - 200) + "px")
                .style("top", event.pageY + 8 + "px");
        })
        .on("mouseout", function(e, d) {
            d3.select(this).attr("fill", d.name === "Viet Thanh Nguyen" ? "red" : "black");
            tooltip.style("display", "none");
        });
}).catch(e => {
    console.log(e);
})

console.log("test");