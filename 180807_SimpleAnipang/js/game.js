
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//var x = canvas.width/2;
//var y = canvas.height-30;

var rightPressed = false;
var leftPressed = false;

    //벽돌에 대한 정의
var brickRowCount = 6;
var brickColumnCount = 8;
var brickWidth = 60;
var brickHeight = 60;
var brickPadding = 10;
var brickOffsetTop = 160;
var brickOffsetLeft = 30;

var score;
var limit;

    //마우스 이벤트를 처리하기 위한 변수
var m_bIsDragged = false;
    //이전 클릭블럭
var m_bChoosedBrick_column=-1;
var m_bChoosedBrick_row = -1;
    
var m_bPrevious_Coordinate_X = 0;
var m_bPrevious_Coordinate_Y = 0;

//블럭의 상태를 저장하기위한 변수
var isMoving = false;
var isSwapping = false;
var EndSwapping = false;
var SwappingBlock1_row;
var SwappingBlock1_column;
var SwappingBlock2_row;
var SwappingBlock2_column;

var combo = 0;

    //벽돌 생성
var bricks = [];
for(var row=0; row<brickRowCount; row++) {
  bricks[row] = [];
  for (var column = 0; column < brickColumnCount; column++) {
      //status는 충돌을 감지하기 위한 코드. 현재는 필요없음.
      bricks[row][column] = { x: 0, y: 0, status: 1, color: randomRange(0, 6) };
  }
}

//MapCoordinate[row][column] =  {x , y ,{ dx=x ,dy = 0 ,status 1 /2  , color 0 ~ 6 }}

var MapCoordinate = [];
for(var row=0; row<brickRowCount; row++) {
  MapCoordinate[row] = [];
  for (var column = 0; column <brickColumnCount ; column++) {
      //status는 현재 벽돌의 상태
      var colors = randomRange(0, 6);  
      MapCoordinate[row][column] = {
          x: 0, y: 0, brick: {
              x: 0, y: brickOffsetTop - brickHeight * (brickRowCount - row), status: 1, color: colors,
              sprite: new Sprite('./img/animal.png', [80 * 0, 71 * colors], [80, 71], 4, [0, 1, 2])
          }
      };//, dropPriority:brickRowCount-row}};
  }
}

var tmpbrick = { x: 0, y: 0, status: 1 , color : 1};


//timer 
var start = null;

//scene
var scene = 1;

//n1부터 n2까지의 숫자 중 랜덤숫자 리턴. 블럭 색상 랜덤생성
function randomRange(n1, n2) {
    return Math.floor((Math.random() * (n2 - n1 + 1)) + n1);
}

document.addEventListener("mousedown", mouseDownHandler, false); //first
document.addEventListener("mouseup", mouseUpHandler, false); //first

  /* events fired on the draggable target */
  document.addEventListener("drag", function( event ) {

  }, false);

  document.addEventListener("dragstart", function( event ) {
      // store a ref. on the dragged elem
      //dragged = event.target;
      // make it half transparent
      event.target.style.opacity = .5;
	  console.log(
      event.target);
  }, false);

  document.addEventListener("dragend", function( event ) {
      // reset the transparency
      event.target.style.opacity = "";
  }, false);

  /* events fired on the drop targets */
  document.addEventListener("dragover", function( event ) {
      // prevent default to allow drop
      event.preventDefault();
  }, false);

  document.addEventListener("dragenter", function( event ) {
      // highlight potential drop target when the draggable element enters it
      if ( event.target.className == "dropzone" ) {
          event.target.style.background = "purple";
      }

  }, false);

  document.addEventListener("dragleave", function( event ) {
      // reset background of potential drop target when the draggable element leaves it
      if ( event.target.className == "dropzone" ) {
          event.target.style.background = "";
      }

  }, false);

  document.addEventListener("drop", function( event ) {
      // prevent default action (open as link for some elements)
      event.preventDefault();
      // move dragged elem to the selected drop target
      if ( event.target.className == "dropzone" ) {
          event.target.style.background = "";
          dragged.parentNode.removeChild( dragged );
          event.target.appendChild( dragged );
      }
    
  }, false);

