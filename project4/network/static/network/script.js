document.addEventListener('DOMContentLoaded', function() {
    add_toggle_edits();
    add_toogle_likes();

});


function add_toggle_edits()
{
    var posts = document.querySelectorAll('[id^="editpost-"]')
    posts.forEach(item => {
        item.addEventListener("click", () => {
            editpost(item);
        });
    });
};

function add_toogle_likes()
{
    var likes = document.querySelectorAll('.likebutton')
    likes.forEach(item => {
        item.addEventListener("click", () => {
            like_post(item);
        })
    })
}


function editpost(edititem) {
    console.log(edititem)
    var post_id = edititem.dataset.postId
    e_post = document.querySelector(`#editpostdiv-${post_id}`)
    e_post.style.display = 'block'
    console.log(e_post)

    button = document.querySelector(`#editbutton-${post_id}`)
    button.addEventListener('click', () => {
        new_post = document.querySelector(`#editedpost-${post_id}`).value
        console.log(new_post)
        fetch('/editpost', {
            method: "PUT",
            body: JSON.stringify({
                id: post_id,
                new_post: new_post
            })
        })
       .then(response => response.json()) 
       .then(data => {
            if (data.message === "no error"){
                e_post.style.display = 'none'
                document.querySelector(`#postbody-${post_id}`).innerHTML = new_post;
           }             
        });  
    });
}

function like_post(likebutton) {
    var post_id = likebutton.dataset.postId;

    fetch('/likepost', {
        method: "PUT",
        body: JSON.stringify({
            id: post_id,
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "no error"){
           if (data.like){
               likebutton.innerHTML = `<img src="https://img.icons8.com/plasticine/100/000000/like.png">`
           }
           else {
            likebutton.innerHTML = `<img src="https://img.icons8.com/carbon-copy/100/000000/like--v2.png">`
           }
           document.querySelector(`#likecounter-${post_id}`).innerHTML = data.likes;
       }             
    })
}