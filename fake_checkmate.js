let size = 20;
let gm = [];
let selectNode = [];
let playernum = 8;
let myColor = 1;
let symbolStatus = [];
let start = true;
let watching = true;
const color = ['grey', 'blue', 'red', 'green', 'orange', 'pink', 'purple', 'chocolate', 'maroon'];
const tp = [null, 'crown', null, 'city', 'mountain', 'empty-city', 'obstacle'];
let isplayeralive = [];
let movement = [];
let round = 0;
let halfTag = [];
let it = 0;
function generateRandomMap(player) {
    function rnd(num) {
        var t = Math.round(Math.random() * num);
        return (t == 0) ? num : t
    }
    function Astar(gm, x, y, tar_x, tar_y) {
        let vis = [];
        let q = [];
        let d = [[1, -1, 0, 0], [0, 0, 1, -1]];
        for (let i = 1; i <= size; ++i) vis[i] = [];
        q.push([x, y, 0]);
        vis[x][y] = 1;
        while (q.length > 0) {
            let tx = q[0][0], ty = q[0][1], step = q[0][2];
            q = q.slice(1);
            for (let j = 0; j < 4; ++j) {
                let tx2 = tx + d[0][j], ty2 = ty + d[1][j];
                if (tx2 > size || ty2 > size || tx2 <= 0 || ty2 <= 0 || gm[tx2][ty2].type == 4 || vis[tx2][ty2]) continue;
                vis[tx2][ty2] = 1;
                q.push([tx2, ty2, step + 1]);
                if (tx2 == tar_x && ty2 == tar_y)
                    return step + 1;
            }
        }
        return -1;
    }
    if (player == 2) size = 10;
    else size = 20;
    for (let i = 0; i <= size; ++i) {
        gm[i] = [];
        for (let j = 0; j <= size; ++j) {
            gm[i][j] = { "color": 0, "type": 0, "amount": 0 }; // 空白图
        }
    }
    gm[0][0] = { size: size };
    for (var i = 1; i <= 0.13 * size * size; ++i) {
        for (var tt = 1; tt <= 10; ++tt) rnd(size);
        var t1 = rnd(size),
            t2 = rnd(size);
        while (gm[t1][t2].type != 0) {
            t1 = rnd(size), t2 = rnd(size)
        }
        gm[t1][t2].type = 4
    }
    for (var i = 1; i <= 0.05 * size * size; ++i) {
        for (var tt = 1; tt <= 10; ++tt) rnd(size);
        var t1 = rnd(size),
            t2 = rnd(size);
        while (gm[t1][t2].type != 0) {
            t1 = rnd(size), t2 = rnd(size)
        }
        gm[t1][t2].type = 5;
        gm[t1][t2].amount = Number(rnd(10)) + 40;
    }
    let last = [];
    let calcTimes = 0;
    for (var i = 1; i <= player; ++i) {
        ++calcTimes;
        if (calcTimes >= 100) return generateRandomMap(player);
        var t1 = rnd(size - 2) + 1,
            t2 = rnd(size - 2) + 1;
        // 至少留一个方位有空
        while (gm[t1][t2].type != 0 || (gm[t1 + 1][t2].type != 0 && gm[t1 - 1][t2].type != 0 && gm[t1][t2 + 1].type != 0 && gm[t1][t2 + 1].type != 0)) {//  
            t1 = rnd(size - 2) + 1, t2 = rnd(size - 2) + 1;
        }

        if (i == 1) {
            gm[t1][t2].color = i;
            gm[t1][t2].amount = 1;
            gm[t1][t2].type = 1;
        } else {
            let flag = 0;
            for (let j = 0; j < last.length; ++j) {
                if (Astar(gm, t1, t2, last[j][0], last[j][1]) > 6) {
                    continue;
                }
                flag = 1;
                --i;
                break;
            }
            if (flag == 0) {
                gm[t1][t2].color = i;
                gm[t1][t2].amount = 1;
                gm[t1][t2].type = 1;
            }
        }
        last.push([t1, t2]);
    }
    gm[0][0].type = 1;
}
function generateMazeMap(player) {
    function rnd(num) {
        var t = Math.round(Math.random() * num);
        return (t == 0) ? num : t;
    }
    let id = [];
    let etot = 0;
    let edges = [];
    let vtot = [];
    let venum = [];
    if (player == 2) size = 9;
    else size = 19;
    for (let i = 0; i <= size; ++i) {
        gm[i] = [];
        venum[i] = [];
        for (let j = 0; j <= size; ++j) {
            gm[i][j] = { "color": 0, "type": 0, "amount": 0 }; // 空白图
        }
    }
    gm[0][0] = { size: size };
    for (let i = 1; i <= size; ++i) {
        for (let j = 1; j <= size; ++j) {
            if (i % 2 == 0 && j % 2 == 0) {
                gm[i][j].type = 4;
            }
            if (i % 2 == 1 && j % 2 == 1) {
                venum[i][j] = vtot;
                ++vtot;
            }
        }
    }
    for (let i = 1; i <= size; ++i) {
        for (let j = 1; j <= size; ++j) {
            let tmp1 = i - 1, tmp3 = j - 1, tmp4 = j + 1;
            let tmp2 = i + 1;

            if (i % 2 == 0 && j % 2 == 1) {
                venum[i][j] = etot;
                edges[etot] = { "a": venum[tmp1][j], "b": venum[tmp2][j], "w": 10 + Number(rnd(10)), "posa": i, "posb": j };
                ++etot;
            }
            if (i % 2 == 1 && j % 2 == 0) {
                venum[i][j] = etot;
                edges[etot] = { "a": venum[i][tmp3], "b": venum[i][tmp4], "w": 10 + Number(rnd(10)), "posa": i, "posb": j };
                ++etot;
            }
        }
    }
    function cmp(x, y) {
        return x.w - y.w;
    }
    function find(x) {
        if (x == id[x]) return x;
        id[x] = find(id[x]);
        return id[x];
    }
    edges.sort(cmp);
    for (let i = 0; i < vtot; i++)id[i] = i;
    for (let i = 0; i < etot; i++) {
        if (find(edges[i].a) != find(edges[i].b)) {
            id[find(edges[i].a)] = id[(edges[i].b)];
            gm[edges[i].posa][edges[i].posb].type = 5;
            gm[edges[i].posa][edges[i].posb].amount = 10;
        }
        else {
            gm[edges[i].posa][edges[i].posb].type = 4;
        }
    }
    let calcTimes = 0;
    for (var i = 1; i <= player; ++i) {
        ++calcTimes;
        if (calcTimes >= 100) return generateMazeMap(player);
        var t1 = rnd(size),
            t2 = rnd(size);
        while (1) {
            t1 = rnd(size), t2 = rnd(size);
            let tmpcnt = 0;
            if (t1 - 1 >= 1) {
                if (gm[t1 - 1][t2].type != 4) {
                    tmpcnt++;
                }
            }
            if (t2 - 1 >= 1) {
                if (gm[t1][t2 - 1].type != 4) {
                    tmpcnt++;
                }
            }
            if (t1 + 1 <= size) {
                if (gm[t1 + 1][t2].type != 4) {
                    tmpcnt++;
                }
            }
            if (t2 + 1 <= size) {
                if (gm[t1][t2 + 1].type != 4) {
                    tmpcnt++;
                }
            }
            if (gm[t1][t2].type == 0 && tmpcnt == 1) break;
        }
        gm[t1][t2].color = i;
        gm[t1][t2].amount = 1;
        gm[t1][t2].type = 1;
    }
    for (let i = 1; i <= (size * size) / 15; ++i) {
        let tryTime = 0;
        while (true) {
            ++tryTime;
            let x = rnd(size), y = rnd(size);
            if (tryTime >= 20) {
                break;
            }
            let flag = 0;
            let flagUD = 0, flagLR = 0;
            for (let t1 = -1; t1 <= 1; ++t1) {
                for (let t2 = -1; t2 <= 1; ++t2) {
                    if (t1 == 0 && t2 == 0) continue;
                    if (x + t1 > 0 && x + t1 <= size && y + t2 <= size) {
                        if (gm[x + t1][y + t2].type == 1) {
                            flag = 1;
                            break;
                        }
                    }
                }
                if (flag) break;
            }
            if (flag || x % 2 == y % 2) continue;
            if (gm[x][y].type == 4) {
                gm[x][y].type = 5;
                gm[x][y].amount = 10;
                break;
            }
        }
    }
    gm[0][0].type = 1;
}