function mouseDownHandler(e)
{
    //이벤트의 영역이 타겟 블럭의 x, y값 블럭 영역 내에 있으면 -> 어떤 블럭을 찍었는지 판별
    //if (e.layerX > target_brick.x && e.layerX < target_brick.x + brickWidth && e.layerY > target_brick.y && e.layerY < target_brick.y + brickHeight) {
    //    {

    //    }
    //m_bIsDragged = true;
	if(scene == 1)
	{
    //몇번째 위치의 블록인지 계산
    for(var column=0; column<brickColumnCount; column++)
    {
        if( (column*(brickWidth+brickPadding))+brickOffsetLeft <= e.layerX && (column*(brickWidth+brickPadding))+brickOffsetLeft + brickWidth >= e.layerX)
        {
            m_bChoosedBrick_column = column;
            break;
        }
    }

    for (var row = 0; row < brickRowCount; row++) {
        if ((row * (brickHeight + brickPadding)) + brickOffsetTop <= e.layerY && (row * (brickHeight + brickPadding)) + brickOffsetTop + brickHeight >= e.layerY) {
            m_bChoosedBrick_row = row;
            break;
        }
    }

    //X와 Y 블록 영역 내를 선택했다면
    if(m_bChoosedBrick_column > -1 && m_bChoosedBrick_row > -1)
    {
        //드래그 상태로 진입
        m_bPrevious_Coordinate_X = e.layerX;
        m_bPrevious_Coordinate_Y = e.layerY;
        m_bIsDragged = true;
    }
	}
};

function mouseUpHandler(e)
{
	if (isMoving)
		return;
    //이벤트의 영역이 타겟 블럭의 x, y값 블럭 영역 내에 있으면 -> 어떤 블럭을 찍었는지 판별
    //if (e.layerX > target_brick.x && e.layerX < target_brick.x + brickWidth && e.layerY > target_brick.y && e.layerY < target_brick.y + brickHeight)
	if(scene  == 2)
	{
		if( e.layerX < canvas.width && e.layerY < canvas.height)
        {
            var audio = new Audio('./sound/anipang_ingame.mp3');
            audio.play();

			MainScene();
		}
	}
	if(scene == 3)
	{
		MenuScene();
	}
    if (m_bIsDragged && scene == 1)
	{
		combo = 0;

        //X변화량, Y변화량 비교
        //X변화량이 Y변화량보다 크다면 좌우드래그
        if (Math.abs(m_bPrevious_Coordinate_X - e.layerX) >= Math.abs(m_bPrevious_Coordinate_Y - e.layerY))
        {
			console.log("좌우드래그");
            
            //현재 찍은 좌표보다 처음블럭의 x좌표가 더 크다면 처음블럭의 왼쪽놈과 교환
            //현재 찍은 블럭이 처음 블럭이면 왼쪽에 블럭이 없음
            if (m_bPrevious_Coordinate_X - e.layerX > 0 && m_bChoosedBrick_column != 0)
			{
				isSwapping = true;
				SwappingBlock1_row = m_bChoosedBrick_row;
				SwappingBlock1_column = m_bChoosedBrick_column;
				SwappingBlock2_row = m_bChoosedBrick_row;
				SwappingBlock2_column = m_bChoosedBrick_column - 1;

				dragBlock();
            }
            //현재 찍은 좌표보다 처음블럭의 x좌표가 더 작다면 처음블럭의 오른쪽과 교환
            //처음 찍은 블럭이 마지막 블럭이면 오른쪽에 더이상 블럭이 없음.
			if (m_bPrevious_Coordinate_X - e.layerX < 0 && m_bChoosedBrick_column != brickColumnCount) {
				isSwapping = true;
				SwappingBlock1_row = m_bChoosedBrick_row;
				SwappingBlock1_column = m_bChoosedBrick_column;
				SwappingBlock2_row = m_bChoosedBrick_row;
				SwappingBlock2_column = m_bChoosedBrick_column + 1;

				dragBlock();
            }
        }
            //그렇지 않다면 상하 드래그
        else
        {
            console.log("상하드래그");
            
            //현재 찍은 좌표보다 처음블럭의 y좌표가 더 크다면 처음블럭의 윗놈과 교환
            //현재 찍은 블럭이 맨위 블럭이면 위에 블럭이 없음
			if (m_bPrevious_Coordinate_Y - e.layerY > 0 && m_bChoosedBrick_row != 0) {
				isSwapping = true;
				SwappingBlock1_row = m_bChoosedBrick_row;
				SwappingBlock1_column = m_bChoosedBrick_column;
				SwappingBlock2_row = m_bChoosedBrick_row - 1;
				SwappingBlock2_column = m_bChoosedBrick_column;

				dragBlock();
            }
            //현재 찍은 좌표보다 처음블럭의 y좌표가 더 작다면 처음블럭의 아랫놈과 교환
            //현재 찍은 블럭이 맨아래 블럭이면 위에 블럭이 없음
			if (m_bPrevious_Coordinate_Y - e.layerY < 0 && m_bChoosedBrick_row != brickRowCount) {
				isSwapping = true;
				SwappingBlock1_row = m_bChoosedBrick_row;
				SwappingBlock1_column = m_bChoosedBrick_column;
				SwappingBlock2_row = m_bChoosedBrick_row + 1;
				SwappingBlock2_column = m_bChoosedBrick_column;

				dragBlock();
            }
        }
    }

    m_bIsDragged = false;
    m_bChoosedBrick_row = -1;
    m_bChoosedBrick_column = -1;    
};

