document.addEventListener('DOMContentLoaded', function() {
    var posts = document.querySelectorAll('#post')
    
    posts.forEach(item => {
        item.addEventListener("click", () => {
             console.log('clicked');
        });
    });

    console.log(posts)
});