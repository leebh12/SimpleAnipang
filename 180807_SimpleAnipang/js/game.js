
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//var x = canvas.width/2;
//var y = canvas.height-30;

var rightPressed = false;
var leftPressed = false;

    //������ ���� ����
var brickRowCount = 6;
var brickColumnCount = 8;
var brickWidth = 60;
var brickHeight = 60;
var brickPadding = 10;
var brickOffsetTop = 160;
var brickOffsetLeft = 30;

var score;
var limit;

    //���콺 �̺�Ʈ�� ó���ϱ� ���� ����
var m_bIsDragged = false;
    //���� Ŭ����
var m_bChoosedBrick_column=-1;
var m_bChoosedBrick_row = -1;
    
var m_bPrevious_Coordinate_X = 0;
var m_bPrevious_Coordinate_Y = 0;

//���� ���¸� �����ϱ����� ����
var isMoving = false;
var isSwapping = false;
var EndSwapping = false;
var SwappingBlock1_row;
var SwappingBlock1_column;
var SwappingBlock2_row;
var SwappingBlock2_column;

var combo = 0;

    //���� ����
var bricks = [];
for(var row=0; row<brickRowCount; row++) {
  bricks[row] = [];
  for (var column = 0; column < brickColumnCount; column++) {
      //status�� �浹�� �����ϱ� ���� �ڵ�. ����� �ʿ����.
      bricks[row][column] = { x: 0, y: 0, status: 1, color: randomRange(0, 6) };
  }
}

//MapCoordinate[row][column] =  {x , y ,{ dx=x ,dy = 0 ,status 1 /2  , color 0 ~ 6 }}

