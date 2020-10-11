import * as $ from 'jquery';

function createAnalytics() : object {
    let counter = 0;
    let isDestroy : boolean = false;
    const listener = () : number => counter++;

    $(document).on('click', listener);

    return {
        destroy() {
            $(document).off('click', listener);
            isDestroy = true;
        },

        getClicks() {
            return isDestroy ? 'Analytics is destroyed!' : counter;
        }
    }
}

window['analytics'] = createAnalytics();