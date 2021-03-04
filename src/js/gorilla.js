var scrollingEl = document;
var gorillaEl = document.getElementById('gorilla');

function toggleAnimation(animate) {
    if (animate && !gorillaEl.classList.contains('climbing')) {
        gorillaEl.classList.add('climbing');
    }
    
    if (!animate && gorillaEl.classList.contains('climbing')) {
        gorillaEl.classList.remove('climbing');
    }
}
                
var timeoutId;

document.addEventListener('scroll', function (evt) {
    toggleAnimation(true);
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        toggleAnimation(false);
    }, 50);
});