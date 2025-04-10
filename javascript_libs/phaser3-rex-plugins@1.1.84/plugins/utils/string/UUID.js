/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Creates and returns an RFC4122 version 4 compliant UUID.
 * 
 * The string is in the form: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` where each `x` is replaced with a random
 * hexadecimal digit from 0 to f, and `y` is replaced with a random hexadecimal digit from 8 to b.
 *
 * @function Phaser.Utils.String.UUID
 * @since 3.12.0
 *
 * @return {string} The UUID string.
 */
const HasBuiltRandomUUID = (window.crypto && window.crypto.randomUUID);

var UUID = function () {
    if (HasBuiltRandomUUID) {
        return window.crypto.randomUUID();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        var v = (c === 'x') ? r : (r & 0x3 | 0x8);

        return v.toString(16);
    });
};

export default UUID;
