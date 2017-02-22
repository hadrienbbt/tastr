/**
 * Created by hadrien1 on 12/02/17.
 */

'use strict';

var _conf = {
    splashscreen: './img/splashcreen3.png',
    moodmusic_logo : './img/moodmusic_logo.png',
    redirect_uri: 'tastr://',
    cookie_location: 'http://moodmusic.fr',
    bs_key: 'a54bb984be6f',
    bs_secret: '3d156f458b08f0c0be12a68c89673816',
}

function getConf() {
    return _conf
}

var conf = getConf()
module.exports = conf