function dragBlock() {
	SwapBlock(SwappingBlock1_row, SwappingBlock1_column, SwappingBlock2_row, SwappingBlock2_column);
	if ((blockCollisionCheck(SwappingBlock1_row, SwappingBlock1_column) || blockCollisionCheck(SwappingBlock2_row, SwappingBlock2_column))) {
		matchBlock();
		combo += 1;
		score += combo*10;
	}
}

function matchBlock() {
	limit -= 1;
	var audio = new Audio('./sound/sound 22.mp3');
	audio.play();
}

function SwapBlock(Des_row, Des_column, Src_row, Src_column)
{
    var tmp_block;
	
    tmp_block = MapCoordinate[Des_row][Des_column].brick;
    MapCoordinate[Des_row][Des_column].brick = MapCoordinate[Src_row][Src_column].brick;
    MapCoordinate[Src_row][Src_column].brick = tmp_block;
}

//임의로 상하좌우를 바꾸고 체크. 
function blockCanMove(row, column)
{
	//위 놈과 바꾸기
	if (row>0) 
	{
		SwapBlock(row, column, row - 1, column)
		if ((blockCollisionCheck(row, column) || blockCollisionCheck(row - 1, column)))
		{
			SwapBlock(row, column, row - 1, column);
			//console.log(row,column);
			//console.log("위놈과 교환가능");
			return true;
		}
		else{
		SwapBlock(row, column, row - 1, column);
		}
	}

	//아래놈과 바꾸기
	if (row<brickRowCount-1) 
	{
		SwapBlock(row, column, row + 1, column);
        if ((blockCollisionCheck(row, column) || blockCollisionCheck(row + 1, column)))
		{
			SwapBlock(row, column, row + 1, column);
			//console.log(row,column);
			//console.log("하놈과 교환가능");
			return true;
		}
		else{
			SwapBlock(row, column, row + 1, column);
		}
    }
	//왼쪽놈과 바꾸기

	if (column>0) 
	{
		SwapBlock(row, column, row, column - 1);
        if ((blockCollisionCheck(row, column) || blockCollisionCheck(row, column - 1)))
		{
			SwapBlock(row, column, row, column - 1);
			//console.log(row,column);
			//console.log("좌놈과 교환가능");
			return true;
		}
		else{
			SwapBlock(row, column, row, column - 1);
		}
    }
	//오른쪽놈과 바꾸기

	if (column<brickColumnCount-1) 
	{
		SwapBlock(row, column, row, column + 1);
        if ((blockCollisionCheck(row, column) || blockCollisionCheck(row, column + 1)))
		{
			SwapBlock(row, column, row, column + 1);
			//console.log(row,column);
			//console.log("우놈과 교환가능");
			return true;
		}
		else{
			SwapBlock(row, column, row, column + 1);
		}
    }

	return false;
}

