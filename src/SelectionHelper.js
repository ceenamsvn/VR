export default class SelectionHelper {
    constructor(fourPointSelectionCallback) {
        this.selectionDomElement = null; // Selection box
        this.x1 = 0; // Selection box top-left/bottom-right coordinates
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.fourPointSelectionCallback = fourPointSelectionCallback;
        this.pressingSelectionButton = false; // Observer if trigger button is pressed
        this.clickingMouseButton = false; // Observer if mouse button is pressed
    }

    init() {
        this.selectionDomElement = document.getElementById("selectionBox");
    }

    enableSelectionMode() {
        this.pressingSelectionButton = true;
    }

    disableSelectionMode() {
        this.pressingSelectionButton = false;
    }
    
    // Calculate selection box
    reCalc() {
        this.x3 = Math.min(this.x1, this.x2);
        this.x4 = Math.max(this.x1, this.x2);
        this.y3 = Math.min(this.y1, this.y2);
        this.y4 = Math.max(this.y1, this.y2);
        this.selectionDomElement.style.left = this.x3 + "px";
        this.selectionDomElement.style.top = this.y3 + "px";
        this.selectionDomElement.style.width = this.x4 - this.x3 + "px";
        this.selectionDomElement.style.height = this.y4 - this.y3 + "px";
    }

    handleMouseMove(e) {
        if (this.clickingMouseButton) {
            this.x2 = e.clientX;
            this.y2 = e.clientY;
            this.reCalc();
        }
    }

    handleMouseDown(e) {
        if (this.pressingSelectionButton) {
            this.clickingMouseButton = true;
            this.selectionDomElement.hidden = false;
            console.log("Start selecting")
            this.x1 = e.clientX;
            this.y1 = e.clientY;
            this.x2 = e.clientX;
            this.y2 = e.clientY;
            this.reCalc();
        } 
    }

    handleMouseUp(e) {
        if (this.selectionDomElement.hidden == false) {
            let width =
                window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth;
            let height =
                window.innerHeight ||
                document.documentElement.clientHeight ||
                document.body.clientHeight;
            let inverseY1 = height - this.y1;
            let inverseY2 = height - this.y2;
            let padding = 5;
            let normalizedX1 = ((this.x1 - padding) / width) * 2 - 1;
            let normalizedY1 = ((inverseY1 - padding) / height) * 2 - 1;
            let normalizedX2 = ((this.x2 + padding) / width) * 2 - 1;
            let normalizedY2 = ((inverseY2 + padding) / height) * 2 - 1;
            let fromX = Math.min(normalizedX1, normalizedX2);
            let fromY = Math.max(normalizedY1, normalizedY2);
            let toX = Math.max(normalizedX1, normalizedX2);
            let toY = Math.min(normalizedY1, normalizedY2);

            console.log("Selection from", fromX, fromY, "to", toX, toY);
            this.fourPointSelectionCallback(fromX, fromY, toX, toY);
        } 

        this.selectionDomElement.hidden = true;
        this.clickingMouseButton = false;
    }
}