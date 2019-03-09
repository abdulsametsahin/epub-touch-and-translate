$(function(){
    $.each($("p"), function(i, el) {
        var words = $(this).text().split(" ");
        var text = words.join("</span> <span class='tt'>");
            $(this).html("<div>" + text + "</div>");
        });


        $(".tt").click(function () {
            var word = $(this)[0].innerText;
            $("#result").html('<i class="fa fa-spinner fa-spin"></i>');
            $.getJSON('/translate/'+word, {text: word}, function(json, textStatus) {
                var array = [];
                $.each(json.extra_data["possible-translations"][0][2], function(i, arr){
                    array.push(arr[0]);
                })
                var text = array.join(", ");
                $("#result").html("<i class='fa fa-volume-up'></i> "+json.origin +": <b>"+text+"</b>");
                $("#result").data('text', json.origin);
                $("#result").show();

                var hiderTimeout;
                hiderTimeout = setTimeout(function(){
                    $("#result").hide();
                } , 7000);
                clearTimeout(hiderTimeout);
            });
    });
});

$("#result").click(function(){
    responsiveVoice.speak($(this).data('text'));
});
