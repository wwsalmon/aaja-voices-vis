const width = 800;
const margin = 24;
const singleWidth = (width - (5 * margin)) / 4;
const squaresPerRow = 5;
const squareMargin = 4;
const squareWidth = singleWidth / squaresPerRow - squareMargin;
const labelHeight = 48;
const legendSquareWidth = 16;
const legendMargin = 8;

const demoLabels = {
    "asian": "Asian American",
    "hispaniclatino": "Hispanic or Latino",
    "black": "Black",
    "nativeamer": "Native American",
    "mena": "Middle Eastern or North African",
};

const demoPercentages = {
    "asian": 0.061,
    "black": 0.136,
    "hispaniclatino": 0.189,
    "white": 0.593,
}

const pocPercentage = 1 - demoPercentages["white"];

const labels = {
    "Pulitzer": "Pulitzer Prize",
    "Peabody": "Peabody Awards",
    "Livingston": "Livingston Awards",
    "Loeb": "Loeb Awards",
};

const judgeType = {
    "Pulitzer": "Board member",
    "Peabody": "Board of jurors",
    "Livingston": "National judge",
    "Loeb": "Final judge",
}

function render(label) {
    const svg = d3.select("svg");

    d3.csv("../judges.csv").then(data => {
        const tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("padding", "8px")
            .style("border", "1px solid black")
            .style("display", "none")
            .style("max-width", "200px")
            .style("line-height", "1.5");

        const tooltipName = tooltip.append("div").style("margin", "10px 0");
        tooltipName.append("span").text("Name: ").style("font-weight", 700);
        const tooltipNameInner = tooltipName.append("span");
        const tooltipTitle = tooltip.append("div").style("margin", "10px 0");
        tooltipTitle.append("span").text("Title: ").style("font-weight", 700);
        const tooltipTitleInner = tooltipTitle.append("span");
        const tooltipOrg = tooltip.append("div").style("margin", "10px 0");
        tooltipOrg.append("span").text("Organization: ").style("font-weight", 700);
        const tooltipOrgInner = tooltipOrg.append("span");
        const tooltipRace = tooltip.append("div").style("margin", "10px 0");
        tooltipRace.append("span").text("Race/ethnicity: ").style("font-weight", 700);
        const tooltipRaceInner = tooltipRace.append("span");

        const containers = svg
            .attr("viewBox", `0 0 ${width} 300`)
            .style("width", "100%")
            .selectAll("g.awardContainer")
            .data(Object.keys(labels))
            .enter()
            .append("g")
            .style("transform", (d, i) => `translate(${margin + i * (singleWidth + margin)}px, 96px)`);

        containers.append("text")
            .attr("dominant-baseline", "hanging")
            .text(d => labels[d]);

        containers.append("text")
            .attr("dominant-baseline", "hanging")
            .style("opacity", 0.5)
            .attr("y", 20)
            .text(d => judgeType[d]);

        containers.selectAll("rect.judge")
            .data(d => data.filter(x => x.award === d).sort((a, b) => +(b.responded || !!b.source) - +(a.responded || !!a.source)).sort((a, b) => +b[label] - +a[label]))
            .enter()
            .append("rect")
            .attr("width", squareWidth)
            .attr("height", squareWidth)
            .attr("rx", 4)
            .attr("x", (d, i) => (i % squaresPerRow) * singleWidth / squaresPerRow)
            .attr("y", (d, i) => Math.floor(i / squaresPerRow) * (singleWidth / squaresPerRow) + labelHeight)
            .attr("fill", d => !!d[label] ? "#0062F1" : (d.responded || d.source) ? "#bbb" : "#dac6c6")
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this).attr("fill", !!d[label] ? "#00378b" : "gray");

                tooltip
                    .style("left", Math.min(event.pageX + 8, window.innerWidth - 200) + "px")
                    .style("top", event.pageY + 8 + "px")
                    .style("display", "block");

                if (d.title) {
                    tooltipTitle.style("display", "block");
                    tooltipTitleInner.text(d.title);
                }

                if (d.organization) {
                    tooltipOrg.style("display", "block");
                    tooltipOrgInner.text(d.organization);
                }

                tooltipNameInner.text(d.name);

                if (!d.responded && !d.source) {
                    tooltipRaceInner.text(`Unknown (${d.declined ? "declined to respond" : "did not respond"})`);
                } else {
                    let races = [];
                    for (let label of Object.keys(demoLabels)) {
                        if (d[label]) races.push(demoLabels[label]);
                    }
                    if (!races.length) races.push("White");
                    let raceText = races.join(", ");
                    tooltipRaceInner.text(races.join(", "));
                }
            })
            .on("mousemove", function(event) {
                tooltip
                    .style("left", Math.min(event.pageX + 8, window.innerWidth - 200) + "px")
                    .style("top", event.pageY + 8 + "px");
            })
            .on("mouseout", function(e, d) {
                d3.select(this).attr("fill", !!d[label] ? "#0062F1" : (d.responded || d.source) ? "#bbb" : "#dac6c6");
                tooltip.style("display", "none");

                tooltipTitle.style("display", "none");
                tooltipOrg.style("display", "none");
            });

        containers.append("rect")
            .attr("width", d => demoPercentages[label] * data.filter(x => x.award === d).length * singleWidth / squaresPerRow)
            .attr("height", squareWidth + 2)
            .attr("x", -1)
            .attr("y", labelHeight - 1)
            .attr("stroke", "#222")
            .attr("stroke-width", 3)
            .attr("fill", "transparent")
            .attr("rx", 4)
            .attr("pointer-events", "none");

        const legend = svg.append("g")
            .style("transform", "translateY(4px)");

        const legendProportional = legend.append("g").style("transform", `translateY(28px)`);

        legendProportional.append("rect")
            .attr("width", legendSquareWidth - 1.5)
            .attr("height", legendSquareWidth - 1.5)
            .attr("stroke", "#222")
            .attr("stroke-width", 3)
            .attr("stroke-alignment", "inner")
            .attr("fill", "transparent")
            .attr("rx", 4)
            .attr("x", margin + 0.75);

        legendProportional.append("text")
            .text(`If proportional to US population (${d3.format(".0%")(demoPercentages[label])})`)
            .style("opacity", 0.5)
            .attr("dominant-baseline", "middle")
            .attr("x", margin + squareWidth + legendMargin)
            .attr("y", (legendSquareWidth) / 2);

        const legendHighlight = legend.append("g");

        legendHighlight.append("rect")
            .attr("width", legendSquareWidth)
            .attr("height", legendSquareWidth)
            .attr("fill", "#0062F1")
            .attr("rx", 4)
            .attr("x", margin);

        legendHighlight.append("text")
            .text(demoLabels[label])
            .style("opacity", 0.5)
            .attr("dominant-baseline", "middle")
            .attr("x", margin + squareWidth + legendMargin)
            .attr("y", (legendSquareWidth) / 2);
    });
}