function blockCollisionCheck(row, column) {
    //상하 3개 연결. 1번째 칸에 있는경우
    if (row >= 2 && MapCoordinate[row][column].brick.color == MapCoordinate[row - 1][column].brick.color && MapCoordinate[row][column].brick.color == MapCoordinate[row - 2][column].brick.color)
    {
        console.log("1번교환가능");

        return true;
	}
    //상하 3개 연결. 2번째 칸에 있는경우
    if (row >= 1 && row <= brickRowCount-2 && MapCoordinate[row][column].brick.color == MapCoordinate[row - 1][column].brick.color && MapCoordinate[row][column].brick.color == MapCoordinate[row + 1][column].brick.color)
    {
        console.log("2번교환가능");
		return true;
}
    //상하 3개 연결. 3번째 칸에 있는경우
    if (row <= brickRowCount-3 && MapCoordinate[row][column].brick.color == MapCoordinate[row + 1][column].brick.color && MapCoordinate[row][column].brick.color == MapCoordinate[row + 2][column].brick.color)
    {
        console.log("3번교환가능");
		return true;
	}
    //좌우 3개 연결. 1번째 칸에 있는경우
    if (column <= brickColumnCount-3 && MapCoordinate[row][column].brick.color == MapCoordinate[row][column + 1].brick.color && MapCoordinate[row][column].brick.color == MapCoordinate[row][column + 2].brick.color)
    {
        console.log("4번교환가능");
		return true;
	}
    //좌우 3개 연결. 2번째 칸에 있는경우
    if (column >= 1 && column <= brickColumnCount-2 && MapCoordinate[row][column].brick.color == MapCoordinate[row][column - 1].brick.color && MapCoordinate[row][column].brick.color == MapCoordinate[row][column + 1].brick.color)
    {
        console.log("5번교환가능");
		return true;
	}
    //좌우 3개 연결. 3번째 칸에 있는경우
    if (column >= 2 && MapCoordinate[row][column].brick.color == MapCoordinate[row][column - 1].brick.color && MapCoordinate[row][column].brick.color == MapCoordinate[row][column - 2].brick.color)
    {
        console.log("6번교환가능");
		return true;
	}
    //console.log("no collision");
    return false;
}
    
  //터지는 블럭이 있는지 체크
function collisionDetection() {
    for (var row = 0; row < brickRowCount; row++) {
        for (var column = 0; column < brickColumnCount; column++) {
      var target_brick = MapCoordinate[row][column].brick;
      //if(target_brick.status == 1) {
		  //target_brick.color = 6;
		Detection_Row(row, column);
		Detection_Column(row, column);
      //}
    }
  }
}

//타겟 블럭 좌우방향 3줄 체크
function Detection_Row(row, column){
	if(column >= brickColumnCount-2)
	{		
		return;
	}
	
	//타겟 블럭의 1칸옆, 2칸옆 블럭의 색깔이 동일하면
	if(MapCoordinate[row][column].brick.color == MapCoordinate[row][column+1].brick.color && MapCoordinate[row][column].brick.color == MapCoordinate[row][column+2].brick.color)
	{
	    console.log("LeftRight Delete");
		MapCoordinate[row][column].brick.status = 2;
		MapCoordinate[row][column+1].brick.status = 2;
		MapCoordinate[row][column + 2].brick.status = 2;
		combo++;
		score += combo * 10;
	}
}

