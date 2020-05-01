function searchArticles() {

    $("#top-articles").empty();

    var searchValue = $("#searchTerm").val();
    var queryDate = "&facet_fields=source&facet=true";
    var startYear = $("#startYear").val(); 
    var endYear = $("#endYear").val();

    if (startYear !== "" || endYear !== "") {
        if (startYear !== "" && startYear > "1800" && startYear < moment().format("YYYY")) {
        queryDate += ("&begin_date=" + startYear + "0101");
        } else {
            $("#startYear").val("1900");
            return;
        }
        if (endYear !== "" && endYear >= startYear && endYear < moment().format("YYYY")) {
        queryDate += ("&end_date=" + endYear + "1231");    
        } else {
            moment().format("YYYY");
            return;
        }
        searchValue += queryDate;
    }

    if (typeof sortValue !== "undefined") {
        if (sortValue == "recent") {
            searchValue += "&sort=newest";
        }
    }

    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + searchValue + "&api-key=YNvKAVMibv1E5QAAY3Hr3KHhf7jDA6wR";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {   
        var articleList = response.response.docs;
        var numRecords = $("#num-records").val();
        for (i = 0; i < numRecords; i++) {
            current = articleList[i];
            wrapper = $("<div>");
            wrapper.addClass("d-flex flex-row")
            div = $("<div>");
            
            // title link
            title = $("<a>");
            title.attr("href", current.web_url);
            title.attr("target", "_blank");
            title.addClass("h5");
            title.text((i + 1) + ". " + current.headline.main);
            
            // body text
            summary = $("<div>");
            summary.text(current.abstract);
            
            // author
            author = $("<div>");
            author.text(" " + current.byline.original)
            author.addClass("text-capitalize text-muted mb-1")
           
            // date
            date = $("<span>");
            dateParsed = moment(current.pub_date).format('MMMM Do, YYYY');
            date.text(" | " + "Published " + dateParsed);
            
            // build HTML
            author.append(date);
            div.append(title);
            div.append(author);
            div.append(summary);
            
            // image
            var imageIndex = current.multimedia.findIndex(item => item.subtype === "thumbLarge");
            if (imageIndex !== -1) {
                image = $("<img>");
                image.attr("src", ("https://static01.nyt.com/" + current.multimedia[imageIndex].url));
                wrapper.append(image);
            }            

            wrapper.append(div);

            $("#top-articles").append(wrapper);
            if (i !== numRecords - 1) {
                wrapper.after($("<hr>"));
            }
        }
    });
}

var sortValue = "popular";

$("#search").on("click", function (event) {
    event.preventDefault();
    searchArticles();
});

$("#clear").on("click", function (event) {
    event.preventDefault();
    $("#searchTerm").val("");
    $("#numRecords").val(4);
    $("#startYear").val("");
    $("#endYear").val("");
    $("#top-articles").empty();
});

$("input[type=radio]").on("change", function() {
    sortValue = $("input:checked").val();
    if ($("#top-articles").html() == "") {
    } else {
        searchArticles();
    }
});

