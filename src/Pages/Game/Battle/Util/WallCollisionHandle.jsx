

export default function WallCollisionHandle(ballObj, rect) {
    if(ballObj.y - ballObj.rad <= 0 || ballObj.y + ballObj.rad >= rect.height){
        ballObj.dy *= -1;
    }
    if(ballObj.x - ballObj.rad <= 0 || ballObj.x + ballObj.rad >= rect.width){
        ballObj.dx *= -1;
    }
}
