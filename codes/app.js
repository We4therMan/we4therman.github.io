$(document).ready(function() {
    $("#codeForm").click(function() {
        $(".displayTxt").html($("#textBox").val());
        $console.log("Code updated in the display box.");
    });
});