//타겟 블럭 상하방향 3줄 체크
function Detection_Column(row, column){
	if(row >= brickRowCount-2)
	{		
		return;
	}
	
	//타겟 블럭의 1칸아래, 2칸아래 블럭의 색깔이 동일하면
	if(MapCoordinate[row][column].brick.color == MapCoordinate[row+1][column].brick.color && MapCoordinate[row][column].brick.color == MapCoordinate[row+2][column].brick.color)
	{
	    console.log("UpDown delete");
	    //console.log(row, column);
		MapCoordinate[row][column].brick.status = 2;
		MapCoordinate[row+1][column].brick.status = 2;
		MapCoordinate[row + 2][column].brick.status = 2;
		combo++;
		score += combo * 10;
	}
}

//Main 최초 실행
function initBrickStableCheck() {
    for (var row = 0; row < brickRowCount; row++) {
        for (var column = 0; column < brickColumnCount; column++) {
            //모든 블럭을 돌면서 터지는지 확인
            //터지는곳이 있다 -> 블럭 교체, 리턴
            if (blockCollisionCheck(row, column)) {
               var colors =  randomRange(0, 6);
                MapCoordinate[row][column].brick.color = colors;
                MapCoordinate[row][column].brick.sprite.pos[1] = 71 * colors;
                return false;
            }

        }
    }

    return true;
}

function initBricks() 
{
    while (true) {
        if (initBrickStableCheck()) {
            console.log("stable 상태 완료");
            break;
        }
    }

    for (var row = 0; row < brickRowCount; row++) 
	{
        for (var column = 0; column < brickColumnCount; column++) 
		{
            //각 벽돌의 위치 계산
            //MapCoordinate[row][column].x = (column * (brickWidth + brickPadding)) + brickOffsetLeft;
            //MapCoordinate[row][column].y = (row * (brickHeight + brickPadding)) + brickOffsetTop;
			
			MapCoordinate[row][column].x = (column * (brickWidth + brickPadding)) + brickOffsetLeft;
            MapCoordinate[row][column].y = (row * (brickHeight + brickPadding)) + brickOffsetTop ;
			
			//블럭의 x, y 위치 초기화
			//y위치는 drawBrick에서 해당 블럭의 y위치까지 떨어지면서 저절로 잡아줌
            MapCoordinate[row][column].brick.x = (column * (brickWidth + brickPadding)) + brickOffsetLeft;

            //MapCoordinate[row][column].객체 = bricks[row][column];
        }
    }
	
//	drawBricks() ;
}

    //벽돌 그리기
