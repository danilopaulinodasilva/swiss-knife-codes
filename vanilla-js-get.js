/* https://stackoverflow.com/a/979995/6518615 */

var url_string = "http://www.example.com/t.html?a=1&b=3&c=m2-m3-m4-m5"; //window.location.href
var url = new URL(url_string);
var c = url.searchParams.get("c");
console.log(c); // m2-m3-m4-m5
