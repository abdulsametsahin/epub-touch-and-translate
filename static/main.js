$(function(){
    $.each($("p"), function(i, el) {
        var words = $(this).text().split(' ')
        var text = words.join("</span> <span class='tt'>");
            $(this).html("<div>" + text + "</div>");
        });
        words = "";

        var hiderTimeout;
        var textFull = "";
        $(".tt").click(function () {
            $(this).css('background', '#000');
            $(this).css('color', 'var(--bg-color)');
            var word = $(this)[0].innerText;
            textFull += " "+ word;
            word = word.replace(/(?:[\(\)\-&$#!\[\]{}\"\',\.]+(?:\s|$)|(?:^|\s)[\(\)\-&$#!\[\]{}\"\',\.]+)/g, ' ').trim();
            $("#result").html('<i class="fa fa-spinner fa-spin"></i>');
            $("#result").show();
            $.getJSON('/translate/'+textFull, {text: textFull}, function(json, textStatus) { 

                var array = [];
                $.each(json.extra_data["possible-translations"][0][2], function(i, arr){
                    array.push(arr[0]);
                })
                var text = array.join("<br/>");
                $("#result").html("<i class='fa fa-volume-up'></i> "+json.origin +"<hr> <b>"+text+"</b>");
                $("#result").data('text', json.origin);

                clearTimeout(hiderTimeout);

                hiderTimeout = setTimeout(function(){
                    textFull = "";
                    $(".tt").css('background', 'transparent');
                    $(".tt").css('color', '#000'); 
                    $("#result").hide();
                } , 7000);
            });
    });
});

$("#result").click(function(){
    responsiveVoice.speak($(this).data('text'));
});

$("#sayfalariAc").click(function(event) {
    event.preventDefault();
    $("#sayfalar").slideToggle('slow');
});