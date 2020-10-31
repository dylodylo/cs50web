document.addEventListener('DOMContentLoaded', function() {
    add_toggle_edits();

});


function add_toggle_edits()
{
    var posts = document.querySelectorAll('.editpostlink')
    posts.forEach(item => {
        item.addEventListener("click", () => {
            editpost(item);
        });
    });
};


function editpost(edititem) {
    console.log('clicked')
    console.log(edititem)
    var post_id = edititem.dataset.postId
    e_post = document.querySelector(`#editpostdiv-${post_id}`)
    e_post.style.display = 'block'
    console.log(e_post)

    button = document.querySelector(`#editbutton-${post_id}`)
    button.addEventListener('click', () => {
        new_post = document.querySelector(`#editedpost-${post_id}`).innerHTML
        fetch('/editpost', {
            method: "POST",
            body: JSON.stringify({
                id: post_id,
                new_post: new_post
            })
        });
        
    });
}