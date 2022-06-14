$(function(){
    $(".disclaimer > a").on("click", function(){
        console.log($(this).text())
        
        $(".modal-title").html($(this).text())
    }
        
    )
})