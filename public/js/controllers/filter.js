poddsokApp.filter('segmentFilter', function() {
    return function (input, searchText) {
        var returnArray = [];
        if(searchText.minutes.text !== undefined){
            // Split on single or multi space
            var splitext = searchText.minutes.text.toLowerCase().split(/\s+/);
            // Build Regexp with logicial ND
            var regexp_and = "(?=.*" + splitext.join(")(?=.*") + ")";
            // Compile the regular expression
            var re = new RegExp(regexp_and, "i");
            for (var x = 0; x < input.length; x++) {
                if(input[x].minutes !== undefined) {
                    input[x].minutes = input[x].minutes.filter(function(y){
                            if (re.test(y.text)) {
                                return y;
                            }
                    })
                    if(input[x].minutes.length !== 0) returnArray.push(input[x]);
                }
            }
        }
        return returnArray;  
    }
});