function drawBricks() {
    //var backimg = new Image();
    //backimg.src = './img/backimg.png';
    //var a = ctx.createPattern(backimg, 'repeat');
    //ctx.fillStyle = a;
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
		var backimg = new Image();
		backimg.src = './img/backimg2.jpg';
		ctx.drawImage(backimg , 0 , 0 , 640 ,640 );
    var Variation = 0;
    var movingBlockCnt = 0;
    var currentFrame = MapCoordinate[0][0].brick.sprite._index;
    for (var row = 0; row < brickRowCount; row++) {
        for (var column = 0; column < brickColumnCount; column++) {
          //벽돌의 상태가 2 -> 터질블럭
          if (MapCoordinate[row][column].brick.status == 2) {
              MapCoordinate[row][column].brick.color = 99;
			}

			//swapping 끝났을때 터지지 않는다면 다시 되돌려주기
			if (EndSwapping) {
				if (!(blockCollisionCheck(SwappingBlock1_row, SwappingBlock1_column) || blockCollisionCheck(SwappingBlock2_row, SwappingBlock2_column)))
				{
					SwapBlock(SwappingBlock1_row, SwappingBlock1_column, SwappingBlock2_row, SwappingBlock2_column);
				}
				EndSwapping = false;
			}
		  
			if (MapCoordinate[row][column].y > MapCoordinate[row][column].brick.y) 
			{
            MapCoordinate[row][column].brick.y += 10;
            movingBlockCnt++;
			}
			if (MapCoordinate[row][column].y < MapCoordinate[row][column].brick.y) {
				MapCoordinate[row][column].brick.y -= 10;
				movingBlockCnt++;
			}

			if (MapCoordinate[row][column].x > MapCoordinate[row][column].brick.x) {
				MapCoordinate[row][column].brick.x += 10;
				movingBlockCnt++;
			}

			if (MapCoordinate[row][column].x < MapCoordinate[row][column].brick.x) {
				MapCoordinate[row][column].brick.x -= 10;
				movingBlockCnt++;
			}

			//교체한 블럭이 교체할 자리까지 왔다면
			if (isSwapping == true) {
				//1번째와 2번째가 같은 줄에 있다면 좌우이동
				if (SwappingBlock1_row == SwappingBlock2_row) {
					if (MapCoordinate[SwappingBlock1_row][SwappingBlock1_column].x == MapCoordinate[SwappingBlock1_row][SwappingBlock1_column].brick.x) {
						isSwapping = false;
						EndSwapping = true;
					}
				}
				//그렇지 않다면 상하이동
				else {
					if (MapCoordinate[SwappingBlock1_row][SwappingBlock1_column].y == MapCoordinate[SwappingBlock1_row][SwappingBlock1_column].brick.y) {
						isSwapping = false;
						EndSwapping = true;
					}
				}
				
			}

			

           //벽돌의 상태가 1 -> 정상
			if (MapCoordinate[row][column].brick.status == 1) {

              // 케릭터 출력
              var img = new Image();
              img.src = './img/animal.png';

              if (MapCoordinate[row][column].brick.sprite._index != currentFrame) {
                  MapCoordinate[row][column].brick.sprite._index = currentFrame;
              }

              //다음이미지 선택 
              MapCoordinate[row][column].brick.sprite.update(0.033);
              //캔버스 멈춤
              ctx.save();
              //그리기영역 만든것을 다음좌표로 이동
              ctx.translate(MapCoordinate[row][column].brick.x, MapCoordinate[row][column].brick.y);
              //케릭터 그리기
              MapCoordinate[row][column].brick.sprite.render(ctx, img);
              //캔버스 다시재생
              ctx.restore();
      }
	  
    }
    }

    if (movingBlockCnt == 0) {
        isMoving = false;
    }
    else {
        isMoving = true;
    }

}

function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,0,0,0.25)';
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);
    ctx.stroke();
}

    //벽돌 그리기
