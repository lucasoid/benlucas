// enable transitions only if scripting is enabled (otherwise the content will remain invisible)
document.querySelectorAll('section.content-section:not(#ben-lucas)').forEach(function (el) {
    el.setAttribute('data-transition', 'true');
});

var transitionElements = document.querySelectorAll('[data-transition="true"]');

document.addEventListener('scroll', function (evt) {
    transitionElements.forEach(function (el) {
        if (
            el.getBoundingClientRect().top < (window.innerHeight * .75) &&
            el.getBoundingClientRect().bottom > window.innerHeight * .25            
        ) {
            if (!el.classList.contains('scrolled')) el.classList.add('scrolled');
        } else if (el.classList.contains('scrolled')) {
            el.classList.remove('scrolled');
        }
    });
});