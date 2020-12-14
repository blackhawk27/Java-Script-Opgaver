$(function () {
    init();
    console.log("Main Init Called");

});

function init() {
    console.log("init() called");
}

/*

each pice is unique
Piece on Sq
Side to move
Castle = 16
EnPas = 64

posKey ^= RanNum for all pices on Sq
posKey ^= RanNum side... and so on

*/
/*
var pieces1 = RAND_32();
var pieces2 = RAND_32();
var pieces3 = RAND_32();
var pieces4 = RAND_32();

var key = 0;
key ^= pieces1;
key ^= pieces2;
key ^= pieces3;
key ^= pieces4;
console.log("key:" + key.toString(16));
key ^= pieces1;
console.log("piece1 out key :" + key.toString(16));
var key = 0;
key ^= pieces2;
key ^= pieces3;
key ^= pieces4;
console.log("build no piece1 :" + key.toString(16));
*/

function InitHashKeys() {
    var index = 0;
    for (index = 0; index < 14 * 120; ++index) {
        PieceKeys[index] = RAND_32();
    }

    SideKey = RAND_32();

    for(index = 0; index < 16; ++index) {
        CastleKeys[index] = RAND_32();
    }
}

function InitSq120To64() {

    var index = 0;
    var file = FILES.FILE_A;
    var rank = RANKS.RANK_1;
    var sq = SQUARES.A1;
    var sq64 = 0;

    // Reset
    for(index = 0; index < BRD_SQ_NUM; ++index) {
        Sq120ToSq64[index] = 65; // 65 fordi det er et index der ikke er på brættet
    }

    for(index = 0; index < 64; ++index) {
        Sq64ToSq120[index] = 120; // og 120 til det index jeg får igen, fordi dette er værdier jeg aldrig burde få fra arrayet, når jeg indexer korrekt. Sådan set bare et reset
    }

    for(rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {

        for(file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
            sq = FR2SQ(file,rank); // #1 loop (0,0) fordi FILE_A = 0, RANK_1 = 0
            Sq64ToSq120[sq64] = sq; // simpelt Array loop 0, 1... fordi [sq64(0)] + hvert loop + 1 = 21, 22, 23 osv. sq = SQUARES.A1 = 21 hvor .B1 = 22 osv.
            Sq120ToSq64[sq] = sq64; // sidste siger 0 = 0 og nu gør det hele igen med +1
            sq64++
        }
    }
}



function init() {
    console.log("init() called");
    InitFilesRankesBrd();
    InitHashKeys(); // vigtigt at huske at calle initHashKeys i init functionen, så de bliver udfuldt ved start af programmet.
}