var MapCoordinate = [];
for(var row=0; row<brickRowCount; row++) {
  MapCoordinate[row] = [];
  for (var column = 0; column <brickColumnCount ; column++) {
      //status�� ���� ������ ����
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

//n1���� n2������ ���� �� �������� ����. �� ���� ��������
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
    //�̺�Ʈ�� ������ Ÿ�� ���� x, y�� �� ���� ���� ������ -> � ���� ������� �Ǻ�
    //if (e.layerX > target_brick.x && e.layerX < target_brick.x + brickWidth && e.layerY > target_brick.y && e.layerY < target_brick.y + brickHeight) {
    //    {

    //    }
    //m_bIsDragged = true;
	if(scene == 1)
	{
    //���° ��ġ�� ������� ���
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

    //X�� Y ��� ���� ���� �����ߴٸ�
    if(m_bChoosedBrick_column > -1 && m_bChoosedBrick_row > -1)
    {
        //�巡�� ���·� ����
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
    //�̺�Ʈ�� ������ Ÿ�� ���� x, y�� �� ���� ���� ������ -> � ���� ������� �Ǻ�
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

        //X��ȭ��, Y��ȭ�� ��
        //X��ȭ���� Y��ȭ������ ũ�ٸ� �¿�巡��
        if (Math.abs(m_bPrevious_Coordinate_X - e.layerX) >= Math.abs(m_bPrevious_Coordinate_Y - e.layerY))
        {
			console.log("�¿�巡��");
            
            //���� ���� ��ǥ���� ó������ x��ǥ�� �� ũ�ٸ� ó������ ���ʳ�� ��ȯ
            //���� ���� ���� ó�� ���̸� ���ʿ� ���� ����
            if (m_bPrevious_Coordinate_X - e.layerX > 0 && m_bChoosedBrick_column != 0)
			{
				isSwapping = true;
				SwappingBlock1_row = m_bChoosedBrick_row;
				SwappingBlock1_column = m_bChoosedBrick_column;
				SwappingBlock2_row = m_bChoosedBrick_row;
				SwappingBlock2_column = m_bChoosedBrick_column - 1;

				dragBlock();
            }
            //���� ���� ��ǥ���� ó������ x��ǥ�� �� �۴ٸ� ó������ �����ʰ� ��ȯ
            //ó�� ���� ���� ������ ���̸� �����ʿ� ���̻� ���� ����.
			if (m_bPrevious_Coordinate_X - e.layerX < 0 && m_bChoosedBrick_column != brickColumnCount) {
				isSwapping = true;
				SwappingBlock1_row = m_bChoosedBrick_row;
				SwappingBlock1_column = m_bChoosedBrick_column;
				SwappingBlock2_row = m_bChoosedBrick_row;
				SwappingBlock2_column = m_bChoosedBrick_column + 1;

				dragBlock();
            }
        }
            //�׷��� �ʴٸ� ���� �巡��
        else
        {
            console.log("���ϵ巡��");
            
            //���� ���� ��ǥ���� ó������ y��ǥ�� �� ũ�ٸ� ó������ ����� ��ȯ
            //���� ���� ���� ���� ���̸� ���� ���� ����
			if (m_bPrevious_Coordinate_Y - e.layerY > 0 && m_bChoosedBrick_row != 0) {
				isSwapping = true;
				SwappingBlock1_row = m_bChoosedBrick_row;
				SwappingBlock1_column = m_bChoosedBrick_column;
				SwappingBlock2_row = m_bChoosedBrick_row - 1;
				SwappingBlock2_column = m_bChoosedBrick_column;

				dragBlock();
            }
            //���� ���� ��ǥ���� ó������ y��ǥ�� �� �۴ٸ� ó������ �Ʒ���� ��ȯ
            //���� ���� ���� �ǾƷ� ���̸� ���� ���� ����
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

//���Ƿ� �����¿츦 �ٲٰ� üũ. 
function blockCanMove(row, column)
{
	//�� ��� �ٲٱ�
	if (row>0) 
	{
		SwapBlock(row, column, row - 1, column)
		if ((blockCollisionCheck(row, column) || blockCollisionCheck(row - 1, column)))
		{
			SwapBlock(row, column, row - 1, column);
			//console.log(row,column);
			//console.log("����� ��ȯ����");
			return true;
		}
		else{
		SwapBlock(row, column, row - 1, column);
		}
	}

	//�Ʒ���� �ٲٱ�
	if (row<brickRowCount-1) 
	{
		SwapBlock(row, column, row + 1, column);
        if ((blockCollisionCheck(row, column) || blockCollisionCheck(row + 1, column)))
		{
			SwapBlock(row, column, row + 1, column);
			//console.log(row,column);
			//console.log("�ϳ�� ��ȯ����");
			return true;
		}
		else{
			SwapBlock(row, column, row + 1, column);
		}
    }
	//���ʳ�� �ٲٱ�

	if (column>0) 
	{
		SwapBlock(row, column, row, column - 1);
        if ((blockCollisionCheck(row, column) || blockCollisionCheck(row, column - 1)))
		{
			SwapBlock(row, column, row, column - 1);
			//console.log(row,column);
			//console.log("�³�� ��ȯ����");
			return true;
		}
		else{
			SwapBlock(row, column, row, column - 1);
		}
    }
	//�����ʳ�� �ٲٱ�

	if (column<brickColumnCount-1) 
	{
		SwapBlock(row, column, row, column + 1);
        if ((blockCollisionCheck(row, column) || blockCollisionCheck(row, column + 1)))
		{
			SwapBlock(row, column, row, column + 1);
			//console.log(row,column);
			//console.log("���� ��ȯ����");
			return true;
		}
		else{
			SwapBlock(row, column, row, column + 1);
		}
    }

	return false;
}

function blockCollisionCheck(row, column) {
    //���� 3�� ����. 1��° ĭ�� �ִ°��
    if (row >= 2 && MapCoordinate[row][column].brick.color == MapCoordinate[row - 1][column].brick.color && MapCoordinate[row][column].brick.color == MapCoordinate[row - 2][column].brick.color)
    {
        console.log("1����ȯ����");

        return true;
	}
    //���� 3�� ����. 2��° ĭ�� �ִ°��
    if (row >= 1 && row <= brickRowCount-2 && MapCoordinate[row][column].brick.color == MapCoordinate[row - 1][column].brick.color && MapCoordinate[row][column].brick.color == MapCoordinate[row + 1][column].brick.color)
    {
        console.log("2����ȯ����");
		return true;
}
    //���� 3�� ����. 3��° ĭ�� �ִ°��
    if (row <= brickRowCount-3 && MapCoordinate[row][column].brick.color == MapCoordinate[row + 1][column].brick.color && MapCoordinate[row][column].brick.color == MapCoordinate[row + 2][column].brick.color)
    {
        console.log("3����ȯ����");
		return true;
	}
    //�¿� 3�� ����. 1��° ĭ�� �ִ°��
    if (column <= brickColumnCount-3 && MapCoordinate[row][column].brick.color == MapCoordinate[row][column + 1].brick.color && MapCoordinate[row][column].brick.color == MapCoordinate[row][column + 2].brick.color)
    {
        console.log("4����ȯ����");
		return true;
	}
    //�¿� 3�� ����. 2��° ĭ�� �ִ°��
    if (column >= 1 && column <= brickColumnCount-2 && MapCoordinate[row][column].brick.color == MapCoordinate[row][column - 1].brick.color && MapCoordinate[row][column].brick.color == MapCoordinate[row][column + 1].brick.color)
    {
        console.log("5����ȯ����");
		return true;
	}
    //�¿� 3�� ����. 3��° ĭ�� �ִ°��
    if (column >= 2 && MapCoordinate[row][column].brick.color == MapCoordinate[row][column - 1].brick.color && MapCoordinate[row][column].brick.color == MapCoordinate[row][column - 2].brick.color)
    {
        console.log("6����ȯ����");
		return true;
	}
    //console.log("no collision");
    return false;
}
    
  //������ ���� �ִ��� üũ
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

//Ÿ�� �� �¿���� 3�� üũ
function Detection_Row(row, column){
	if(column >= brickColumnCount-2)
	{		
		return;
	}
	
	//Ÿ�� ���� 1ĭ��, 2ĭ�� ���� ������ �����ϸ�
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

//Ÿ�� �� ���Ϲ��� 3�� üũ
function Detection_Column(row, column){
	if(row >= brickRowCount-2)
	{		
		return;
	}
	
	//Ÿ�� ���� 1ĭ�Ʒ�, 2ĭ�Ʒ� ���� ������ �����ϸ�
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

//Main ���� ����
function initBrickStableCheck() {
    for (var row = 0; row < brickRowCount; row++) {
        for (var column = 0; column < brickColumnCount; column++) {
            //��� ���� ���鼭 �������� Ȯ��
            //�����°��� �ִ� -> �� ��ü, ����
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
            console.log("stable ���� �Ϸ�");
            break;
        }
    }

    for (var row = 0; row < brickRowCount; row++) 
	{
        for (var column = 0; column < brickColumnCount; column++) 
		{
            //�� ������ ��ġ ���
            //MapCoordinate[row][column].x = (column * (brickWidth + brickPadding)) + brickOffsetLeft;
            //MapCoordinate[row][column].y = (row * (brickHeight + brickPadding)) + brickOffsetTop;
			
			MapCoordinate[row][column].x = (column * (brickWidth + brickPadding)) + brickOffsetLeft;
            MapCoordinate[row][column].y = (row * (brickHeight + brickPadding)) + brickOffsetTop ;
			
			//���� x, y ��ġ �ʱ�ȭ
			//y��ġ�� drawBrick���� �ش� ���� y��ġ���� �������鼭 ������ �����
            MapCoordinate[row][column].brick.x = (column * (brickWidth + brickPadding)) + brickOffsetLeft;

            //MapCoordinate[row][column].��ü = bricks[row][column];
        }
    }
	
//	drawBricks() ;
}

    //���� �׸���
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
          //������ ���°� 2 -> ������
          if (MapCoordinate[row][column].brick.status == 2) {
              MapCoordinate[row][column].brick.color = 99;
			}

			//swapping �������� ������ �ʴ´ٸ� �ٽ� �ǵ����ֱ�
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

			//��ü�� ���� ��ü�� �ڸ����� �Դٸ�
			if (isSwapping == true) {
				//1��°�� 2��°�� ���� �ٿ� �ִٸ� �¿��̵�
				if (SwappingBlock1_row == SwappingBlock2_row) {
					if (MapCoordinate[SwappingBlock1_row][SwappingBlock1_column].x == MapCoordinate[SwappingBlock1_row][SwappingBlock1_column].brick.x) {
						isSwapping = false;
						EndSwapping = true;
					}
				}
				//�׷��� �ʴٸ� �����̵�
				else {
					if (MapCoordinate[SwappingBlock1_row][SwappingBlock1_column].y == MapCoordinate[SwappingBlock1_row][SwappingBlock1_column].brick.y) {
						isSwapping = false;
						EndSwapping = true;
					}
				}
				
			}

			

           //������ ���°� 1 -> ����
			if (MapCoordinate[row][column].brick.status == 1) {

              // �ɸ��� ���
              var img = new Image();
              img.src = './img/animal.png';

              if (MapCoordinate[row][column].brick.sprite._index != currentFrame) {
                  MapCoordinate[row][column].brick.sprite._index = currentFrame;
              }

              //�����̹��� ���� 
              MapCoordinate[row][column].brick.sprite.update(0.033);
              //ĵ���� ����
              ctx.save();
              //�׸��⿵�� ������� ������ǥ�� �̵�
              ctx.translate(MapCoordinate[row][column].brick.x, MapCoordinate[row][column].brick.y);
              //�ɸ��� �׸���
              MapCoordinate[row][column].brick.sprite.render(ctx, img);
              //ĵ���� �ٽ����
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

    //���� �׸���
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

	//LIMIT, SCORE �ۼ�
    ctx.font = "35px ���� ���";
    ctx.fillStyle = 'White';
	ctx.fillText("LIMIT", limitStateCoordinate_X + 30, limitStateCoordinate_Y + 40);
	ctx.fillText("SCORE", scoreStateCoordinate_X + 15, scoreStateCoordinate_Y + 40);

	if(limit < 10)
		ctx.fillText(limit, limitStateCoordinate_X + 60, limitStateCoordinate_Y + 80);
	else if(limit < 100)
		ctx.fillText(limit, limitStateCoordinate_X + 50, limitStateCoordinate_Y + 80);

	//�ڸ����� ���� score �߾�����
	if(score < 10)
		ctx.fillText(score, scoreStateCoordinate_X + 60, scoreStateCoordinate_Y + 80);
	else if (score < 100)
		ctx.fillText(score, scoreStateCoordinate_X + 50, scoreStateCoordinate_Y + 80);
	else if (score < 1000)
		ctx.fillText(score, scoreStateCoordinate_X + 40, scoreStateCoordinate_Y + 80);
	else
		ctx.fillText(score, scoreStateCoordinate_X + 30, scoreStateCoordinate_Y + 80);

	//LIMIT, SCORE �׵θ� �ۼ�
    ctx.strokeStyle = 'White';
	ctx.strokeText("LIMIT", limitStateCoordinate_X + 30, limitStateCoordinate_Y + 40);
	ctx.strokeText("SCORE", scoreStateCoordinate_X + 15, scoreStateCoordinate_Y + 40);
	//ctx.strokeText(limit, limitStateCoordinate_X + 50, limitStateCoordinate_Y + 80);
	//ctx.strokeText(score, scoreStateCoordinate_X + 55, scoreStateCoordinate_Y + 80);
}
function shiftBlock() {

    //0���� �ʱ�ȭ
    var space = Array.apply(null, new Array(brickColumnCount)).map(Number.prototype.valueOf, 0);

    //�ش� ���� �ٴ� �÷�
    var space_bottom = Array.apply(null, new Array(brickColumnCount)).map(Number.prototype.valueOf, 0);

    for (var row = 0; row < brickRowCount; row++) {
        for (var column = 0; column < brickColumnCount; column++) {
            if (MapCoordinate[row][column].brick.status == 2) {

                deletebrick.push(MapCoordinate[row][column]);
                space[column]++;
                //console.log(space);
                //���������� ī��Ʈ�� ����� ���� �� ���� �ٴں�
                space_bottom[column] = row;
            }
        }
    }

    //�� �Ʒ��� ä���
    //space_bottom - row���� ���� ��(���� ��ġ�ϴ�) ��� space[column] - �� �÷��� ����ִ� ������ŭ �Ʒ��� ����Ʈ
    //
    for (var column = 0; column < brickColumnCount; column++) {
        for (var row = brickRowCount - 1; row >= 0; row--) {
            //������� �����ϰ�, �ش� ���� �ٴں��� ���� �ִ� ���̸� ����ִ� ������ŭ �Ʒ��� ����Ʈ
            if (space[column] != 0 && space_bottom[column] >= row) {
                //���� ������ ��
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
                //�Ʒ��� ä���� ��
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
    //���ο� �� ����
    //space[column] - �� �÷��� ����ִ� ����  ��ŭ �� ���������� ä���
	
}

var effect = false;
var deletebrick = [];
var deleteCount = 0;
function drawEffect() {

    for (var a = 0; a < deletebrick.length; a++) {
        // �ɸ��� ���
        var img = new Image();
        img.src = './img/effect.png';

        //ĵ���� ����
        ctx.save();
        //�׸��⿵�� ������� ������ǥ�� �̵�
        ctx.translate(deletebrick[a].x, deletebrick[a].y);
        //�ɸ��� �׸���
        var darwCount = deleteCount % 3;
        ctx.drawImage(img,
            80 * darwCount , 0,
            deletebrick[a].brick.sprite.size[0], deletebrick[a].brick.sprite.size[1],
            0, 0,
            deletebrick[a].brick.sprite.size[0], deletebrick[a].brick.sprite.size[1]);
        //ĵ���� �ٽ����
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

			//����
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
	//��ü�� ���鼭
	for (var row = 0; row < brickRowCount; row++) {
		for (var column = 0; column < brickColumnCount; column++) {
			//Ÿ�� ������ �����¿츦 �ٲٰ� �������� Ȯ��
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