(function() { 

    var _ajax = function (url, type, payload) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: type,
                url: url,
                data: payload
            }).done(function (data, textStatus, jqXHR) {
                resolve(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
                reject("Error occured in ajax connection." + jqXHR.responseText);
            });
        })
    }
    var getScoreSummary = function(){
        return new Promise(function(resolve){
            _ajax("https://ongeki-net.com/ongeki-mobile/record/musicGenre/search/", type = "get", { genre: 99, diff: 3 }).then(function(data){
            let parser = new DOMParser();
            var doc = parser.parseFromString(data, "text/html");
            console.log(doc)
            resolve(doc);
            })
        });    
    }

    var getPlayerDetail = function () {
        return new Promise(function (resolve) {
            _ajax("https://ongeki-net.com/ongeki-mobile/home/playerDataDetail/", type = "get", {}).then(function (data) {
                let parser = new DOMParser();
                var doc = parser.parseFromString(data, "text/html");
                console.log(doc)
                resolve(doc);
            })
        });    
    }

    getScoreSummary()
    .then(function(doc){
        //console.log(doc);
    }).then(getPlayerDetail().then(function(doc) {
        //console.log(doc);        
    }));
}
)();