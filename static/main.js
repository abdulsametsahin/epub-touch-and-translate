$("#BookContent").click(function(e) {
    var selection = window.getSelection();
    console.log(selection);
    if (!selection || selection.rangeCount < 1) return true;
    var range = selection.getRangeAt(0);
    var node = selection.anchorNode;
    var word_regexp = /^\w*$/;

    // Extend the range backward until it matches word beginning
    while ((range.startOffset > 0) && range.toString().match(word_regexp)) {
      range.setStart(node, (range.startOffset - 1));
    }
    // Restore the valid word match after overshooting
    if (!range.toString().match(word_regexp)) {
      range.setStart(node, range.startOffset + 1);
    }

    // Extend the range forward until it matches word ending
    while ((range.endOffset < node.length) && range.toString().match(word_regexp)) {
      range.setEnd(node, range.endOffset + 1);
    }
    // Restore the valid word match after overshooting
    if (!range.toString().match(word_regexp)) {
      range.setEnd(node, range.endOffset - 1);
    }
    var word = range.toString();
    
    if (word.length) {
        $.getJSON('/translate/'+word, {text: word}, function(json, textStatus) {
            var array = [];
            $.each(json.extra_data["possible-translations"][0][2], function(i, arr){
                array.push(arr[0]);
            })
            var text = array.join(", ");
            $("#result").html("<i class='fa fa-volume-up'></i> "+json.origin +": <b>"+text+"</b>");
            $("#result").data('text', json.origin);
        });
    }
});

$("#result").click(function(){
    responsiveVoice.speak($(this).data('text'));
});
