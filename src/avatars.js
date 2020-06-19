import characterSheetAvatar0 from "./images/characterSheets/charactersheet-avatar-0.png";
import profileAvatar0 from "./images/profiles/profile-avatar-0.png";
import profileAvatar1 from "./images/profiles/profile-avatar-1.png";
import profileAvatar2 from "./images/profiles/profile-avatar-2.png";

const profileAvatars = [ profileAvatar0, profileAvatar1, profileAvatar2 ];
const characterSheetAvatars = [characterSheetAvatar0];
const characterSheetBackgrounds = [{
    background: 'linear-gradient(180deg, rgba(148,171,64,1) 0%, rgba(240,222,64,1) 100%)'
}]

/**
 * This file is here to export all of the different avatar possibilities.
 */
export default {profile: profileAvatars, characterSheet: characterSheetAvatars, characterSheetBackgrounds: characterSheetBackgrounds};