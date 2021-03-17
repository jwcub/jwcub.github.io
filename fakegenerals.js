let size = 20;
let gm = [];
let selectNode = [];
function getLandByXy(x, y) {
    return document.getElementById("td-" + ((x - 1) * size + y));
}
function makeSelect(x, y) {
    if (x > size || y > size || x <= 0 || y <= 0) return;
    if (selectNode.length !== 0) {
        lastx = selectNode[0]
        lasty = selectNode[1]
        if (lasty != 1) getLandByXy(lastx, lasty - 1).classList.remove("selected");
        if (lasty != size) getLandByXy(lastx, lasty + 1).classList.remove("selected");
        getLandByXy(lastx - 1, lasty).classList.remove("selected");
        getLandByXy(lastx + 1, lasty).classList.remove("selected");
    }
    selectNode[0] = x;
    selectNode[1] = y;
    if (y != 1) getLandByXy(x, y - 1).classList.add("selected");
    if (y != size) getLandByXy(x, y + 1).classList.add("selected");
    getLandByXy(x - 1, y).classList.add("selected");
    getLandByXy(x + 1, y).classList.add("selected");
}
function makeBoard() {
    let m = document.getElementById("m");
    m.innerHTML = "";
    var str = "";
    str += "<tbody>";
    for (var i = 1; i <= size; ++i) {
        str += "<tr>";
        for (var j = 1; j <= size; ++j) {
            str += "<td id=\"td-" + ((i - 1) * size + j) + "\" class=\"unshown\"></td>";
        }
        str += "</tr>";
    }
    str += "</tbody>";
    m.innerHTML = str;
    for (var i = 1; i <= size; ++i) {
        for (var j = 1; j <= size; ++j) {
            document.getElementById("td-" + String((i - 1) * size + j)).onclick = function () {
                var id = Number(this.id.substr(3));
                var x = Math.floor((id - 1) / size) + 1, y = Number((((id % size) == 0) ? size : (id % size)));
                // if (gm[x][y].color == myColor) {
                //     makeSelect(x, y);
                // }
                makeSelect(x, y);
            }
        }
    }
}
makeBoard()