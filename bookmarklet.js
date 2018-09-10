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
            let doc = parser.parseFromString(data, "text/html");
            let elements = doc.getElementsByClassName('basic_btn master_score_back m_10 p_5 t_l');
            for (let index=0; index < elements.length; index++){
                let music = elements[index];
                let name = music.getElementsByClassName('music_label p_5 break')[0].textContent;
                let level = music.getElementsByClassName('score_level t_c')[0].textContent;
                let techscore = music.getElementsByClassName('score_value master_score_value')[2].textContent;
                console.log(name, level, techscore);
            }
            resolve(doc);
            })
        });    
    }

    var getPlayerDetail = function () {
        return new Promise(function (resolve) {
            _ajax("https://ongeki-net.com/ongeki-mobile/home/playerDataDetail/", type = "get", {}).then(function (data) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(data, "text/html");
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