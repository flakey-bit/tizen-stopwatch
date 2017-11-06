import TimerModel from "./timer_model";

require("./assets/styles.css");

var padStart = require('string.prototype.padstart');
padStart.shim();

declare global {
    interface String {
        padStart(num: number, padWith: string): string
    }
}

export default class TimerView {
    private readonly _rootElement: Element;
    private readonly _model: TimerModel;

    public constructor(rootElement: Element, model: TimerModel) {
        this._rootElement = rootElement;
        this._model = model;
        this._model.subscribeToTicksElapsedEvent((event) => {
            this._render(event.ticksElapsed);
        });
        this._render(this._model.ticksElapsed);
    }

    private _render(milliseconds: number): void {
        while (this._rootElement.childElementCount > 0) {
            this._rootElement.removeChild(this._rootElement.childNodes[0]);
        }

        var span = document.createElement("span");
        span.className = "timer-view-digital-display-text";
        span.appendChild(document.createTextNode(this._displayTime(milliseconds)));
        this._rootElement.appendChild(span);
    }

    private _displayTime(millisec: number): string {
        const normalizeTime = (time: string): string => time.padStart(2, '0');
        
        let tenthsOfASecond: string = Math.floor((millisec % 1000) / 100).toString();
        let seconds: string = (millisec / 1000).toFixed(0);
        let minutes: string = Math.floor(parseInt(seconds) / 60).toString().padStart(2, '0');
       
        seconds = normalizeTime(Math.floor(parseInt(seconds) % 60).toString());
       
        return `${minutes}:${seconds}.${tenthsOfASecond}`;
    }
}