function drawScore() {

    //ctx.rect(50, 50, 200, 200);
   // ctx.stroke();
    //cxt.clip();
    var limitleft = 280;
	var limittop = 100;
	var stateBoardWidth = 140;
	var stateBoardHeight = 100;
	var limitStateCoordinate_X = canvas.width / 2 - stateBoardWidth / 2;
	var limitStateCoordinate_Y = 30;
	var scoreStateCoordinate_X = limitStateCoordinate_X + stateBoardWidth + 10;
	var scoreStateCoordinate_Y = limitStateCoordinate_Y;
	
	roundedRect(ctx, limitStateCoordinate_X, limitStateCoordinate_Y, stateBoardWidth, stateBoardHeight, 10);
	roundedRect(ctx, scoreStateCoordinate_X, scoreStateCoordinate_Y, stateBoardWidth, stateBoardHeight, 10);
	
   // ctx.globalAlpha = 0.52;
    ctx.fillStyle = null;

	//LIMIT, SCORE 작성
    ctx.font = "35px 맑은 고딕";
    ctx.fillStyle = 'White';
	ctx.fillText("LIMIT", limitStateCoordinate_X + 30, limitStateCoordinate_Y + 40);
	ctx.fillText("SCORE", scoreStateCoordinate_X + 15, scoreStateCoordinate_Y + 40);

	if(limit < 10)
		ctx.fillText(limit, limitStateCoordinate_X + 60, limitStateCoordinate_Y + 80);
	else if(limit < 100)
		ctx.fillText(limit, limitStateCoordinate_X + 50, limitStateCoordinate_Y + 80);

	//자리수에 따른 score 중앙정렬
	if(score < 10)
		ctx.fillText(score, scoreStateCoordinate_X + 60, scoreStateCoordinate_Y + 80);
	else if (score < 100)
		ctx.fillText(score, scoreStateCoordinate_X + 50, scoreStateCoordinate_Y + 80);
	else if (score < 1000)
		ctx.fillText(score, scoreStateCoordinate_X + 40, scoreStateCoordinate_Y + 80);
	else
		ctx.fillText(score, scoreStateCoordinate_X + 30, scoreStateCoordinate_Y + 80);

	//LIMIT, SCORE 테두리 작성
    ctx.strokeStyle = 'White';
	ctx.strokeText("LIMIT", limitStateCoordinate_X + 30, limitStateCoordinate_Y + 40);
	ctx.strokeText("SCORE", scoreStateCoordinate_X + 15, scoreStateCoordinate_Y + 40);
	//ctx.strokeText(limit, limitStateCoordinate_X + 50, limitStateCoordinate_Y + 80);
	//ctx.strokeText(score, scoreStateCoordinate_X + 55, scoreStateCoordinate_Y + 80);
}
function shiftBlock() {

    //0으로 초기화
    var space = Array.apply(null, new Array(brickColumnCount)).map(Number.prototype.valueOf, 0);

    //해당 열의 바닥 컬럼
    var space_bottom = Array.apply(null, new Array(brickColumnCount)).map(Number.prototype.valueOf, 0);

    for (var row = 0; row < brickRowCount; row++) {
        for (var column = 0; column < brickColumnCount; column++) {
            if (MapCoordinate[row][column].brick.status == 2) {

                deletebrick.push(MapCoordinate[row][column]);
                space[column]++;
                //console.log(space);
                //마지막으로 카운트된 사라질 블럭이 그 열의 바닥블럭
                space_bottom[column] = row;
            }
        }
    }

    //블럭 아래로 채우기
    //space_bottom - row보다 작은 블럭(위에 위치하는) 모두 space[column] - 각 컬럼당 비어있는 공간만큼 아래로 쉬프트
    //
    for (var column = 0; column < brickColumnCount; column++) {
        for (var row = brickRowCount - 1; row >= 0; row--) {
            //빈공간이 존재하고, 해당 열의 바닥보다 위에 있는 블럭이면 비어있는 공간만큼 아래로 쉬프트
            if (space[column] != 0 && space_bottom[column] >= row) {
                //새로 생성될 블럭
                if (row < space[column])
                {
                    //bricks[row][column] = { x: 0, y: 0, status: 1, color: randomRange(0, 6) };
                    var colors = randomRange(0, 6);

                    MapCoordinate[row][column].brick = {
                        x: MapCoordinate[row][column].x, y: brickOffsetTop - brickHeight * (space[column] - row),
                        status: 1, color: colors,
                        sprite: new Sprite('./img/animal.png', [0, 71 * colors], [80, 71], 4, [0, 1, 2])
                    };
                    
                }
                //아래로 채워질 블럭
                else
                {
				MapCoordinate[row][column].brick = MapCoordinate[row - space[column]][column].brick;
					//MapCoordinate[row][column].brick.status = 1;
					//MapCoordinate[row][column].brick.color =   MapCoordinate[row - space[column]][column].brick.color  ;
					//MapCoordinate[row][column].brick.x =  MapCoordinate[row][column].x;
                   // bricks[row][column] = bricks[row - space[column]][column];
                }
            }
        }
    }

    if (deletebrick.length > 0) {

        effect = true;
    }
    //새로운 블럭 생성
    //space[column] - 각 컬럼당 비어있는 공간  만큼 맨 위에서부터 채우기
	
}

