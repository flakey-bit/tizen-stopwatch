export interface TimeElapsedEvent {
    ticksElapsed: number;
}

export interface TimeElapsedEventHandler { 
    (event: TimeElapsedEvent): void;
}

export default class TimerModel {
    private _timeElapsedSubscribers: TimeElapsedEventHandler[] = [];
    private _accumulationStart: Date;
    private _runningTotal: number;
    private _timer: number;
    private _ticksElapsed: number;
    private _resolution: number = 100;

    public constructor() {
        this._ticksElapsed = 0;
    }

    public subscribeToTicksElapsedEvent(handler: TimeElapsedEventHandler) {
        this._timeElapsedSubscribers.push(handler);
    }

    public get ticksElapsed(): number {
        return this._ticksElapsed;
    }

    public get running(): boolean {
        return this._timer !== undefined;
    }

    public start(): void {
        if (this._timer) {
            return;
        }

        this._accumulationStart = new Date();
        this._resetTimer();
    }

    public stop(): void {
        if (this._timer === undefined) {
            return;
        }

        window.clearTimeout(this._timer);
        delete this._timer;
        this._accumulateElapsed();        
        delete this._accumulationStart;
        this._fireOnTimeElapsed();
    }

    public toggle(): void {
        if (this.running) {
            this.stop();
        } else {
            this.start();
        }
    }

    public reset(): void {
        this.stop();
        this._ticksElapsed = 0;
        this._fireOnTimeElapsed();
    }

    private _accumulateElapsed(): void {
        var now = new Date();
        this._ticksElapsed += (now.getTime() - this._accumulationStart.getTime());
        this._accumulationStart = now;
        if (this._ticksElapsed >= 60 * 60 * 1000) {
            this._ticksElapsed = (60 * 60 * 1000) - 1; // We could stop the timer, but no real need
        }
    }

    private _fireOnTimeElapsed(): void {
        this._timeElapsedSubscribers.forEach((handler: TimeElapsedEventHandler) => {
            try {
                handler({ticksElapsed: this.ticksElapsed});
            } catch (e) {
                console.log("Unhandled exception in timer elapsed event handler: ", e);
            }
        });
    }

    private _resetTimer() {
        this._timer = window.setTimeout(() => {
            this._accumulateElapsed();
            this._fireOnTimeElapsed();
            this._resetTimer();
        }, this._resolution);        
    }
}