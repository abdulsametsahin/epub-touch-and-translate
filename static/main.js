$(function(){
    // Sayfa hazır olunca
    // Paragrafları, kelime kelime ayır.
    $.each($("p"), function(i, el) {
        // Paragrafı parçala
        var words = $(this).text().split(' ')
        var text = "";
        $.each(words, function(i, word) {
            text += "<span class='tt' data-index='"+i+"'>"+word+" </span>";
        });
        $(this).html("<div>" + text + "</div>");
    });
    // Kelimeleri sil.
    words = "";
    // Translate için bazı tanımlamar
    var hiderTimeout;
    var textFull = "";
    var lastIndex = null;
    // Kelimeye tıklandığında
    $(".tt").click(function () {
        // Kelime sırası
        var index = parseInt($(this).data('index'));
        // Kelime
        var word = $(this)[0].innerText;
        // Eğer ilk kez tıklanıyorsa (null)
        // Ya da tıklanan kelime, önceki kelimeden sonra geliyorsa toplu çevir
        // Yoksa son tıklanan kelimeyi çevir.
        if (lastIndex+1 == index || lastIndex == null){
            lastIndex = index;
            textFull += " " + word;
        }else {
            textFull = "";
            // Seçili kelimeleri kaldır.
            $(".tt").css('background', 'transparent');
            $(".tt").css('color', '#000'); 
            textFull = word;
            lastIndex = null;
        }
        // Tıklanan kelimeyi seç
        $(this).css('background', '#000');
        $(this).css('color', 'var(--bg-color)');
        // Kelimeden noktalama işaretlerini kaldır.
        word = word.replace(/(?:[\(\)\-&$#!\[\]{}\"\',\.]+(?:\s|$)|(?:^|\s)[\(\)\-&$#!\[\]{}\"\',\.]+)/g, ' ').trim();
        // Yükleniyor.
        $("#result").html('<i class="fa fa-spinner fa-spin"></i>');
        $("#result").show();
        // Çevir
        $.getJSON('/translate/'+textFull, {text: textFull}, function(json, textStatus) { 

            var array = [];
            $.each(json.extra_data["possible-translations"][0][2], function(i, arr){
                array.push(arr[0]);
            })
            var text = array.join("<br/>");
            $("#result").html("<i class='fa fa-volume-up'></i> "+json.origin +"<hr> <b>"+text+"</b>");
            $("#result").data('text', json.origin);

            clearTimeout(hiderTimeout);
            // 7sn sonra çeviriyi gizle.
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