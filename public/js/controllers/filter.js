poddsokApp.filter('segmentFilter', function() {
   return function(input, searchText){
        if( searchText.text != undefined  || searchText.text === '') {
            var searchTextSplit = searchText.text.toLowerCase().split(' ');
            var search = function( input, searchArray, count ) {
                var newArray = [];
                if( input != undefined ) {
                    input.forEach(function(segment) {
                        segment.minutes.forEach(function(min) {
                            if( min.text.toLowerCase().includes(searchArray[count]) ) {
                                newArray.push(segment);
                            }
                        });
                    });
                } 
                if( count === searchArray.length - 1 ) {
                    return newArray;  
                } else {
                    count++;
                    return search( newArray, searchArray, count);                        
                }
            };
            var count = 0;
            var returnArray = search( input, searchTextSplit, count );
            return returnArray;
        }
    }
});