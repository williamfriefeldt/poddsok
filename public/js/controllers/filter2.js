poddsokApp.filter( 'minuteFilter', () => {

    /**
     * @description - Filter for text that match with words in episodes
     * @param { array } input - Array with episodes (objects)
     * @param { string } searchText - Search text from user input
     * @return { function } - Filter function that in turn returns an array with strings from episodes that matched search word(s)
     *
     * @link - https://stackoverflow.com/questions/20459798/angularjs-filter-for-multiple-strings/23452217#23452217
     */
    return ( input, searchText ) => {
        var returnArray = [];
        if( searchText !== undefined ){
            // Split on single or multi space
            var splitext = searchText.toLowerCase().split( /\s+/ );
            // Build Regexp with logicial ND
            var regexp_and = "(?=.*" + splitext.join( ")(?=.*" ) + ")";
            // Compile the regular expression
            var re = new RegExp( regexp_and, "i" );
            if( input !== undefined ) {
                for( var x = 0; x < input.length; x++ ) {
                    if( input[x] !== undefined ) {
                        if( re.test( input[x].text ) ) {
                            returnArray.push( input[x] );
                            break;
                        }
                    }
                }
            }
        }
        if( searchText === '' ) return input;
        return returnArray;  
    }
});