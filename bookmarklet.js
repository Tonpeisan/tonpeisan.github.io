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
    var showOverLay = function () {
        return new Promise(function (resolve) {
            $('body').css('-webkit-touch-callout', "default");
            $('body').css('-webkit-tap-highlight-color', "");
            $('img').css('-webkit-touch-callout', "default");
            $('img').css('-webkit-user-select', "");
            $('img').css('-moz-touch-callout', "default");
            $('img').css('-moz-user-select', "");
            $('img').css('touch-callout', "default");
            $('img').css('user-select', "auto");

            var overlay = $("<div>").addClass("ongeki_overview").attr("style", "color:black;font-size: 20px;padding-top: 20px;width: 100%; height:200%; text-align: left; position: absolute; top: 0; z-index: 100;background: rgba(0,0,0,0.7);");
            var textarea = $("<div>").attr("style", "padding:5px;background-color: #FFFFFF;width:40%;height:10%;margin:0 auto;");
            textarea.attr("id", "textarea")
            var imgarea = $("<div>").attr("style", "text-align:center;");
            var outputimage = $("<canvas>").attr("id", "draw_space");
            outputimage.attr("width", 375);
            outputimage.attr("height", 750);

            var animediv = $("<div>").addClass("ongeki_animetion");
            textarea.append(animediv);
            imgarea.append(outputimage);
            overlay.append(textarea);
            overlay.append(imgarea);
            $("body").append(overlay);
            overlay.show();

            var i = 1
            loadingAnime = [
                "loading.",
                "loading..",
                "loading...",
                "loading....",
                "loading.....",
                "loading......",
                "loading.......",
            ]
            setInterval(function () {
                $(".ongeki_animetion").text(loadingAnime[i % loadingAnime.length]);
                i++
            }, 200)
            resolve();
        });
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
    var getMusicInfo = function(music){
        try{
            let name = music.getElementsByClassName('music_label p_5 break')[0].textContent;
            let level = music.getElementsByClassName('score_level t_c')[0].textContent;
            let techscore = music.getElementsByClassName('score_value master_score_value')[2].textContent;
            techscore = Number(techscore.replace(/,/g, ''));
            let icon = music.getElementsByClassName('music_score_icon_area t_r f_0')[0].getElementsByTagName('img');
            let lamp = checkLamp(icon);
            return { name: name, level: level, score: techscore, rank: lamp[0], fb: lamp[1], combo: lamp[2] };
        }
        catch (e){
            console.log("No Play");
            return -1;
        }
    }
    var getScoreSummary = function(){
        return new Promise(function(resolve){
            _ajax("https://ongeki-net.com/ongeki-mobile/record/musicGenre/search/", type = "get", { genre: 99, diff: 3 }).then(function(data){
            var music_array = [];
            let parser = new DOMParser();
            let doc = parser.parseFromString(data, "text/html");
            let elements = doc.getElementsByClassName('basic_btn master_score_back m_10 p_5 t_l');
            for (let index=0; index < elements.length; index++){
                let music = elements[index];
                let music_info = getMusicInfo(music);
                if (music_info != -1)
                    music_array.push(music_info);
            }
            resolve(music_array);
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

    var calcAverageScore = function(data){
        return new Promise(function (resolve) {
            let level_array = ["10", "10+", "11", "11+", "12", "12+", "13", "13+", "14"];
            // let level_array = ["7+", "8", "8+", "9", "9+", "10", "10+", "11", "11+"];
            var average_array = [];
            for (let i = 0; i < level_array.length; i++) {               
                var match_data = $.grep(data, function(item, index){
                    return (item.level == level_array[i]);
                });
                let score = 0;
                if (match_data.length > 0){
                    for (var item in match_data) {
                        score += match_data[item].score;
                    }
                    score /= match_data.length;
                }
                score = Math.round(score);
                average_array.push({level: level_array[i], score: score});
            }
            resolve(average_array);
        });    
    }

    var drawCanvas = function(data){
        return new Promise(function (resolve) {
            var canvas = document.getElementById("draw_space");
            if (canvas.getContext){
                var ctx = canvas.getContext("2d");
                ctx.fillStyle = "rgba(255,255,255, 1)";
                ctx.fillRect(0,0,320,30*(data.length+2));
                ctx.font = '30px "ヒラギノ角ゴ Pro W3", "メイリオ", Meiryo, "ＭＳ Ｐゴシック", "MS P Gothic", sans-serif';
                ctx.fillStyle = "rgba(50,185,204, 0.65)";
                ctx.fillText("MASTER AVERAGE SCORE", 0, 30, 320);
                for (var i = 0; i < data.length; i++){
                   ctx.fillText(data[i].level + " " + data[i].score, 0, (i + 2) * 30, 320);
                }
            }
            resolve(data);
        });    
    }

    var setTweetButton = function(data){
        return new Promise(function (resolve) {
            let button = $("<div>").addClass("twitter-share-button");
            let text = "オンゲキ MASTER AVERAGE SCORE\n";
            for (var i = 0; i < data.length; i++) {
                text += data[i].level + " " + data[i].score;
                if (i % 2 == 1){
                    text += "\n";
                }
                else{
                    text += " ";
                }
            }
            text += "\n #オンゲキMAS平均スコア";
            let url = "https://tonpeisan.github.io";
            let tw_href = 'https://twitter.com/share?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url);
            let button_a = $("<a>").attr("href", tw_href);
            button_a.attr("style", "color:black;font-size: 20px;text-align: center;");
            button_a.text("Twitterで結果をつぶやく");
            
            button.append(button_a);
            $("#textarea").append(button);
            resolve();
        });    
    }
    //ここから逐次処理
    //右クリック禁止と長押しメニュー禁止を解除(ｺﾞﾒﾝﾈ)

    document.oncontextmenu = '';
    document.body.oncontextmenu = '';
    showOverLay().then(function(){
        return getScoreSummary();
    }).then(function(data){
        console.log(data); 
        return calcAverageScore(data);
    }).then(function(data){
        console.log(data);
        $("#textarea").empty();
        return drawCanvas(data);     
    }).then(function(data){
        return setTweetButton(data);
    }).then(function(){
        console.log("finished");
    });
}
)();