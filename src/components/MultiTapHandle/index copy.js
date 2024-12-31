export default (navigator, screenName, wait = 300) => {
    let tapCount = 0;
    var screens = [];
    let handler;
    return function () {
        if (tapCount === 0) {
            tapCount++;
            if (screenName == screens[screens.length - 1])
                return

            screens.push(screenName);
            navigator()
        }

        //  navigator();
        clearTimeout(handler);
        handler = setTimeout(() => (tapCount = 0), wait);
        //   setTimeout(() => navigator(), wait);

    };
};