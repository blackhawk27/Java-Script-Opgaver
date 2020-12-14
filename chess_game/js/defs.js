//Definition for the pieces (integer)

var PIECES = { EMPTY : 0, wP : 1, wN : 2, wB : 3, wR : 4, wQ : 5, wK : 6,
                          bP : 7, bN : 8, bB : 9, bR : 10, bQ : 11, bK : 12 };
// Virker ikke med const, nogle versioner af serch engines
// debugging = PICES.EMPTY (er feltet tomt?)
// if x == PICES.bk (hvis du vil tjekke om der er en sort konge)


// Board square numbers (Felter på mit skakbræt) Skal bruges når jeg laver loops
var BRD_SQ_NUM = 120;

// Lodret ||
var FILES = {
    FILE_A : 0, FILE_B : 1, FILE_C : 2, FILE_D : 3,
    FILE_E : 4, FILE_F : 5, FILE_G : 6, FILE_H : 7, FILE_NONE : 8
};

// Vandret --
var RANKS = {
    RANK_1 : 0, RANK_2 : 1, RANK_3 : 2, RANK_4 : 3,
    RANK_5 : 4, RANK_6 : 5, RANK_7 : 6, RANK_8 : 7, RANK_NONE : 8
};

// debugging eks. = RANKS.RANK_8


var COLOURS = { WHITE : 0, BLACK : 1, BOTH : 2 };

// Hvis du vil skifte siden (side = side ^ 1;) - (side ^= 1;) det er meget let
// 0^0 = 0 --- 1^0 = 0 --- 1^1 = 1 --- 2^0 = 0 --- 1^2 = 1

var CASTLEBIT = { WKCA : 1, WQCA : 2, BKCA : 4, BQCA : 8 };
// WKCA = White king side Castle
// WQCA = White Queen side Castle
// BKCA = Black King side Castle
// BQCA = Black Queen side Castle

var SQUARES = {
    // i mit array på 120 er den første linje placeret på disse felter
    A1 : 21, B1 : 22, C1 : 23, D1 : 24, E1 : 25, F1 : 26, G1 : 27, H1 : 28,
    // Sidste linje af mit skakbræt
    A8 : 91, B8 : 92, C8 : 93, D8 : 94, E8 : 95, F8 : 96, G8 : 97, H8 : 98,
    // felter der slutter mit skakbræt i arayet på 120
    NO_SQ : 99, OFFBOARD : 100
};

var BOOL = { FALSE : 0, TRUE : 1}; // BOOL.FALSE

var MAXGAMEMOVES = 2048;
var MAXPOSITIONMOVES = 256;
var MAXDEPTH = 64;

var FilesBrd = new Array(BRD_SQ_NUM);
var RanksBrd = new Array(BRD_SQ_NUM);


function FR2SQ(f,r) {
 	return ( (21 + (f) ) + ( (r) * 10 ) );
}



// Dette er bare noget kode for at gøre det lettere senere hen når jeg skal loope



var PieceBig = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
// Big Piece = Pawn
var PieceMaj = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
// Major Piece = Queen or rook
var PieceMin = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
// Minor Piece = Bishop or Knight
var PieceVal= [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000  ];
// Piece value = i hundrede af en bonde
// tomt = 0, Bonde = 100, Knight = 325, bishops = 325, rook = 550, Queen = 1000, King = 50000

var PieceCol = [ COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,
    COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK ];
// Bare endu et datasæt med White eller Black
	
var PiecePawn = [ BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];	
// the true or false again, to check if the piece is a Pawn, Knight, King, Rook, Queen, Bishop

var PieceKnight = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];

var PieceKing = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE ];

var PieceRookQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];

var PieceBishopQueen = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE ];

var PieceSlides = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE ];
// Does the piece slide? 

// Alt dette er bare for at tjekke for de forskellige brikker og når vi skal lave træk senere hen.
// Bare indexer ud fra vores piece konstanter i toppen

// Pce * 120 + sq = unikt index for hver pice og sq
var PieceKeys = new Array(14*120);
var SideKey;
var CastleKeys = new Array(16); // 16 fordi castle perm = 1111 = 15

var Sq120ToSq64 = new Array(BRD_SQ_NUM);
var Sq64ToSq120 = new Array(64);

// Ny problem stilling, Hvordan udnøtter man alle 8 bits? jeg har brug for en randomizer 
// der skubber tallende til venstre.

function RAND_32() {

    return (Math.floor((Math.random()*255)+1) << 23) |  (Math.floor((Math.random()*255)+1) << 16)
    | (Math.floor((Math.random()*255)+1) << 8) | Math.floor((Math.random()*255)+1);
}

// denne funktion siger lad os få et SQ64 for et sq120 ved at bruge vores Sq120ToSq64 Array
function SQ64(sq120) {
    return Sq120ToSq64[(sq120)];
}
// denne funktion siger lad os få et SQ120 af et 64 basered index sq
function SQ120(sq64) {
    return Sq64ToSq120[(sq64)];
}