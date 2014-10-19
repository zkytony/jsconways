function loadXMLDoc(filename) {
	if (window.XMLHttpRequest) {
		xhttp=new XMLHttpRequest();
	} else {
		xttp=new ActiveXOjbect("Microsoft.XMLHTTP");
	}
	xhttp.open("GET", filename, false);
	xhttp.send(); //get the xml document
	return xhttp.responseXML;
}


window.onerror = function(msg, url, line) {
	alert("Error! Message: " + msg);
	alert("url: " + url);
	alert("Line number: " + line);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// attach the .compare method to Array's prototype to call it on any array
Array.prototype.compare = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};

Array.prototype.clone = function() {
    var arr = [];
    for( var i = 0; i < this.length; i++ ) {
//      if( this[i].constructor == this.constructor ) {
        if( this[i].clone ) {
            //recursion
            arr[i] = this[i].clone();
            break;
        }
        arr[i] = this[i];
    }
    return arr;
};
/*
Object.prototype.clone = function(obj) {
    if(typeof obj === 'object') {
       obj = new Object();
       for(var i in this) {
          obj.constructor.prototype[i] = this[i];                  
       }

       return obj;
    } else {
        throw new Error('clone() works only on objects.');
    }
 
};*/
