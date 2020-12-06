const HUGE_CANVAS_ID = 'HUGE_CANVAS';
const SMALL_CANVAS_ID = 'SMALL_CANVAS';
const CANVAS_CONTAINER_ID = 'CANVAS_CONTAINER';
const HUGE_CANVAS_WIDTH = 600;
const HUGE_CANVAS_HEIGHT = 600;
const SMALL_CANVAS_WIDTH = 600;
const SMALL_CANVAS_HEIGHT = 50;
const UNIT_STAR_SEGMENT = 25;
const STAR_WIDTH = UNIT_STAR_SEGMENT * 8;
const FIRST_STAR_LINE_START_Y_POSITION = 75;
const SECOND_STAR_LINE_START_Y_POSITION = 225;
const THIRD_STAR_LINE_START_Y_POSITION = 375;

const starLeftMarginByIndex = [
	UNIT_STAR_SEGMENT,
	UNIT_STAR_SEGMENT * 7,
	UNIT_STAR_SEGMENT,
	UNIT_STAR_SEGMENT * 7,
	UNIT_STAR_SEGMENT * 8,
];

const availableStarColors = [
	'red',
	'blue',
	'green',
	'yellow',
	'black'
];

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	};
};

const getColorNameByRgba = (rgbaArray) => {
	const whiteColorCondition = rgbaArray[3] === 0;
	const redColorCondition = rgbaArray[0] === 255 && rgbaArray[1] === 0 && rgbaArray[2] === 0;
	const blueColorCondition = rgbaArray[0] === 0 && rgbaArray[1] === 0 && rgbaArray[2] === 255;
	const greenColorCondition = rgbaArray[0] === 0 && rgbaArray[1] === 128 && rgbaArray[2] === 0;
	const yellowColorCondition = rgbaArray[0] === 255 && rgbaArray[1] === 255 && rgbaArray[2] === 0;
	const blackColorCondition = rgbaArray[0] === 0 && rgbaArray[1] === 0 && rgbaArray[2] === 0;

	if (whiteColorCondition) {
		return 'white';
	} else {
		if (redColorCondition) {
			return 'red';
		}
		if (blueColorCondition) {
			return 'blue';
		}
		if (greenColorCondition) {
			return 'green';
		}
		if (yellowColorCondition) {
			return 'yellow';
		}
		if (blackColorCondition) {
			return 'black';
		}
	}
};

const fillSmallCanvasByColor = (color) => {
	const smallCanvasElement = document.getElementById(SMALL_CANVAS_ID);
	if (smallCanvasElement) {
		const canvasContext = smallCanvasElement.getContext('2d');
		canvasContext.clearRect(0, 0, 600, 50);
		canvasContext.fillStyle = color;
		canvasContext.fillRect(0, 0, 600, 50);
	}
}

const onHugeCanvasClickEvent = (ev) => {
	const hugeCanvasElement = ev.target;
	const canvasContext = hugeCanvasElement.getContext('2d');
	const color = getColorNameByRgba(canvasContext.getImageData(ev.layerX, ev.layerY, 1, 1).data);
	fillSmallCanvasByColor(color);
};

const getStarPoints = (startPositionX, startPositionY) => {
	const firstPoint = new Point(startPositionX, startPositionY);
	const secondPoint = new Point(firstPoint.x + (UNIT_STAR_SEGMENT * 3), firstPoint.y);
	const thirdPoint = new Point(secondPoint.x + UNIT_STAR_SEGMENT, secondPoint.y - (UNIT_STAR_SEGMENT * 2));
	const fourthPoint = new Point(thirdPoint.x + UNIT_STAR_SEGMENT, secondPoint.y);
	const fifthPoint = new Point(fourthPoint.x + (UNIT_STAR_SEGMENT * 3), fourthPoint.y);
	const sixthPoint = new Point(fifthPoint.x - (UNIT_STAR_SEGMENT * 2), fifthPoint.y + (UNIT_STAR_SEGMENT * 2));
	const seventhPoint = new Point(sixthPoint.x + UNIT_STAR_SEGMENT, sixthPoint.y + (UNIT_STAR_SEGMENT * 2));
	const eighthPoint = new Point(thirdPoint.x, seventhPoint.y - UNIT_STAR_SEGMENT);
	const ninthPoint = new Point(eighthPoint.x - (UNIT_STAR_SEGMENT * 3), seventhPoint.y);
	const tenthPoint = new Point(ninthPoint.x + UNIT_STAR_SEGMENT, sixthPoint.y)

	return [
		firstPoint,
		secondPoint,
		thirdPoint,
		fourthPoint,
		fifthPoint,
		sixthPoint,
		seventhPoint,
		eighthPoint,
		ninthPoint,
		tenthPoint,
	];
};

const drawStarLinesInCanvasContext = (canvasContext, starIndex, starColor) => {
	canvasContext.beginPath();
	const starLeftMargin = starLeftMarginByIndex[starIndex];
	let startPositionY;
	let startPositionX;
	switch (starIndex) {
		case 0:
		case 1:
			startPositionY = FIRST_STAR_LINE_START_Y_POSITION;
			startPositionX = starIndex * STAR_WIDTH + starLeftMargin;
			break;
		case 2:
		case 3:
			startPositionY = SECOND_STAR_LINE_START_Y_POSITION;
			startPositionX = (starIndex - 2) * STAR_WIDTH + starLeftMargin;
			break;
		case 4:
			startPositionY = THIRD_STAR_LINE_START_Y_POSITION;
			startPositionX = starLeftMargin;
			break;
	}
	const starPoints = getStarPoints(startPositionX, startPositionY);
	canvasContext.moveTo(starPoints[0].x, starPoints[1].y);
	starPoints.slice(1).forEach((point) => {
		canvasContext.lineTo(point.x, point.y);
	});
	canvasContext.fillStyle = starColor;
	canvasContext.fill();
};

const initStarsInHugeCanvas = () => {
	const hugeCanvasElement = document.getElementById(HUGE_CANVAS_ID);
	if (hugeCanvasElement && hugeCanvasElement.getContext) {
		var canvasContext = hugeCanvasElement.getContext('2d');
		availableStarColors.forEach((color, index) => {
			drawStarLinesInCanvasContext(canvasContext, index, color);
		});
	};
};

const initHugeCanvas = () => {
	const hugeCanvasElement = document.createElement('canvas');
	hugeCanvasElement.id = HUGE_CANVAS_ID;
	hugeCanvasElement.width = HUGE_CANVAS_WIDTH;
	hugeCanvasElement.height = HUGE_CANVAS_HEIGHT;
	hugeCanvasElement.onclick = onHugeCanvasClickEvent;
	hugeCanvasElement.style.border = '1px solid black';
	document.getElementById(CANVAS_CONTAINER_ID).appendChild(hugeCanvasElement);
};

const initSmallCanvas = () => {
	const smallCanvasElement = document.createElement('canvas');
	smallCanvasElement.id = SMALL_CANVAS_ID;
	smallCanvasElement.width = SMALL_CANVAS_WIDTH;
	smallCanvasElement.height = SMALL_CANVAS_HEIGHT;
	smallCanvasElement.style.border = '1px solid black';
	smallCanvasElement.style.marginTop = '5px';
	document.getElementById(CANVAS_CONTAINER_ID).appendChild(smallCanvasElement);
};

const init = () => {
	initHugeCanvas();
	initSmallCanvas();
	initStarsInHugeCanvas();
};

window.onload = (() => {
	init();
});