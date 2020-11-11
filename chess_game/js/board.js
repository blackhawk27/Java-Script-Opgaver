var GameBoard= {};

GameBoard.pieces = new Array(BRD_SQ_NUM);
GameBoard.side = COLOUR.WHITE;
GameBoard.fiftyMove = 0; // Every time a move is made i increment the 50 by one (hvis fiftyMove reglen rammer 100 bliver det automatisk uafgjordt)
/* The fifty move rule (hvis du ikke er bekendt med den)
En spiller kan kræve en uafgjordt kamp, hvis begge spillere har lavet 50 træk uden:
At en bonde (pawn) er blevet blevet rykket og der ikke er en der har taget en brik (capture)
*/
GameBoard.hisPly = 0; // Holder styr på alle de træk der bliver lavet i spillet, 1/2 = kun for den ene (hvid eller sort) 1 træk = 1 træk for begge
GameBoard.ply = 0; // Antal halve træk der bliver lavet i søge træet - Det er til en feature så man kan gå et træk tilbage eller frem
GameBoard.castlePem = 0;