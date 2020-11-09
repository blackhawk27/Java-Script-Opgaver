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

var SQUARES = {
    // i mit array på 120 er den første linje placeret på disse felter
    A1 : 21, B1 : 22, C1 : 23, D1 : 24, E1 : 25, F1 : 26, G1 : 27, H1 : 28,
    // Sidste linje af mit skakbræt
    A8 : 91, B8 : 92, C8 : 93, D8 : 94, E8 : 95, F8 : 96, G8 : 97, H8 : 98,
    // felter der slutter mit skakbræt i arayet på 120
    N0_SQ : 99, OFFBOARD : 100
};

var BOOL = { FALSE : 0, TRUE : 1}; // BOOL.FALSE