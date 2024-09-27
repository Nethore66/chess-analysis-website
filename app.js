const board = Chessboard('board', {
    draggable: true,
    dropOffBoard: 'trash',
    sparePieces: false,
});

const chess = new Chess();
const stockfish = STOCKFISH();
let moves = [];
let accuracyP1 = 0;
let accuracyP2 = 0;

// Event listener for file input
document.getElementById('pgnInput').addEventListener('change', handleFileSelect);
document.getElementById('analyseBtn').addEventListener('click', analyzeGame);

function handleFileSelect(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function (e) {
        const pgn = e.target.result;
        chess.load_pgn(pgn);
        displayMoves();
    };
    
    reader.readAsText(file);
}

function displayMoves() {
    const movesEl = document.getElementById('moves');
    movesEl.innerHTML = '';
    moves = chess.history({ verbose: true });
    moves.forEach((move, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${move.from}-${move.to}`;
        movesEl.appendChild(li);
    });
}

function analyzeGame() {
    // Analyze each move with Stockfish
    let currentMove = 0;

    function nextMove() {
        if (currentMove >= moves.length) {
            calculateAccuracy();
            return;
        }

        stockfish.postMessage(`position startpos moves ${moves.slice(0, currentMove + 1).map(m => m.san).join(' ')}`);
        stockfish.postMessage('eval');
        
        stockfish.onmessage = function (e) {
            if (e.includes('info')) {
                // Process Stockfish output here and classify moves
                console.log(e);  // Analyze move feedback (score, etc.)
                currentMove++;
                nextMove();
            }
        };
    }

    nextMove();
}

function calculateAccuracy() {
    // Mock accuracy calculation for now
    accuracyP1 = Math.random() * 100;
    accuracyP2 = Math.random() * 100;
    document.getElementById('p1-accuracy').textContent = accuracyP1.toFixed(2) + '%';
    document.getElementById('p2-accuracy').textContent = accuracyP2.toFixed(2) + '%';

    // Estimate ELO based on accuracy (placeholder logic)
    const elo = (accuracyP1 + accuracyP2) / 2 * 20;
    document.getElementById('elo').textContent = Math.round(elo);
}
