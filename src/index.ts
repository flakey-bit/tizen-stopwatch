import TimerModel from "./timer_model";
import TimerView from "./timer_view";

declare global {
    interface Window {
        tizen: any;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    var model = new TimerModel();
    var view = new TimerView(document.getElementById("root-element"), model);

    window.addEventListener("click", (event) => {
        event.preventDefault();
        model.toggle();
    });

    window.addEventListener('tizenhwkey', function(ev: any) {
        if (ev.keyName == 'back') {
            if (model.ticksElapsed > 0) {
                model.reset();
            } else {
                window.tizen.application.getCurrentApplication().exit();
            }
        }
    });
});