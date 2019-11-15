let post = {
    id: "",
    title : "",
    content: "",
    author: "",
    publishDate: ""
}

$("#appCreate").on("click", function(e){
    e.preventDefault();
    $("#createPost").removeAttr('hidden');
    //$(this).attr("hidden",true);
    $(this).hide();
})

let endpoint = "/blog-posts";

function init(){
    $.ajax({url: endpoint,
        method: "GET",
        dataType: "json",
        success: function(responseJSON){
            let list = $("#posts");
            list.html("");
            for (let i = 0; i < responseJSON.length; i++) {
                list.append(`<li><p class='pTitle'>${responseJSON[i].title}</p>
                                 <div class='AuthDate'>
                                 <p class='pAuthor'>${responseJSON[i].author}</p>
                                 <p class='pDate'>${responseJSON[i].publishDate}</p>
                                 </div>
                                 <p class='pContent'>${responseJSON[i].content}</p>
                                 <a class="pID" hidden>${responseJSON[i].id}</a>
                                 <button class='btn_del'>Delete Post</button>
                                 <button class='btn_upd'>Update Post</button></li>`);
            }
        },
        error: function(err){
                console.log(err);
               }
    });
}

$("ul").on("click", ".btn_del", function(e){
    e.preventDefault();    
    let delId = e.target.parentNode.querySelector(".pID").innerText;
    console.log(delId);
    $.ajax({
        url : endpoint+'/'+delId,
        method : "DELETE",
        dataType : "JSON",
        contentType : "application/json",
        success:function(responseJSON){
            alert("Post Deleted");
        },
        error: function(error){
            alert("Error while deleting post");
        }
    });
    init();
});

$("ul").on("click", ".btn_upd", function(e){    
    e.preventDefault();
    $("#appCreate").hide();
    $("#idU").val(e.target.parentNode.querySelector(".pID").innerText);
    $("#TitleU").val(e.target.parentNode.querySelector(".pTitle").innerText);
    $("#AuthorU").val(e.target.parentNode.querySelector(".pAuthor").innerText);
    $("#ContentU").val(e.target.parentNode.querySelector(".pContent").innerText);
    $("#updatePost").show();
});

$("#btn_update").on("click", function(e){    
    e.preventDefault();
    let updId = $("#idU").val();
    post.id = updId;
    post.title = $("#TitleU").val();
    post.author = $("#AuthorU").val();
    post.content = $("#ContentU").val();
    post.publishDate = new Date();
    console.log(updId);
    console.log(JSON.stringify(post));
    $.ajax({
        url : endpoint+'/'+updId,
        method : "PUT",
        dataType : "JSON",
        contentType : "application/json",
        data : JSON.stringify(post),
        success:function(responseJSON){
            alert("Post Updated");
        },
        error: function(error){
            alert("Error while updating post");
        }
    });
    $("#updatePost").hide();
    $("#appCreate").show();
    init();
});

$("#btn_create").on("click", function(e){
    e.preventDefault();
    post.title = $("#TitleF").val();
    post.author = $("#AuthorF").val();
    post.content = $("#ContentF").val();
    post.publishDate = new Date();
    $.ajax({
        url: endpoint,
        data : JSON.stringify(post),
        method: "POST",
        dataType : "JSON",
        contentType : "application/json",
        success: function(responseJSON){
            alert("Posted Created");            
        },
        error : function(err){
            console.log(post);
            alert("Error creating post");
        }
    });
    init();
    $("#appCreate").show();
    $("#createPost").hide();
});

init();
