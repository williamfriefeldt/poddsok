poddsokApp.filter('segmentFilter', function() {
    return function (input, searchText) {
        var returnArray = [];
        if(searchText !== undefined){
            // Split on single or multi space
            var splitext = searchText.toLowerCase().split(/\s+/);
            // Build Regexp with logicial ND
            var regexp_and = "(?=.*" + splitext.join(")(?=.*") + ")";
            // Compile the regular expression
            var re = new RegExp(regexp_and, "i");
            if(input !== undefined) {
                for (var x = 0; x < input.length; x++) {
                    if(input[x].minutes !== undefined){
                        for(var y = 0; y < input[x].minutes.length; y++) {
                            if(re.test(input[x].minutes[y].text)) {
                                returnArray.push(input[x]);
                                break;
                            }
                        }
                    }
                }
            }
        }
        if(searchText ==='') return input;
        return returnArray;  
    }
});