function generateEmptyMap(player) {
    function rnd(num) {
        var t = Math.round(Math.random() * num);
        return (t == 0) ? num : t
    }
    function Astar(gm, x, y, tar_x, tar_y) {
        let vis = [];
        let q = [];
        let d = [[1, -1, 0, 0], [0, 0, 1, -1]];
        for (let i = 1; i <= size; ++i) vis[i] = [];
        q.push([x, y, 0]);
        vis[x][y] = 1;
        while (q.length > 0) {
            let tx = q[0][0], ty = q[0][1], step = q[0][2];
            q = q.slice(1);
            for (let j = 0; j < 4; ++j) {
                let tx2 = tx + d[0][j], ty2 = ty + d[1][j];
                if (tx2 > size || ty2 > size || tx2 <= 0 || ty2 <= 0 || gm[tx2][ty2].type == 4 || vis[tx2][ty2]) continue;
                vis[tx2][ty2] = 1;
                q.push([tx2, ty2, step + 1]);
                if (tx2 == tar_x && ty2 == tar_y)
                    return step + 1;
            }
        }
        return -1;
    }
    let size = 0;
    if (player == 2) size = 10;
    else size = 20;
    for (let i = 0; i <= size; ++i) {
        gm[i] = [];
        for (let j = 0; j <= size; ++j) {
            gm[i][j] = { "color": 0, "type": 0, "amount": 0 }; // 空白图
        }
    }
    gm[0][0] = { size: size };
    let last = [];
    let calcTimes = 0;
    for (var i = 1; i <= player; ++i) {
        ++calcTimes;
        if (calcTimes >= 100) return generateEmptyMap(player);
        var t1 = rnd(size - 2) + 1,
            t2 = rnd(size - 2) + 1;
        // 至少留一个方位有空
        while (gm[t1][t2].type != 0 || (gm[t1 + 1][t2].type != 0 && gm[t1 - 1][t2].type != 0 && gm[t1][t2 + 1].type != 0 && gm[t1][t2 + 1].type != 0)) {//  
            t1 = rnd(size - 2) + 1, t2 = rnd(size - 2) + 1;
        }

        if (i == 1) {
            gm[t1][t2].color = i;
            gm[t1][t2].amount = 1;
            gm[t1][t2].type = 1;
        } else {
            let flag = 0;
            for (let j = 0; j < last.length; ++j) {
                if (Astar(gm, t1, t2, last[j][0], last[j][1]) > 6) {
                    continue;
                }
                flag = 1;
                --i;
                break;
            }
            if (flag == 0) {
                gm[t1][t2].color = i;
                gm[t1][t2].amount = 1;
                gm[t1][t2].type = 1;
            }
        }
        last.push([t1, t2]);
    }
    gm[0][0].type = 1;
}
function makeSelect(ln, col) {
    if (ln > size || col > size || ln <= 0 || col <= 0) return;
    $("td").removeClass("selected");
    selectNode[0] = ln;
    selectNode[1] = col;
    if (col != 1) $("#td-" + Number(((ln - 1) * size + col - 1))).addClass("selected");
    if (col != size) $("#td-" + Number(((ln - 1) * size + col + 1))).addClass("selected");
    $("#td-" + Number(((ln - 2) * size + col))).addClass("selected");
    $("#td-" + Number(((ln) * size + col))).addClass("selected");
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
    $(m).append(str);
    for (var i = 1; i <= size; ++i) {
        for (var j = 1; j <= size; ++j) {
            $("#td-" + String((i - 1) * size + j))[0].onclick = function () {
                var id = Number(this.id.substr(3));
                var ln = Math.floor((id - 1) / size) + 1, col = Number((((id % size) == 0) ? size : (id % size)));
                if (gm[ln][col].color == myColor) {
                    makeSelect(ln, col);
                }
            }
        }
    }
}
function judgeShown(i, j) {
    let visiRound = 1;
    if (gm[0][0].type == 2) visiRound = 2;
    for (let t1 = -visiRound; t1 <= visiRound; ++t1) {
        for (let t2 = -visiRound; t2 <= visiRound; ++t2) {
            let ii = i + t1, jj = j + t2;
            if (ii <= 0 || jj <= 0 || ii > size || jj > size) continue;
            if (gm[ii][jj].color == myColor) return true;
        }
    }
    return false;
}
function reloadSymbol(i, j) {
    if (judgeShown(i, j) || !start || watching) {
        if (gm[i][j].type != symbolStatus[i][j].type) {
            let t = document.getElementById("td-" + String((i - 1) * size + j));
            if (symbolStatus[i][j].type != undefined)
                t.classList.remove(tp[symbolStatus[i][j].type]);
            t.classList.add(tp[gm[i][j].type]);
            symbolStatus[i][j].type = gm[i][j].type;
        }
    } else {
        let t = document.getElementById("td-" + String((i - 1) * size + j));
        if (symbolStatus[i][j].type != undefined)
            t.classList.remove(tp[symbolStatus[i][j].type]);
        symbolStatus[i][j].type = undefined;
        if (gm[i][j].type >= 3 && gm[i][j].type <= 5) {
            t.classList.add(tp[6]);
            symbolStatus[i][j].type = 6;
        }
    }
}
function showSymbol() {
    for (var i = 1; i <= size; ++i) {
        if (gm[i] == undefined) continue;
        for (var j = 1; j <= size; ++j) {
            reloadSymbol(i, j);
        }
    }
}
function updateSymbol() {
    for (let i = 1; i <= size; ++i) {
        symbolStatus[i] = [];
        for (let j = 1; j <= size; ++j) {
            symbolStatus[i][j] = { ele: document.getElementById("td-" + String((i - 1) * size + j)) };
        }
    }
}
function illu() {
    for (let i = 1; i <= size; ++i) {
        for (let j = 1; j <= size; ++j) {
            if (gm == 0) return;
            let d = symbolStatus[i][j].ele;
            if (gm[i][j].color == myColor && !symbolStatus[i][j].own) {
                d.classList.add("own");
            } else {
                d.classList.remove("own");
            }
            if (!start || judgeShown(i, j) || watching) {
                if (symbolStatus[i][j].amount != gm[i][j].amount) {
                    d.innerHTML = (gm[i][j].amount == 0) ? " " : gm[i][j].amount;
                    symbolStatus[i][j].amount = gm[i][j].amount;
                }
                if (symbolStatus[i][j].shown == undefined || symbolStatus[i][j].shown == false) {
                    d.classList.remove("unshown");
                    d.classList.add("shown");
                    symbolStatus[i][j].shown = true;
                }
                if (symbolStatus[i][j].color != gm[i][j].color) {
                    d.classList.remove('grey', 'blue', 'red', 'green', 'orange', 'pink', 'purple', 'chocolate', 'maroon');
                    d.classList.add(color[gm[i][j].color]);
                    symbolStatus[i][j].color = gm[i][j].color;
                }
            } else {
                if (symbolStatus[i][j].shown == undefined || symbolStatus[i][j].shown == true) {
                    d.classList.remove("shown");
                    d.classList.add("unshown");
                    symbolStatus[i][j].shown = false;
                }
                if (symbolStatus[i][j].color != undefined) {
                    d.classList.remove('grey', 'blue', 'red', 'green', 'orange', 'pink', 'purple', 'chocolate', 'maroon');
                    symbolStatus[i][j].color = undefined;
                }
                if (symbolStatus[i][j].amount != undefined) {
                    d.innerHTML = "";
                    symbolStatus[i][j].amount = undefined;
                }
            }
        }
    }
    showSymbol();
}
function combineBlock(f, t, cnt) {
    if (t.color == f.color) { //same color means combine
        t.amount += cnt;
        f.amount -= cnt;
    } else { // not same color need to do delete
        t.amount -= cnt;
        f.amount -= cnt;
        if (t.amount < 0) { // t was cleared
            if (t.type == 1) { // t was player's crown and the player was killed
                var tcolor = t.color;
                isplayeralive[tcolor] = false;
                for (var i = 1; i <= size; ++i) {
                    for (var j = 1; j <= size; ++j) {
                        if (gm[i][j].color == tcolor) {
                            gm[i][j].color = f.color;
                            if (gm[i][j].type == 1) {
                                gm[i][j].type = 3; // to a city
                            }
                        }
                    }
                }
            } else if (t.type == 5) { // trans to city 
                t.type = 3;
            } else if (t.type != 3) { // trans to road
                t.type = 2;
            }
            t.color = f.color;
            t.amount = -t.amount;
        }
    }
}
function Rank() {
    let playerInfo = [];
    if (gm == 0) return;
    for (let i = 1; i <= size; ++i) {
        for (let j = 1; j <= size; ++j) {
            if (gm[i][j].color != 0) {
                if (playerInfo[gm[i][j].color] == undefined) playerInfo[gm[i][j].color] = [0, 0, 0, gm[i][j].color];
                playerInfo[gm[i][j].color][0] += 1;
                playerInfo[gm[i][j].color][1] += gm[i][j].amount;
                playerInfo[gm[i][j].color][2] = gm[i][j].color;
            }
        }
    }
    playerInfo.sort(function (a, b) {
        if (a == undefined) return (b == undefined) ? 0 : -1;
        if (b == undefined) return 1;
        if (a[1] == b[1]) return b[0] - a[0];
        return b[1] - a[1];
    });
    let t = document.getElementById("info-content");
    t.innerHTML = "";
    let str = "";
    for (var i = 0; i < playerInfo.length; ++i) {
        if (playerInfo[i] == undefined) break;
        str += "<tr><td style='color: " + color[playerInfo[i][2]] + ";'>" + playerInfo[i][3] + "</td><td>" + Number(playerInfo[i][0]) + "</td><td>" + Number(playerInfo[i][1]) + "</td></tr>"
    }
    t.innerHTML = str;
}
function updateMap() {
    for (let k = 1; k <= playernum; ++k) {
        if (movement[k].length == 0) continue; // the movement is empty
        var mv = movement[k][0];
        if (mv[0] > size || mv[1] > size || mv[2] > size || mv[3] > size
            || mv[0] < 1 || mv[1] < 1 || mv[2] < 1 || mv[3] < 1 || (Math.abs(mv[0] - mv[2]) + Math.abs(mv[1] - mv[3])) > 1) {
            movement[k].shift();
            continue;
        }
        // 以上过滤用户输入
        var f = gm[mv[0]][mv[1]], t = gm[mv[2]][mv[3]];// from and to
        var cnt = ((mv[4] == 1) ? (Math.ceil((f.amount + 0.5) / 2)) : f.amount);// the amount that need to move
        cnt -= 1; // cannot move all
        if (f.color != k || cnt <= 0 || t.type == 4) { // wrong movement
            while (movement[k].length != 0) {
                let x1 = movement[k][0][0], x2 = movement[k][0][1];
                let y1 = movement[k][0][2], y2 = movement[k][0][3];
                if (gm[x1][x2].color != k || gm[x1][x2].type == 4 || gm[y1][y2].type == 4 || gm[x1][x2].amount <= 1) movement[k].shift();
                else break;
            }
            continue;
        }
        combineBlock(f, t, cnt);
        movement[k].shift();
    }
    Rank();
}
function alivePlayer() {
    let t = 0;
    for (let k = 1; k <= playernum; k++) {
        if (isplayeralive[k])
            t++;
    }
    return t;
}
function playerWinAnction() {
    winner = 0;
    for (let k = 1; k <= playernum; k++) {
        if (isplayeralive[k]) {
            winner = k;
            break;
        }
    }
    if (winner == 0)
        return;
    alert(winner + '赢了！')
    clearInterval(it);
    it = 0;
}
function nextRound() {
    round++;
    function addAmountCrown() {
        for (var i = 1; i <= size; ++i) {
            for (var j = 1; j <= size; ++j) {
                if (gm[i][j].type == 1) {
                    gm[i][j].amount++;
                }
            }
        }
    }
    function addAmountCity() {
        for (var i = 1; i <= size; ++i) {
            for (var j = 1; j <= size; ++j) {
                if (gm[i][j].type == 3)
                    gm[i][j].amount++;
            }
        }
    }
    function addAmountRoad() {
        for (var i = 1; i <= size; ++i) {
            for (var j = 1; j <= size; ++j) {
                if (gm[i][j].type == 2 && gm[i][j].color && gm[i][j].amount > 0)
                    gm[i][j].amount++;
            }
        }
    }

    if (alivePlayer() <= 1) {
        playerWinAnction();
        return;
    }

    if ((round % 10) == 0) addAmountRoad();
    addAmountCity(), addAmountCrown();
    updateMap();
}
function clearSelect() {
    $("td").removeClass("selected");
    selectNode[0] = selectNode[1] = 0;
}
function addMovement(x, y, player) {
    var t1 = selectNode[0] + x, t2 = selectNode[1] + y;
    if (t1 > size || t1 <= 0 || t2 > size || t2 <= 0) return;
    if (gm[t1][t2] == undefined || gm[t1][t2].type == 4) return;
    if (!halfTag[player]) movement[player].push([selectNode[0], selectNode[1], t1, t2, 0]);
    else movement[player].push([selectNode[0], selectNode[1], t1, t2, 1]), halfTag[player] = false;
    clearSelect();
    makeSelect(t1, t2);
}
document.onkeydown = function (event) {
    waitTime = 120;
    exit = false;
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (!e) return;
    if (e.keyCode == 32) { // space
        if (PRESS_SPACE_TIME == undefined || new Date().getTime() - PRESS_SPACE_TIME >= 500) {
            if (!gm) return;
            for (let i = 1; i <= size; ++i) {
                if (!gm[i]) return;
                for (let j = 1; j <= size; ++j) {
                    if (!gm[i][j]) return;
                    if (gm[i][j].color == myColor) {
                        makeSelect(i, j);
                        return;
                    }
                }
            }
            var PRESS_SPACE_TIME = new Date().getTime();
        }
    } else if (e.keyCode == 87) { // W
        addMovement(-1, 0, myColor);
        showSymbol();
    } else if (e.keyCode == 65) { // A
        addMovement(0, -1, myColor);
        showSymbol();
    } else if (e.keyCode == 83) { // S
        addMovement(1, 0, myColor);
        showSymbol();
    } else if (e.keyCode == 68) { // D
        addMovement(0, 1, myColor);
        showSymbol();
    } else if (e.keyCode == 81) { // Q
        movement[myColor] = [];
    } else if (e.keyCode == 90) { // Z
        halfTag[myColor] = !halfTag[myColor];
    } else if (e.keyCode == 38) { // ↑
        makeSelect(selectNode[0] - 1, selectNode[1]);
    } else if (e.keyCode == 40) { // ↓
        makeSelect(selectNode[0] + 1, selectNode[1]);
    } else if (e.keyCode == 37) { // ←
        makeSelect(selectNode[0], selectNode[1] - 1);
    } else if (e.keyCode == 39) { // →
        makeSelect(selectNode[0], selectNode[1] + 1);
    }
};
function main() {
    playernum = Number($("#playercount")[0].value)
    map = Number($("#map")[0].value)
    if (map == 1)
        generateRandomMap(playernum);
    else if (map == 2)
        generateMazeMap(playernum);
    else if (map == 3)
        generateEmptyMap(playernum);
    isplayeralive = [];
    movement = [];
    halfTag = [];
    for (let i = 0; i <= playernum; i++) {
        isplayeralive.push(true);
        movement.push([]);
        halfTag.push(false);
    }
    makeBoard();
    updateSymbol();
    it = setInterval(function () {
        nextRound();
        illu();
    }, 250);
}
$("#submit")[0].onclick = function () {
    if (it != 0)
        clearInterval(it);
    main()
}
