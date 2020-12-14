function PCEINDEX (pce, pceNum) {
	return (pce * 10 + pceNum)
}


var GameBoard= {};

GameBoard.pieces = new Array(BRD_SQ_NUM);
GameBoard.side = COLOURS.WHITE;
GameBoard.fiftyMove = 0; // Every time a move is made i increment the 50 by one (hvis fiftyMove reglen rammer 100 bliver det automatisk uafgjordt)
/* The fifty move rule (hvis du ikke er bekendt med den)
En spiller kan kræve en uafgjordt kamp, hvis begge spillere har lavet 50 træk uden:
At en bonde (pawn) er blevet blevet rykket og der ikke er en der har taget en brik (capture)
*/
GameBoard.hisPly = 0; // Holder styr på alle de træk der bliver lavet i spillet, 1/2 = kun for den ene (hvid eller sort) 1 træk = 1 træk for begge
GameBoard.ply = 0; // Antal halve træk der bliver lavet i søge træet - Det er til en feature så man kan gå et træk tilbage eller frem
GameBoard.enPas = 0;
GameBoard.castlePem = 0;
/*
Der er mange måder at lagre data på, men jeg har valgt at bruge binær kode.

WKCA = 0001
WQCA = 0010
BKCA = 0100
BQCA = 1000

1101 = kan WKCA, kan ikke WQCA, kan BKCA, kan BQCA

hvis sort bevægede et tårn (rook), så vil =
0101
Det betyder at = kan WKCA, kan ikke WQCA, kan BKCA, kan ikke BQCA
Fra venstre til højre = 8 - 4 - 2 - 1

eks. 1101 = 13

Dette er en måde at lave de fire castling permissions på, der er kort og elagant.
*/
GameBoard.material = new Array(2); // White, Black material of pieces
GameBoard.pceNum = new Array(13); // indexed by Piece
GameBoard.pList = new Array(14 * 10); // der skal være plads i vores piece list
GameBoard.posKey = 0;


// Alt dette gør så hvis jeg har 8 bonder på brættet, så skal jeg kun kigge 8 gange i min pList efter en position

/*

loop (pieces[])                   // Loop igennem alle vores brikker
if(piece on sq == Side tomove)    // For hver square siger vi er der en brik på denne square, hvis ja er det den samme farve som den den står på
then genmoves() for piece on sq   // Hvis ja generer træk for at rykke hen til den square 

Problemet med denne kode fandt jeg ud af at, selvom jeg ændret BRD_SQ_NUM(120) til 64. Så vil hver side højst have 16 brikke på skak brættet
Og i gennemsnit er der nok 10 brikker på brættet, så 54 brikker er tomme, eller han din modstanders brikker på dem.
Så jeg vil komme til at gøre en stor unødig mængde looping.
-------------------------------------------------------------------------------------------------------------------------------------------------------
Løsning:

Jeg får brug for en array der holder styr på mine piece numbers, så hvor mange af hver type brik er der.
Det er index baseret så 1 = white pawn eller 3 = white bishop

Fra min piece list vil jeg gerne vide hvilken square brikken er på, 
så jeg kan få rykket min brik over på en anden square.


Så placering for vores brik = brik type array [Sat til et givent index fx. 3]

sqOfpiece = PlistArray[index];

index?

Man kan max have 10 af en type brik på boardet på samme tid (Knight, Bishop eller Rook).

wP = 1 dette er dens brik type

10 = fordi du max kan have 10 af en brik type på brættet på en gang

Så jeg vil gerne have at fra og med den square hvor vores wP står på, er de næste 9 squares så til rådighed
for den type brik, og i dette tilfælde wP

wP * 10 + wPNum -> 0 based index of num of pieces(GameBoard.pceNum)
wN * 10 + wNnum

say we have 4 white pawns GameBoard.pceNum[wP] = 4

for(pceNum = 0; pceNum < GameBoard.pceNum[wP]; ++pceNum) {
	sq = PlistArray[wP * 10 + pceNum]

}

sq1 = PlistArray[wP * 10 + 0]
sq2 = PlistArray[wP * 10 + 1]
sq3 = PlistArray[wP * 10 + 2]
sq4 = PlistArray[wP * 10 + 3]

wP 10 -> 19
*/

GameBoard.moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES);
GameBoard.moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES);
GameBoard.moveListStart = new Array(MAXDEPTH);

function GeneratePosKey() {

	var sq = 0;
	var finalKey = 0;
	var piece = PIECES.EMPTY;

	for(sq = 0; sq < BRD_SQ_NUM; ++sq) { // Loop igennem 0-120
		piece = GameBoard.pieces[sq]; // Hvis der er et piece på det specifikke sq
		if(piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) { // og det ikke er tomt eller af brættet, så betyder det at vi må have et piece
			finalKey ^= PieceKeys[(piece * 120) + sq]; // derfor hasher jeg ind min randomkey (piece*120) + sq så tallet er unikt
		}
	}

	// hvis siden der skal rykke er hvid, så hasher jeg ind min SideKey
	if(GameBoard.side == COLOURS.WHITE) {
		finalKey ^= SideKey;
	}

	// hvis enPas ikke er en NO_SQ, så altså der er blevet sat en enpas på denne pos så hasher jeg også enpas ind
	if(GameBoard.enPas != SQUARES.NO_SQ) {
		finalKey ^= PieceKeys[GameBoard.enPas];
	}
	// Så hasher jeg ind Castle Permissionsne 
	finalKey ^= CastleKeys[GameBoard.castlePerm];
	// også kan jeg return min finalKey ;-)
	return finalKey;

}


function ResetBoard() {

	var index = 0;

	for(index = 0; index < BRD_SQ_NUM; ++index) {
		GameBoard.pieces[index] = SQUARES.OFFBOARD;
	}

	for(index = 0; index < 64; ++index) {
		GameBoard.pieces[SQ120(index)] = PIECES.EMPTY;
	}

	for(index = 0; index < 14 * 120; ++index) {
		GameBoard.pList[index] = PIECES.EMPTY;
	}

	for(index = 0; index < 2; ++index) {
		GameBoard.material[index] = 0;
	}

	for(index = 0; index < 13; ++index) {
		GameBoard.pceNum[index] = 0;
	}

	GameBoard.side = COLOURS.BOTH;
	GameBoard.enPas = SQUARES.NO_SQ;
	GameBoard.fiftyMove = 0; 
	GameBoard.hisPly = 0;
	GameBoard.ply = 0; 
	GameBoard.castlePem = 0;
	GameBoard.posKey = 0;
	GameBoard.moveListStart[GameBoard.ply] = 0;
}






function ParseFen(fen) {

	ResetBoard();
}

























