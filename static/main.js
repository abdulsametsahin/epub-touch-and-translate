$(function(){
    $.each($("p"), function(i, el) {
        var words = $(this).text().match(/\b(\w+\W+)/g)
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
            word = word.replace(/(?:[\(\)\-&$#!\[\]{}\"\',\.]+(?:\s|$)|(?:^|\s)[\(\)\-&$#!\[\]{}\"\',\.]+)/g, ' ').trim();

            textFull += " "+ word;

            $("#result").html('<i class="fa fa-spinner fa-spin"></i>');
            $.getJSON('/translate/'+textFull, {text: textFull}, function(json, textStatus) {
                var array = [];
                $.each(json.extra_data["possible-translations"][0][2], function(i, arr){
                    array.push(arr[0]);
                })
                var text = array.join(", ");
                $("#result").html("<i class='fa fa-volume-up'></i> "+json.origin +": <b>"+text+"</b>");
                $("#result").data('text', json.origin);
                $("#result").show();

                clearTimeout(hiderTimeout);

                hiderTimeout = setTimeout(function(){
                    $("#result").hide();
                    textFull = "";
                    $(".tt").css('background', 'transparent');
                    $(".tt").css('color', '#000');
                } , 7000);
            });
    });
});

$("#result").click(function(){
    responsiveVoice.speak($(this).data('text'));
});
