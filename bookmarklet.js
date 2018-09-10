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

    var checkLamp = function(icon){
        let tr_attr = icon[1].getAttribute("src");
        
        let technical_rank = 0;
        if(tr_attr.match(/tr_sssplus/)){
            technical_rank = 12;
        } else if (tr_attr.match(/tr_sss/)){
            technical_rank = 11;
        } else if (tr_attr.match(/tr_ss/)) {
            technical_rank = 10;
        } else if (tr_attr.match(/tr_s/)) {
            technical_rank = 9;
        } else if (tr_attr.match(/tr_aaa/)) {
            technical_rank = 8;
        } else if (tr_attr.match(/tr_aa/)) {
            technical_rank = 7;
        } else if (tr_attr.match(/tr_a/)) {
            technical_rank = 6;
        } else if (tr_attr.match(/tr_bbb/)) {
            technical_rank = 5;
        } else if (tr_attr.match(/tr_bb/)) {
            technical_rank = 4;
        } else if (tr_attr.match(/tr_b/)) {
            technical_rank = 3;
        } else if (tr_attr.match(/tr_c/)) {
            technical_rank = 2;
        } else if (tr_attr.match(/tr_d/)) {
            technical_rank = 1;
        } else {
            technical_rank = 0;
        }

        let bell_attr = icon[2].getAttribute("src");
        let fb = bell_attr.match(/icon_fb/) ? 1 : 0;
 
        let combo_attr = icon[3].getAttribute("src");
        let combo = combo_attr.match(/icon_ab/) ? 2 : combo_attr.match(/icon_fc/) ? 1 : 0;

        return [technical_rank, fb, combo]

    }
    var getTechnicalRank = function(rank){
        switch (rank) {
            case 0:
                return "Undefined";
            case 1:
                return "D";
            case 2:
                return "C";
            case 3:
                return "B";
            case 4:
                return "BB";
            case 5:
                return "BBB";
            case 6:
                return "A";
            case 7:
                return "AA";
            case 8:
                return "AAA";
            case 9:
                return "S";
            case 10:
                return "SS";
            case 11:
                return "SSS";
            case 12:
                return "SSS+";
            default:
                return "Undefined";
        }
    }
    var getFullBell = function (fb) {
        return fb == 1 ? "FB" : "  ";
    }
    var getCombo = function (fc) {
        return fc == 2 ? "AB" : fc == 1 ? "FC" : "  ";
    }
    var getLampInfo = function(lamp){
        return [getTechnicalRank(lamp[0]), getFullBell(lamp[1]), getCombo(lamp[2])];
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
                let icon = music.getElementsByClassName('music_score_icon_area t_r f_0')[0].getElementsByTagName('img');
                let lamp = checkLamp(icon);
                console.log(name, level, techscore, getLampInfo(lamp));
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