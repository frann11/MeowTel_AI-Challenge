// /* This variable will be automatically updated on each round
// *
// * let data = {
// *	board: [["P1","E","E","E","E","E","E","E","E","W"],["W","E","E","E","S","E","E","E","E","E"], ...], // Game Board, row by row
// *	position_p1: [Y, X], // The AI position
// *	position_p2: [Y, X], // Your current position
// *	score_p1: 12, // The AI score
// *	score_p2: 10, // Your score
// *	moves_p1: [[Y, X], [Y, X], ...], // The AI past moves
// *	moves_p2: [[Y, X], [Y, X], ...], // Your past moves
// * }
// *
// * E = Empty, W = Wall, M = 2 points, S = 4 points, H = 6 points, F = 10 points
// * P1 = Player 1 (AI), P2 = Player 2 (You)
// */
print('Use print() or console.log() for debug/info ('+data.position_p2[0]+','+data.position_p2[1]+')');
let botData = []
let food = {
  M : 2, 
  S : 4, 
  H : 6, 
  F : 10
}

// Algebraic function to get absolute distance between two points
let calculateDistance = function(originY,originX,destinationY,destinationX) {
    return(
        //(|x2-x1|²+|y2-y1|²)½
        Math.sqrt(Math.pow(Math.abs(originX-destinationX),2) + Math.pow(Math.abs(originY-destinationY),2)))
}

let isFood = function checkIfTileIsFood(tile){
    return(Object.keys(food).includes(tile))
}
let currentPosition = data.position_p2
let opponentPosition = data.position_p1

let transformData = function({y,x,tile}){
    let distance = calculateDistance(y,x,currentPosition[0],currentPosition[1])
    let points = food[tile]
    let opponentDistance = calculateDistance(y,x,opponentPosition[0],opponentPosition[1])
    let oponentWeightValue = (points/(Math.abs(distance/opponentDistance))*Math.abs(data.score_p1-data.score_p2))
    let weightValue = (points/distance)
    let information = {oponentWeightValue,distance,points,weightValue,location:[y,x],food:data.board[y][x]}
    return information
}

for (let y = 0 ; y < data.board.length ;y++){
  for (let x = 0 ; x < 10; x++){
      let tile = data.board[y][x]
    if (isFood(tile)){
      let information = transformData({y,x,tile})
      botData.push(information)
    }
  }
}

// sorts the bot data based on the weightValue and opponent weightValue of the same destination
botData.sort((a,b) => a.weightValue+(0.55*a.oponentWeightValue) < b.weightValue+(0.55*b.oponentWeightValue)? 1 : -1)

let destination = botData[0].location // always will be inside table
let possible_moves = []
let MAX_TILES_VISIT = 2
let previousMoves = data.moves_p2

let timesVisited = function countTimesTileWasVisited(tile){
    // hackish way to get number of ocurrences of an array in a string
    return((JSON.stringify(previousMoves).split(JSON.stringify(tile))).length-1) 
}

while (possible_moves.length == 0){
    possible_moves = [
        ...(currentPosition[1]<9) && ( (timesVisited([currentPosition[0] , currentPosition[1]+1])) < MAX_TILES_VISIT) && (data.board[currentPosition[0]][currentPosition[1]+1] != 'W') ? [currentPosition[0] , currentPosition[1]+1] : [],
        ...(currentPosition[1]>0) && (  (timesVisited([currentPosition[0] , currentPosition[1]-1])) < MAX_TILES_VISIT) &&(data.board[currentPosition[0]][currentPosition[1]-1] != 'W') ? [currentPosition[0] , currentPosition[1]-1]:[],
        ...(currentPosition[0]<9) && ( (timesVisited([currentPosition[0]+1 , currentPosition[1]]))< MAX_TILES_VISIT) && (data.board[currentPosition[0]+1][currentPosition[1]] != 'W')  ?  [currentPosition[0]+1 , currentPosition[1]] : [],
        ...(currentPosition[0]>0) && (  (timesVisited([currentPosition[0]-1 , currentPosition[1]])) < MAX_TILES_VISIT) && (data.board[currentPosition[0]-1][currentPosition[1]] != 'W')  ? [currentPosition[0]-1 , currentPosition[1]] : []
      ]    
      MAX_TILES_VISIT++
}

console.log(JSON.stringify(possible_moves))

let moves = []

for (let x = 0; x<= possible_moves.length-2;x=x+2){
  moves.push({distancia:calculateDistance(destination[0],destination[1],possible_moves[x],possible_moves[x+1]),movimiento:[possible_moves[x],possible_moves[x+1]]})
}

moves.sort((a,b) => a.distancia > b.distancia ? 1: -1)
let move = moves[0]?.movimiento  || [moves[0],moves[1]]
console.log(move)