var effect = false;
var deletebrick = [];
var deleteCount = 0;
function drawEffect() {

    for (var a = 0; a < deletebrick.length; a++) {
        // 케릭터 출력
        var img = new Image();
        img.src = './img/effect.png';

        //캔버스 멈춤
        ctx.save();
        //그리기영역 만든것을 다음좌표로 이동
        ctx.translate(deletebrick[a].x, deletebrick[a].y);
        //케릭터 그리기
        var darwCount = deleteCount % 3;
        ctx.drawImage(img,
            80 * darwCount , 0,
            deletebrick[a].brick.sprite.size[0], deletebrick[a].brick.sprite.size[1],
            0, 0,
            deletebrick[a].brick.sprite.size[0], deletebrick[a].brick.sprite.size[1]);
        //캔버스 다시재생
        ctx.restore();
    }
    deleteCount++;
    if (deleteCount > 50) {
        effect = false;
        deleteCount = 0; 
        deletebrick = [];
    }
    if (isMoving === false) {
    }
    else { window.requestAnimationFrame(drawEffect); }
}

function draw(timestamp) {
  
  if (!start) start = timestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
	drawEffect();

      if (isMoving == false) {
          collisionDetection();
		  shiftBlock();
	  }
  drawScore();

	//var progress = timestamp - start;
       
     //   if (progress < 1000) {
     //   }
	//	else
	//	{
			
			if(limit == 0 ) 
			{
				  GameClearScene();
				  return false;
      }

      if (document.getElementById('prog').value < 2) {
          var audio = new Audio('./sound/sound 1.mp3');
          audio.play();
          GameClearScene();
          return false;
      }

			//셔플
			if(!canMoreMove())
			{
				shuffleBlock();
				console.log("shuffle");
				start = null;
			//	window.requestAnimationFrame(draw);
              }


      window.requestAnimationFrame(draw);
	//	}
}

function shuffleBlock()
{
	var shuffleRow, shuffleColumn;
	for(var row=0; row<brickRowCount; row++) {
	  for (var column = 0; column <brickColumnCount ; column++) {
		  shuffleRow = randomRange(0, brickRowCount-1);
		  shuffleColumn = randomRange(0, brickColumnCount-1);

	      SwapBlock(row, column, shuffleRow, shuffleColumn);
		  MapCoordinate[row][column].brick.x = MapCoordinate[row][column].x;
		  MapCoordinate[row][column].brick.y = MapCoordinate[row][column].y;
		  MapCoordinate[shuffleRow][shuffleColumn].brick.x = MapCoordinate[shuffleRow][shuffleColumn].x;
		  MapCoordinate[shuffleRow][shuffleColumn].brick.y = MapCoordinate[shuffleRow][shuffleColumn].y;
	  }
	}
	
	//MapCoordinate
}

function canMoreMove()
{
	//전체를 돌면서
	for (var row = 0; row < brickRowCount; row++) {
		for (var column = 0; column < brickColumnCount; column++) {
			//타겟 블럭마다 상하좌우를 바꾸고 터지는지 확인
			if(blockCanMove(row, column))
				return true;
		}
	}

	return false;
}

function InitScene()
{
	//GameOverScene();
	//MainScene();
    MenuScene();
}

function MainScene()
{
	progr(60);
	initBricks();
	window.requestAnimationFrame(draw);
	scene = 1;
	limit = 20;
	score = 0;
}

function MenuScene()
{
	scene = 2;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.font="60px Georgia";
	ctx.fillText("GameStart", 230, 400);
}


function GameClearScene()
{
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  
   ctx.font="60px Georgia";
	ctx.fillText("GameClear",   0,400);
scene = 3;
score = 0;
}

InitScene();
//var startAnimation = setInterval(draw, 10);