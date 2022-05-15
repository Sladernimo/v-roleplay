// ===========================================================================
// Vortrex's Roleplay Resource
// https://github.com/VortrexFTW/gtac_roleplay
// ===========================================================================
// FILE: utilities.js
// DESC: Provides shared utilities
// TYPE: Shared (JavaScript)
// ===========================================================================

let bindableKeys = {
	8: "backspace",
	9: "tab",
	13: "return",
	27: "escape",
	32: "space",
	33: "exclamation",
	34: "doublequote",
	35: "hashtag",
	36: "dollar",
	37: "percent",
	38: "ampersand",
	39: "quote",
	40: "leftparenthesis",
	41: "rightparenthesis",
	42: "asterisk",
	43: "plus",
	44: "comma",
	45: "minus",
	46: "period",
	47: "slash",
	48: "0",
	49: "1",
	50: "2",
	51: "3",
	52: "4",
	53: "5",
	54: "6",
	55: "7",
	56: "8",
	57: "9",
	58: "colon",
	59: "semicolon",
	60: "less",
	61: "equals",
	62: "greater",
	63: "questionmark",
	64: "at",
	91: "leftbracket",
	92: "backslash",
	93: "rightbracket",
	95: "underscore",
	97: "a",
	98: "b",
	99: "c",
	100: "d",
	101: "e",
	102: "f",
	103: "g",
	104: "h",
	105: "i",
	106: "j",
	107: "k",
	108: "l",
	109: "m",
	110: "n",
	111: "o",
	112: "p",
	113: "q",
	114: "r",
	115: "s",
	116: "t",
	117: "u",
	118: "v",
	119: "w",
	120: "x",
	121: "y",
	122: "z",
	127: "delete",
	1073741881: "capslock",
	1073741882: "f12",
	1073741883: "f2",
	1073741884: "f3",
	1073741885: "f4",
	1073741886: "f5",
	1073741887: "f6",
	1073741888: "f7",
	1073741889: "f8",
	1073741890: "f9",
	1073741891: "f10",
	1073741892: "f11",
	1073741893: "f12",
	1073741894: "printscreen",
	1073741895: "scrolllock",
	1073741896: "pause",
	1073741897: "insert",
	1073741898: "home",
	1073741899: "pageup",
	1073741901: "end",
	1073741902: "pagedown",
	1073741903: "right",
	1073741904: "left",
	1073741905: "down",
	1073741906: "up",
	1073741908: "numdivide",
	1073741909: "nummultiply",
	1073741910: "numminus",
	1073741911: "numplus",
	1073741912: "numenter",
	1073741913: "num1",
	1073741914: "num2",
	1073741915: "num3",
	1073741916: "num4",
	1073741917: "num5",
	1073741918: "num6",
	1073741919: "num7",
	1073741920: "num8",
	1073741921: "num9",
	1073741922: "num0",
	1073741923: "numperiod",
	1073742048: "leftctrl",
	1073742049: "leftshift",
	1073742050: "leftalt",
	1073742052: "rightctrl",
	1073742053: "rightshift",
	1073742054: "rightalt",
};

// ===========================================================================

let serverColours = {
	hex: {
		byType: {
			talkMessage: "C8C8C8",
			shoutMessage: "FFFFC8",
			whisperMessage: "828282",
			doActionMessage: "B19CD9",
			meActionMessage: "B19CD9",
			errorMessage: "ED4337",
			syntaxMessage: "C8C8C8",
			normalMessage: "FFFFFF",
			alertMessage: "FFFF00",
			successMessage: "00B400",
			clanChatMessage: "00BE00",
			businessBlue: "0099FF",
			houseGreen: "11CC11",
			clanOrange: "FF9900",
			vehiclePurple: "960096",
			jobYellow: "FFFF00",
			npcPink: "DB7093",
		},
		byName: {
			white: "FFFFFF",
			black: "000000",
			red: "FF0000",
			yellow: "FFFF00",
			royalBlue: "0000FF",
			teal: "00FFFF",
			orange: "FF8000",
			softRed: "ED4337",
			softGreen: "32CD32",
			lightPurple: "960096",
			lightGrey: "C8C8C8",
			mediumGrey: "969696",
			darkGrey: "404040",
			policeBlue: "3250C8",
			medicPink: "DB7093",
			firefighterRed: "CD3C3C",
			busDriverGreen: "32A032",
			taxiDriverYellow: "F0E664",
			deliveryPurple: "B19CD9",
			civilianWhite: "C8C8C8",
			burntYellow: "D2D200",
			burntOrange: "D27800",
			bankGreen: "00B400",
			softYellow: "EAC67E",
			businessBlue: "0099FF",
			houseGreen: "11CC11",
			clanOrange: "FF9900",
			vehiclePurple: "960096",
			jobYellow: "FFFF00",
			adminOrange: "ED4337",
		},
	},

	byType: {
		talkMessage: toColour(200, 200, 200),
		shoutMessage: toColour(255, 255, 200),
		whisperMessage: toColour(130, 130, 130),
		doActionMessage: toColour(177, 156, 217, 255),
		meActionMessage: toColour(177, 156, 217, 255),
		errorMessage: toColour(237, 67, 55, 255),
		syntaxMessage: toColour(200, 200, 200, 255),
		normalMessage: toColour(255, 255, 255, 255),
		alertMessage: toColour(255, 255, 0, 255),
		successMessage: toColour(0, 180, 0, 255),
		clanChatMessage: toColour(0, 190, 0, 255),
		policeBlue: toColour(50, 80, 200, 255),
		medicPink: toColour(219, 112, 147, 255),
		firefighterRed: toColour(205, 60, 60, 255),
		busDriverGreen: toColour(50, 160, 50, 255),
		taxiDriverYellow: toColour(240, 230, 100, 255),
		deliveryPurple: toColour(177, 156, 217, 255),
		civilianWhite: toColour(200, 200, 200, 255),
		burntYellow: toColour(210, 210, 0, 255),
		burntOrange: toColour(210, 120, 0, 255),
		bankGreen: toColour(0, 150, 0, 255),
		softYellow: toColour(234, 198, 126, 255),
		businessBlue: toColour(0, 153, 255, 255),
		houseGreen: toColour(17, 204, 17, 255),
		clanOrange: toColour(255, 153, 0, 255),
		npcPink: toColour(219, 112, 147, 255),
		adminOrange: toColour(205, 60, 60, 255),
	},
	byName: {
		white: toColour(255, 255, 255, 255),
		black: toColour(0, 0, 0, 255),
		red: toColour(255, 0, 0, 255),
		yellow: toColour(255, 255, 0, 255),
		royalBlue: toColour(0, 0, 255, 255),
		teal: toColour(0, 255, 255, 255),
		orange: toColour(255, 128, 0, 255),
		softRed: toColour(205, 60, 60, 255),
		softGreen: toColour(50, 205, 50, 255),
		lightPurple: toColour(150, 0, 150, 255),
		lightGrey: toColour(200, 200, 200, 255),
		mediumGrey: toColour(150, 150, 150, 255),
		darkGrey: toColour(64, 64, 64, 255),
		policeBlue: toColour(50, 80, 200, 255),
		medicPink: toColour(219, 112, 147, 255),
		firefighterRed: toColour(205, 60, 60, 255),
		busDriverGreen: toColour(50, 160, 50, 255),
		taxiDriverYellow: toColour(240, 230, 100, 255),
		deliveryPurple: toColour(177, 156, 217, 255),
		civilianWhite: toColour(200, 200, 200, 255),
		burntYellow: toColour(210, 210, 0, 255),
		burntOrange: toColour(210, 120, 0, 255),
		bankGreen: toColour(0, 150, 0, 255),
		softYellow: toColour(234, 198, 126, 255),
		businessBlue: toColour(0, 153, 255, 255),
		houseGreen: toColour(17, 204, 17, 255),
		clanOrange: toColour(255, 153, 0, 255),
		npcPink: toColour(219, 112, 147, 255),
		adminOrange: toColour(205, 60, 60, 255),
	},
};

// ===========================================================================

let serverEmoji = [
	[":hash:", "#"],
	[":zero:", "0"],
	[":one:", "1"],
	[":two:", "2"],
	[":three:", "3"],
	[":four:", "4"],
	[":five:", "5"],
	[":six:", "6"],
	[":seven:", "7"],
	[":eight:", "8"],
	[":nine:", "9"],
	[":copyright:", "©"],
	[":registered:", "®"],
	[":bangbang:", "‼"],
	[":interrobang:", "⁉"],
	[":tm:", "™"],
	[":information_source:", "ℹ"],
	[":left_right_arrow:", "↔"],
	[":arrow_up_down:", "↕"],
	[":arrow_upper_left:", "↖"],
	[":arrow_upper_right:", "↗"],
	[":arrow_lower_right:", "↘"],
	[":arrow_lower_left:", "↙"],
	[":leftwards_arrow_with_hook:", "↩"],
	[":arrow_right_hook:", "↪"],
	[":watch:", "⌚"],
	[":hourglass:", "⌛"],
	[":fast_forward:", "⏩"],
	[":rewind:", "⏪"],
	[":arrow_double_up:", "⏫"],
	[":arrow_double_down:", "⏬"],
	[":alarm_clock:", "⏰"],
	[":hourglass_flowing_sand:", "⏳"],
	[":m:", "ⓜ"],
	[":black_small_square:", "▪"],
	[":white_small_square:", "▫"],
	[":arrow_forward:", "▶"],
	[":arrow_backward:", "◀"],
	[":white_medium_square:", "◻"],
	[":black_medium_square:", "◼"],
	[":white_medium_small_square:", "◽"],
	[":black_medium_small_square:", "◾"],
	[":sunny:", "☀"],
	[":cloud:", "☁"],
	[":telephone:", "☎"],
	[":ballot_box_with_check:", "☑"],
	[":umbrella:", "☔"],
	[":coffee:", "☕"],
	[":point_up:", "☝"],
	[":relaxed:", "☺"],
	[":aries:", "♈"],
	[":taurus:", "♉"],
	[":gemini:", "♊"],
	[":cancer:", "♋"],
	[":leo:", "♌"],
	[":virgo:", "♍"],
	[":libra:", "♎"],
	[":scorpius:", "♏"],
	[":sagittarius:", "♐"],
	[":capricorn:", "♑"],
	[":aquarius:", "♒"],
	[":pisces:", "♓"],
	[":spades:", "♠"],
	[":clubs:", "♣"],
	[":hearts:", "♥"],
	[":diamonds:", "♦"],
	[":hotsprings:", "♨"],
	[":recycle:", "♻"],
	[":wheelchair:", "♿"],
	[":anchor:", "⚓"],
	[":warning:", "⚠"],
	[":zap:", "⚡"],
	[":white_circle:", "⚪"],
	[":black_circle:", "⚫"],
	[":soccer:", "⚽"],
	[":baseball:", "⚾"],
	[":snowman:", "⛄"],
	[":partly_sunny:", "⛅"],
	[":ophiuchus:", "⛎"],
	[":no_entry:", "⛔"],
	[":church:", "⛪"],
	[":fountain:", "⛲"],
	[":golf:", "⛳"],
	[":sailboat:", "⛵"],
	[":tent:", "⛺"],
	[":fuelpump:", "⛽"],
	[":scissors:", "✂"],
	[":white_check_mark:", "✅"],
	[":airplane:", "✈"],
	[":envelope:", "✉"],
	[":fist:", "✊"],
	[":raised_hand:", "✋"],
	[":v:", "✌"],
	[":pencil2:", "✏"],
	[":black_nib:", "✒"],
	[":heavy_check_mark:", "✔"],
	[":heavy_multiplication_x:", "✖"],
	[":sparkles:", "✨"],
	[":eight_spoked_asterisk:", "✳"],
	[":eight_pointed_black_star:", "✴"],
	[":snowflake:", "❄"],
	[":sparkle:", "❇"],
	[":x:", "❌"],
	[":negative_squared_cross_mark:", "❎"],
	[":question:", "❓"],
	[":grey_question:", "❔"],
	[":grey_exclamation:", "❕"],
	[":exclamation:", "❗"],
	[":heart:", "❤"],
	[":heavy_plus_sign:", "➕"],
	[":heavy_minus_sign:", "➖"],
	[":heavy_division_sign:", "➗"],
	[":arrow_right:", "➡"],
	[":curly_loop:", "➰"],
	[":arrow_heading_up:", "⤴"],
	[":arrow_heading_down:", "⤵"],
	[":arrow_left:", "⬅"],
	[":arrow_up:", "⬆"],
	[":arrow_down:", "⬇"],
	[":black_large_square:", "⬛"],
	[":white_large_square:", "⬜"],
	[":star:", "⭐"],
	[":o:", "⭕"],
	[":wavy_dash:", "〰"],
	[":part_alternation_mark:", "〽"],
	[":congratulations:", "㊗"],
	[":secret:", "㊙"],
	[":mahjong:", "🀄"],
	[":black_joker:", "🃏"],
	[":a:", "🅰"],
	[":b:", "🅱"],
	[":o2:", "🅾"],
	[":parking:", "🅿"],
	[":ab:", "🆎"],
	[":cl:", "🆑"],
	[":cool:", "🆒"],
	[":free:", "🆓"],
	[":id:", "🆔"],
	[":new:", "🆕"],
	[":ng:", "🆖"],
	[":ok:", "🆗"],
	[":sos:", "🆘"],
	[":up:", "🆙"],
	[":vs:", "🆚"],
	[":cn:", "🇨 🇳"],
	[":de:", "🇩 🇪"],
	[":es:", "🇪 🇸"],
	[":fr:", "🇫 🇷"],
	[":uk:", "🇬 🇧"],
	[":it:", "🇮 🇹"],
	[":jp:", "🇯 🇵"],
	[":kr:", "🇰 🇷"],
	[":ru:", "🇷 🇺"],
	[":us:", "🇺 🇸"],
	[":koko:", "🈁"],
	[":sa:", "🈂"],
	[":u7121:", "🈚"],
	[":u6307:", "🈯"],
	[":u7981:", "🈲"],
	[":u7a7a:", "🈳"],
	[":u5408:", "🈴"],
	[":u6e80:", "🈵"],
	[":u6709:", "🈶"],
	[":u6708:", "🈷"],
	[":u7533:", "🈸"],
	[":u5272:", "🈹"],
	[":u55b6:", "🈺"],
	[":ideograph_advantage:", "🉐"],
	[":accept:", "🉑"],
	[":cyclone:", "🌀"],
	[":foggy:", "🌁"],
	[":closed_umbrella:", "🌂"],
	[":night_with_stars:", "🌃"],
	[":sunrise_over_mountains:", "🌄"],
	[":sunrise:", "🌅"],
	[":city_sunset:", "🌆"],
	[":city_sunrise:", "🌇"],
	[":rainbow:", "🌈"],
	[":bridge_at_night:", "🌉"],
	[":ocean:", "🌊"],
	[":volcano:", "🌋"],
	[":milky_way:", "🌌"],
	[":earth_asia:", "🌏"],
	[":new_moon:", "🌑"],
	[":first_quarter_moon:", "🌓"],
	[":waxing_gibbous_moon:", "🌔"],
	[":full_moon:", "🌕"],
	[":crescent_moon:", "🌙"],
	[":first_quarter_moon_with_face:", "🌛"],
	[":star2:", "🌟"],
	[":stars:", "🌠"],
	[":chestnut:", "🌰"],
	[":seedling:", "🌱"],
	[":palm_tree:", "🌴"],
	[":cactus:", "🌵"],
	[":tulip:", "🌷"],
	[":cherry_blossom:", "🌸"],
	[":rose:", "🌹"],
	[":hibiscus:", "🌺"],
	[":sunflower:", "🌻"],
	[":blossom:", "🌼"],
	[":corn:", "🌽"],
	[":ear_of_rice:", "🌾"],
	[":herb:", "🌿"],
	[":four_leaf_clover:", "🍀"],
	[":maple_leaf:", "🍁"],
	[":fallen_leaf:", "🍂"],
	[":leaves:", "🍃"],
	[":mushroom:", "🍄"],
	[":tomato:", "🍅"],
	[":eggplant:", "🍆"],
	[":grapes:", "🍇"],
	[":melon:", "🍈"],
	[":watermelon:", "🍉"],
	[":tangerine:", "🍊"],
	[":banana:", "🍌"],
	[":pineapple:", "🍍"],
	[":apple:", "🍎"],
	[":green_apple:", "🍏"],
	[":peach:", "🍑"],
	[":cherries:", "🍒"],
	[":strawberry:", "🍓"],
	[":hamburger:", "🍔"],
	[":pizza:", "🍕"],
	[":meat_on_bone:", "🍖"],
	[":poultry_leg:", "🍗"],
	[":rice_cracker:", "🍘"],
	[":rice_ball:", "🍙"],
	[":rice:", "🍚"],
	[":curry:", "🍛"],
	[":ramen:", "🍜"],
	[":spaghetti:", "🍝"],
	[":bread:", "🍞"],
	[":fries:", "🍟"],
	[":sweet_potato:", "🍠"],
	[":dango:", "🍡"],
	[":oden:", "🍢"],
	[":sushi:", "🍣"],
	[":fried_shrimp:", "🍤"],
	[":fish_cake:", "🍥"],
	[":icecream:", "🍦"],
	[":shaved_ice:", "🍧"],
	[":ice_cream:", "🍨"],
	[":doughnut:", "🍩"],
	[":cookie:", "🍪"],
	[":chocolate_bar:", "🍫"],
	[":candy:", "🍬"],
	[":lollipop:", "🍭"],
	[":custard:", "🍮"],
	[":honey_pot:", "🍯"],
	[":cake:", "🍰"],
	[":bento:", "🍱"],
	[":stew:", "🍲"],
	[":egg:", "🍳"],
	[":fork_and_knife:", "🍴"],
	[":tea:", "🍵"],
	[":sake:", "🍶"],
	[":wine_glass:", "🍷"],
	[":cocktail:", "🍸"],
	[":tropical_drink:", "🍹"],
	[":beer:", "🍺"],
	[":beers:", "🍻"],
	[":ribbon:", "🎀"],
	[":gift:", "🎁"],
	[":birthday:", "🎂"],
	[":jack_o_lantern:", "🎃"],
	[":christmas_tree:", "🎄"],
	[":santa:", "🎅"],
	[":fireworks:", "🎆"],
	[":sparkler:", "🎇"],
	[":balloon:", "🎈"],
	[":tada:", "🎉"],
	[":confetti_ball:", "🎊"],
	[":tanabata_tree:", "🎋"],
	[":crossed_flags:", "🎌"],
	[":bamboo:", "🎍"],
	[":dolls:", "🎎"],
	[":flags:", "🎏"],
	[":wind_chime:", "🎐"],
	[":rice_scene:", "🎑"],
	[":school_satchel:", "🎒"],
	[":mortar_board:", "🎓"],
	[":carousel_horse:", "🎠"],
	[":ferris_wheel:", "🎡"],
	[":roller_coaster:", "🎢"],
	[":fishing_pole_and_fish:", "🎣"],
	[":microphone:", "🎤"],
	[":movie_camera:", "🎥"],
	[":cinema:", "🎦"],
	[":headphones:", "🎧"],
	[":art:", "🎨"],
	[":tophat:", "🎩"],
	[":circus_tent:", "🎪"],
	[":ticket:", "🎫"],
	[":clapper:", "🎬"],
	[":performing_arts:", "🎭"],
	[":video_game:", "🎮"],
	[":dart:", "🎯"],
	[":slot_machine:", "🎰"],
	[":_8ball:", "🎱"],
	[":game_die:", "🎲"],
	[":bowling:", "🎳"],
	[":flower_playing_cards:", "🎴"],
	[":musical_note:", "🎵"],
	[":notes:", "🎶"],
	[":saxophone:", "🎷"],
	[":guitar:", "🎸"],
	[":musical_keyboard:", "🎹"],
	[":trumpet:", "🎺"],
	[":violin:", "🎻"],
	[":musical_score:", "🎼"],
	[":running_shirt_with_sash:", "🎽"],
	[":tennis:", "🎾"],
	[":ski:", "🎿"],
	[":basketball:", "🏀"],
	[":checkered_flag:", "🏁"],
	[":snowboarder:", "🏂"],
	[":runner:", "🏃"],
	[":surfer:", "🏄"],
	[":trophy:", "🏆"],
	[":football:", "🏈"],
	[":swimmer:", "🏊"],
	[":house:", "🏠"],
	[":house_with_garden:", "🏡"],
	[":office:", "🏢"],
	[":post_office:", "🏣"],
	[":hospital:", "🏥"],
	[":bank:", "🏦"],
	[":atm:", "🏧"],
	[":hotel:", "🏨"],
	[":love_hotel:", "🏩"],
	[":convenience_store:", "🏪"],
	[":school:", "🏫"],
	[":department_store:", "🏬"],
	[":factory:", "🏭"],
	[":izakaya_lantern:", "🏮"],
	[":japanese_castle:", "🏯"],
	[":european_castle:", "🏰"],
	[":snail:", "🐌"],
	[":snake:", "🐍"],
	[":racehorse:", "🐎"],
	[":sheep:", "🐑"],
	[":monkey:", "🐒"],
	[":chicken:", "🐔"],
	[":boar:", "🐗"],
	[":elephant:", "🐘"],
	[":octopus:", "🐙"],
	[":shell:", "🐚"],
	[":bug:", "🐛"],
	[":ant:", "🐜"],
	[":bee:", "🐝"],
	[":beetle:", "🐞"],
	[":fish:", "🐟"],
	[":tropical_fish:", "🐠"],
	[":blowfish:", "🐡"],
	[":turtle:", "🐢"],
	[":hatching_chick:", "🐣"],
	[":baby_chick:", "🐤"],
	[":hatched_chick:", "🐥"],
	[":bird:", "🐦"],
	[":penguin:", "🐧"],
	[":koala:", "🐨"],
	[":poodle:", "🐩"],
	[":camel:", "🐫"],
	[":dolphin:", "🐬"],
	[":mouse:", "🐭"],
	[":cow:", "🐮"],
	[":tiger:", "🐯"],
	[":rabbit:", "🐰"],
	[":cat:", "🐱"],
	[":dragon_face:", "🐲"],
	[":whale:", "🐳"],
	[":horse:", "🐴"],
	[":monkey_face:", "🐵"],
	[":dog:", "🐶"],
	[":pig:", "🐷"],
	[":frog:", "🐸"],
	[":hamster:", "🐹"],
	[":wolf:", "🐺"],
	[":bear:", "🐻"],
	[":panda_face:", "🐼"],
	[":pig_nose:", "🐽"],
	[":feet:", "🐾"],
	[":eyes:", "👀"],
	[":ear:", "👂"],
	[":nose:", "👃"],
	[":lips:", "👄"],
	[":tongue:", "👅"],
	[":point_up_2:", "👆"],
	[":point_down:", "👇"],
	[":point_left:", "👈"],
	[":point_right:", "👉"],
	[":punch:", "👊"],
	[":wave:", "👋"],
	[":ok_hand:", "👌"],
	[":thumbsup:", "👍"],
	[":thumbsdown:", "👎"],
	[":clap:", "👏"],
	[":open_hands:", "👐"],
	[":crown:", "👑"],
	[":womans_hat:", "👒"],
	[":eyeglasses:", "👓"],
	[":necktie:", "👔"],
	[":shirt:", "👕"],
	[":jeans:", "👖"],
	[":dress:", "👗"],
	[":kimono:", "👘"],
	[":bikini:", "👙"],
	[":womans_clothes:", "👚"],
	[":purse:", "👛"],
	[":handbag:", "👜"],
	[":pouch:", "👝"],
	[":mans_shoe:", "👞"],
	[":athletic_shoe:", "👟"],
	[":high_heel:", "👠"],
	[":sandal:", "👡"],
	[":boot:", "👢"],
	[":footprints:", "👣"],
	[":bust_in_silhouette:", "👤"],
	[":boy:", "👦"],
	[":girl:", "👧"],
	[":man:", "👨"],
	[":woman:", "👩"],
	[":family:", "👪"],
	[":couple:", "👫"],
	[":cop:", "👮"],
	[":dancers:", "👯"],
	[":bride_with_veil:", "👰"],
	[":person_with_blond_hair:", "👱"],
	[":man_with_gua_pi_mao:", "👲"],
	[":man_with_turban:", "👳"],
	[":older_man:", "👴"],
	[":older_woman:", "👵"],
	[":baby:", "👶"],
	[":construction_worker:", "👷"],
	[":princess:", "👸"],
	[":japanese_ogre:", "👹"],
	[":japanese_goblin:", "👺"],
	[":ghost:", "👻"],
	[":angel:", "👼"],
	[":alien:", "👽"],
	[":space_invader:", "👾"],
	[":robot_face:", "🤖"],
	[":imp:", "👿"],
	[":skull:", "💀"],
	[":information_desk_person:", "💁"],
	[":guardsman:", "💂"],
	[":dancer:", "💃"],
	[":lipstick:", "💄"],
	[":nail_care:", "💅"],
	[":massage:", "💆"],
	[":haircut:", "💇"],
	[":barber:", "💈"],
	[":syringe:", "💉"],
	[":pill:", "💊"],
	[":kiss:", "💋"],
	[":love_letter:", "💌"],
	[":ring:", "💍"],
	[":gem:", "💎"],
	[":couplekiss:", "💏"],
	[":bouquet:", "💐"],
	[":couple_with_heart:", "💑"],
	[":wedding:", "💒"],
	[":heartbeat:", "💓"],
	[":broken_heart:", "💔"],
	[":two_hearts:", "💕"],
	[":sparkling_heart:", "💖"],
	[":heartpulse:", "💗"],
	[":cupid:", "💘"],
	[":blue_heart:", "💙"],
	[":green_heart:", "💚"],
	[":yellow_heart:", "💛"],
	[":purple_heart:", "💜"],
	[":gift_heart:", "💝"],
	[":revolving_hearts:", "💞"],
	[":heart_decoration:", "💟"],
	[":diamond_shape_with_a_dot_inside:", "💠"],
	[":bulb:", "💡"],
	[":anger:", "💢"],
	[":bomb:", "💣"],
	[":zzz:", "💤"],
	[":boom:", "💥"],
	[":sweat_drops:", "💦"],
	[":droplet:", "💧"],
	[":dash:", "💨"],
	[":poop:", "💩"],
	[":muscle:", "💪"],
	[":dizzy:", "💫"],
	[":speech_balloon:", "💬"],
	[":white_flower:", "💮"],
	[":_100:", "💯"],
	[":moneybag:", "💰"],
	[":currency_exchange:", "💱"],
	[":heavy_dollar_sign:", "💲"],
	[":credit_card:", "💳"],
	[":yen:", "💴"],
	[":dollar:", "💵"],
	[":money_with_wings:", "💸"],
	[":chart:", "💹"],
	[":seat:", "💺"],
	[":computer:", "💻"],
	[":briefcase:", "💼"],
	[":minidisc:", "💽"],
	[":floppy_disk:", "💾"],
	[":cd:", "💿"],
	[":dvd:", "📀"],
	[":file_folder:", "📁"],
	[":open_file_folder:", "📂"],
	[":page_with_curl:", "📃"],
	[":page_facing_up:", "📄"],
	[":date:", "📅"],
	[":calendar:", "📆"],
	[":card_index:", "📇"],
	[":chart_with_upwards_trend:", "📈"],
	[":chart_with_downwards_trend:", "📉"],
	[":bar_chart:", "📊"],
	[":clipboard:", "📋"],
	[":pushpin:", "📌"],
	[":round_pushpin:", "📍"],
	[":paperclip:", "📎"],
	[":straight_ruler:", "📏"],
	[":triangular_ruler:", "📐"],
	[":bookmark_tabs:", "📑"],
	[":ledger:", "📒"],
	[":notebook:", "📓"],
	[":notebook_with_decorative_cover:", "📔"],
	[":closed_book:", "📕"],
	[":book:", "📖"],
	[":green_book:", "📗"],
	[":blue_book:", "📘"],
	[":orange_book:", "📙"],
	[":books:", "📚"],
	[":name_badge:", "📛"],
	[":scroll:", "📜"],
	[":pencil:", "📝"],
	[":telephone_receiver:", "📞"],
	[":pager:", "📟"],
	[":fax:", "📠"],
	[":satellite:", "📡"],
	[":loudspeaker:", "📢"],
	[":mega:", "📣"],
	[":outbox_tray:", "📤"],
	[":inbox_tray:", "📥"],
	[":package:", "📦"],
	[":e_mail:", "📧"],
	[":incoming_envelope:", "📨"],
	[":envelope_with_arrow:", "📩"],
	[":mailbox_closed:", "📪"],
	[":mailbox:", "📫"],
	[":postbox:", "📮"],
	[":newspaper:", "📰"],
	[":iphone:", "📱"],
	[":calling:", "📲"],
	[":vibration_mode:", "📳"],
	[":mobile_phone_off:", "📴"],
	[":signal_strength:", "📶"],
	[":camera:", "📷"],
	[":video_camera:", "📹"],
	[":tv:", "📺"],
	[":radio:", "📻"],
	[":vhs:", "📼"],
	[":arrows_clockwise:", "🔃"],
	[":loud_sound:", "🔊"],
	[":battery:", "🔋"],
	[":electric_plug:", "🔌"],
	[":mag:", "🔍"],
	[":mag_right:", "🔎"],
	[":lock_with_ink_pen:", "🔏"],
	[":closed_lock_with_key:", "🔐"],
	[":key:", "🔑"],
	[":lock:", "🔒"],
	[":unlock:", "🔓"],
	[":bell:", "🔔"],
	[":bookmark:", "🔖"],
	[":link:", "🔗"],
	[":radio_button:", "🔘"],
	[":back:", "🔙"],
	[":end:", "🔚"],
	[":on:", "🔛"],
	[":soon:", "🔜"],
	[":top:", "🔝"],
	[":underage:", "🔞"],
	[":keycap_ten:", "🔟"],
	[":capital_abcd:", "🔠"],
	[":abcd:", "🔡"],
	[":_1234:", "🔢"],
	[":symbols:", "🔣"],
	[":abc:", "🔤"],
	[":fire:", "🔥"],
	[":flashlight:", "🔦"],
	[":wrench:", "🔧"],
	[":hammer:", "🔨"],
	[":nut_and_bolt:", "🔩"],
	[":knife:", "🔪"],
	[":gun:", "🔫"],
	[":crystal_ball:", "🔮"],
	[":six_pointed_star:", "🔯"],
	[":beginner:", "🔰"],
	[":trident:", "🔱"],
	[":black_square_button:", "🔲"],
	[":white_square_button:", "🔳"],
	[":red_circle:", "🔴"],
	[":large_blue_circle:", "🔵"],
	[":large_orange_diamond:", "🔶"],
	[":large_blue_diamond:", "🔷"],
	[":small_orange_diamond:", "🔸"],
	[":small_blue_diamond:", "🔹"],
	[":small_red_triangle:", "🔺"],
	[":small_red_triangle_down:", "🔻"],
	[":arrow_up_small:", "🔼"],
	[":arrow_down_small:", "🔽"],
	[":clock1:", "🕐"],
	[":clock2:", "🕑"],
	[":clock3:", "🕒"],
	[":clock4:", "🕓"],
	[":clock5:", "🕔"],
	[":clock6:", "🕕"],
	[":clock7:", "🕖"],
	[":clock8:", "🕗"],
	[":clock9:", "🕘"],
	[":clock10:", "🕙"],
	[":clock11:", "🕚"],
	[":clock12:", "🕛"],
	[":mount_fuji:", "🗻"],
	[":tokyo_tower:", "🗼"],
	[":statue_of_liberty:", "🗽"],
	[":japan:", "🗾"],
	[":moyai:", "🗿"],
	[":grin:", "😁"],
	[":joy:", "😂"],
	[":smiley:", "😃"],
	[":smile:", "😄"],
	[":sweat_smile:", "😅"],
	[":laughing:", "😆"],
	[":wink:", "😉"],
	[":blush:", "😊"],
	[":yum:", "😋"],
	[":relieved:", "😌"],
	[":heart_eyes:", "😍"],
	[":smirk:", "😏"],
	[":unamused:", "😒"],
	[":sweat:", "😓"],
	[":pensive:", "😔"],
	[":confounded:", "😖"],
	[":kissing_heart:", "😘"],
	[":kissing_closed_eyes:", "😚"],
	[":stuck_out_tongue_winking_eye:", "😜"],
	[":stuck_out_tongue_closed_eyes:", "😝"],
	[":disappointed:", "😞"],
	[":angry:", "😠"],
	[":rage:", "😡"],
	[":cry:", "😢"],
	[":persevere:", "😣"],
	[":triumph:", "😤"],
	[":disappointed_relieved:", "😥"],
	[":fearful:", "😨"],
	[":weary:", "😩"],
	[":sleepy:", "😪"],
	[":tired_face:", "😫"],
	[":sob:", "😭"],
	[":cold_sweat:", "😰"],
	[":scream:", "😱"],
	[":astonished:", "😲"],
	[":flushed:", "😳"],
	[":dizzy_face:", "😵"],
	[":mask:", "😷"],
	[":smile_cat:", "😸"],
	[":joy_cat:", "😹"],
	[":smiley_cat:", "😺"],
	[":heart_eyes_cat:", "😻"],
	[":smirk_cat:", "😼"],
	[":kissing_cat:", "😽"],
	[":pouting_cat:", "😾"],
	[":crying_cat_face:", "😿"],
	[":scream_cat:", "🙀"],
	[":no_good:", "🙅"],
	[":ok_woman:", "🙆"],
	[":bow:", "🙇"],
	[":see_no_evil:", "🙈"],
	[":hear_no_evil:", "🙉"],
	[":speak_no_evil:", "🙊"],
	[":raising_hand:", "🙋"],
	[":raised_hands:", "🙌"],
	[":person_frowning:", "🙍"],
	[":person_with_pouting_face:", "🙎"],
	[":pray:", "🙏"],
	[":rocket:", "🚀"],
	[":railway_car:", "🚃"],
	[":bullettrain_side:", "🚄"],
	[":bullettrain_front:", "🚅"],
	[":metro:", "🚇"],
	[":station:", "🚉"],
	[":bus:", "🚌"],
	[":busstop:", "🚏"],
	[":ambulance:", "🚑"],
	[":fire_engine:", "🚒"],
	[":police_car:", "🚓"],
	[":taxi:", "🚕"],
	[":red_car:", "🚗"],
	[":blue_car:", "🚙"],
	[":truck:", "🚚"],
	[":ship:", "🚢"],
	[":speedboat:", "🚤"],
	[":traffic_light:", "🚥"],
	[":construction:", "🚧"],
	[":rotating_light:", "🚨"],
	[":triangular_flag_on_post:", "🚩"],
	[":door:", "🚪"],
	[":no_entry_sign:", "🚫"],
	[":smoking:", "🚬"],
	[":no_smoking:", "🚭"],
	[":bike:", "🚲"],
	[":walking:", "🚶"],
	[":mens:", "🚹"],
	[":womens:", "🚺"],
	[":restroom:", "🚻"],
	[":baby_symbol:", "🚼"],
	[":toilet:", "🚽"],
	[":wc:", "🚾"],
	[":bath:", "🛀"],
	[":articulated_lorry:", "🚛"],
	[":kissing_smiling_eyes:", "😙"],
	[":pear:", "🍐"],
	[":bicyclist:", "🚴"],
	[":rabbit2:", "🐇"],
	[":clock830:", "🕣"],
	[":train:", "🚋"],
	[":oncoming_automobile:", "🚘"],
	[":expressionless:", "😑"],
	[":smiling_imp:", "😈"],
	[":frowning:", "😦"],
	[":no_mouth:", "😶"],
	[":baby_bottle:", "🍼"],
	[":non_potable_water:", "🚱"],
	[":open_mouth:", "😮"],
	[":last_quarter_moon_with_face:", "🌜"],
	[":do_not_litter:", "🚯"],
	[":sunglasses:", "😎"],
	[":loop:", "➿"],
	[":last_quarter_moon:", "🌗"],
	[":grinning:", "😀"],
	[":euro:", "💶"],
	[":clock330:", "🕞"],
	[":telescope:", "🔭"],
	[":globe_with_meridians:", "🌐"],
	[":postal_horn:", "📯"],
	[":stuck_out_tongue:", "😛"],
	[":clock1030:", "🕥"],
	[":pound:", "💷"],
	[":two_men_holding_hands:", "👬"],
	[":tiger2:", "🐅"],
	[":anguished:", "😧"],
	[":vertical_traffic_light:", "🚦"],
	[":confused:", "😕"],
	[":repeat:", "🔁"],
	[":oncoming_police_car:", "🚔"],
	[":tram:", "🚊"],
	[":dragon:", "🐉"],
	[":earth_americas:", "🌎"],
	[":rugby_football:", "🏉"],
	[":left_luggage:", "🛅"],
	[":sound:", "🔉"],
	[":clock630:", "🕡"],
	[":dromedary_camel:", "🐪"],
	[":oncoming_bus:", "🚍"],
	[":horse_racing:", "🏇"],
	[":rooster:", "🐓"],
	[":rowboat:", "🚣"],
	[":customs:", "🛃"],
	[":repeat_one:", "🔂"],
	[":waxing_crescent_moon:", "🌒"],
	[":mountain_railway:", "🚞"],
	[":clock930:", "🕤"],
	[":put_litter_in_its_place:", "🚮"],
	[":arrows_counterclockwise:", "🔄"],
	[":clock130:", "🕜"],
	[":goat:", "🐐"],
	[":pig2:", "🐖"],
	[":innocent:", "😇"],
	[":no_bicycles:", "🚳"],
	[":light_rail:", "🚈"],
	[":whale2:", "🐋"],
	[":train2:", "🚆"],
	[":earth_africa:", "🌍"],
	[":shower:", "🚿"],
	[":waning_gibbous_moon:", "🌖"],
	[":steam_locomotive:", "🚂"],
	[":cat2:", "🐈"],
	[":tractor:", "🚜"],
	[":thought_balloon:", "💭"],
	[":two_women_holding_hands:", "👭"],
	[":full_moon_with_face:", "🌝"],
	[":mouse2:", "🐁"],
	[":clock430:", "🕟"],
	[":worried:", "😟"],
	[":rat:", "🐀"],
	[":ram:", "🐏"],
	[":dog2:", "🐕"],
	[":kissing:", "😗"],
	[":helicopter:", "🚁"],
	[":clock1130:", "🕦"],
	[":no_mobile_phones:", "📵"],
	[":european_post_office:", "🏤"],
	[":ox:", "🐂"],
	[":mountain_cableway:", "🚠"],
	[":sleeping:", "😴"],
	[":cow2:", "🐄"],
	[":minibus:", "🚐"],
	[":clock730:", "🕢"],
	[":aerial_tramway:", "🚡"],
	[":speaker:", "🔈"],
	[":no_bell:", "🔕"],
	[":mailbox_with_mail:", "📬"],
	[":no_pedestrians:", "🚷"],
	[":microscope:", "🔬"],
	[":bathtub:", "🛁"],
	[":suspension_railway:", "🚟"],
	[":crocodile:", "🐊"],
	[":mountain_bicyclist:", "🚵"],
	[":waning_crescent_moon:", "🌘"],
	[":monorail:", "🚝"],
	[":children_crossing:", "🚸"],
	[":clock230:", "🕝"],
	[":busts_in_silhouette:", "👥"],
	[":mailbox_with_no_mail:", "📭"],
	[":leopard:", "🐆"],
	[":deciduous_tree:", "🌳"],
	[":oncoming_taxi:", "🚖"],
	[":lemon:", "🍋"],
	[":mute:", "🔇"],
	[":baggage_claim:", "🛄"],
	[":twisted_rightwards_arrows:", "🔀"],
	[":sun_with_face:", "🌞"],
	[":trolleybus:", "🚎"],
	[":evergreen_tree:", "🌲"],
	[":passport_control:", "🛂"],
	[":new_moon_with_face:", "🌚"],
	[":potable_water:", "🚰"],
	[":high_brightness:", "🔆"],
	[":low_brightness:", "🔅"],
	[":clock530:", "🕠"],
	[":hushed:", "😯"],
	[":grimacing:", "😬"],
	[":water_buffalo:", "🐃"],
	[":neutral_face:", "😐"],
	[":clock1230:", "🕧"],
	[":P", "😛" ],
	[":)", "🙂" ],
	[":D", "😃" ],
	[":o", "😮" ],
	[":O", "😮" ],
	[":(", "☹️" ],
	[":|", "😐" ],
];

// ===========================================================================

let placesOfOrigin = [
	"Liberty City",
	"Vice City",
	"Los Santos",
	"San Fierro",
	"Las Venturas",
	"San Andreas",
	"Blaine County",
	"Red County",
	"Bone County",
	"Other",
];

// ===========================================================================

function getGameConfig() {
	return gameData;
}

// ===========================================================================

function makeLargeNumberReadable(num) {
	return new Number(num).toLocaleString("en-US");
}

// ===========================================================================

function getKeyIdFromParams(params) {
	let tempParams = toLowerCase(toString(params));

	//let sdlName = sdl.getKeyFromName(tempParams);
	//if(sdlName != null) {
	//    return sdlName;
	//}

	for(let i in bindableKeys) {
		if(toLowerCase(bindableKeys[i]) == toLowerCase(tempParams)) {
			return i;
		}
	}
}

// ===========================================================================

function getKeyNameFromId(params) {
	return bindableKeys[toInteger(params)];
}

// ===========================================================================

function and(var1, var2) {
	return (var1 && var2);
}

// ===========================================================================

function or(var1, var2) {
	return (var1 || var2);
}

// ===========================================================================

function not(var1) {
	return !var1;
}

// ===========================================================================

function bitAnd(var1, var2) {
	return var1 & var2;
}

// ===========================================================================

function bitOr(var1, var2) {
	return var1 | var2;
}

// ===========================================================================

function bitXor(var1, var2) {
	return var1 ^ var2;
}

// ===========================================================================

function bitNot(var1) {
	return ~var1;
}

// ===========================================================================

function bitLeftShift(var1, var2) {
	return var1 << var2;
}

// ===========================================================================

function bitRightShift(var1, var2) {
	return var1 >> var2;
}

// ===========================================================================

function greaterThan(var1, var2) {
	return var1 > var2;
}

// ===========================================================================

function lessThan(var1, var2) {
	return (var1 < var2);
}

// ===========================================================================

function greaterThanOrEqualTo(var1, var2) {
	return (var1 >= var2);
}

// ===========================================================================

function lessThanOrEqualTo(var1, var2) {
	return (var1 <= var2);
}

// ===========================================================================

function equals(var1, var2) {
	return (var1 == var2);
}

// ===========================================================================

function modulo(var1, var2) {
	return var1 % var2;
}

// ===========================================================================

function add(...args) {
	return args.reduce((acc, a) => {
		return acc + a;
	}, 0);
}

// ===========================================================================

function subtract(...args) {
	return args.reduce((acc, a) => {
		return acc - a;
	}, 0);
}

// ===========================================================================

function multiply(...args) {
	return args.reduce((acc, a) => {
		return acc * a;
	}, 0);
}

// ===========================================================================

function divide(...args) {
	return args.reduce((acc, a) => {
		return acc / a;
	}, 0);
}

// ===========================================================================

function toArray(...args) {
	return args;
}

// ===========================================================================

function toInteger(val) {
	return Number(val);
}

// ===========================================================================

function toFloat(val, fixed = 2) {
	return parseFloat(val);
}

// ===========================================================================

function toString(val) {
	return String(val);
}

// ===========================================================================

function toVector3(x, y, z) {
	return new Vec3(toFloat(x), toFloat(y), toFloat(z));
}

// ===========================================================================

function toVector2(x, y) {
	return new Vec2(x, y);
}

// ===========================================================================

function toUpperCase(val) {
	return String(val).toUpperCase();
}

// ===========================================================================

function toLowerCase(val) {
	return String(val).toLowerCase();
}

// ===========================================================================

function isNull(val) {
	if(val == null) {
		return true;
	}

	if(typeof val === "undefined") {
		return true;
	}

	return false;
}

// ===========================================================================

function getEntityData(entity, dataName) {
	if(entity != null) {
		if(entity.getData != null) {
			return entity.getData(dataName);
		}
	}
	return null;
}

// ===========================================================================

function getDistance(vec1, vec2) {
	if(isNull(vec1) || isNull(vec2)) {
		return false;
	}
	return vec1.distance(vec2);
}

// ===========================================================================

function logToConsole(tempLogLevel, text) {
	text = removeColoursInMessage(text);

	if(hasBitFlag(logLevel|LOG_WARN|LOG_ERROR, tempLogLevel)) {
		if(tempLogLevel & LOG_ERROR) {
			consoleError(text);
			return true;
		} else if(tempLogLevel & LOG_WARN) {
			consoleWarn(text);
			return true;
		} else {
			consolePrint(text);
			return true;
		}
	}
	return false;
}

// ===========================================================================

function Enum(constantsList) {
	let tempTable = {};
	for(let i in constantsList) {
		tempTable[constantsList[i]] = i;
	}
	return tempTable;
}

// ===========================================================================

function clearArray(array) {
	array.length = 0;
}

// ===========================================================================

function isServerScript() {
	return (typeof server != "undefined");
}

// ===========================================================================

function getPercentage(num, per) {
	return (num/100)*per;
}

// ===========================================================================

function getMultiplayerMod() {
	return (getGame() >= 10) ? VRR_MPMOD_MAFIAC : VRR_MPMOD_GTAC;
}

// ===========================================================================

function isSnowSupported(gameId) {
	return supportedFeatures.snow[getGame()];
}

// ===========================================================================

function isGTAIV() {
	return (getGame() == VRR_GAME_GTA_IV);
}

// ===========================================================================

function areServerElementsSupported() {
	return supportedFeatures.serverElements[getGame()];
}

// ===========================================================================

function isTimeSupported() {
	return supportedFeatures.time[getGame()];
}

// ===========================================================================

function isWeatherSupported() {
	return supportedFeatures.weather[getGame()];
}

// ===========================================================================

function arePickupsSupported() {
	return supportedFeatures.pickups[getGame()];
}

// ===========================================================================

function areBlipsSupported() {
	return supportedFeatures.blips[getGame()];
}

// ===========================================================================

function areMarkersSupported() {
	return supportedFeatures.markers[getGame()];
}

// ===========================================================================

function isFadeCameraSupported() {
	return supportedFeatures.fadeCamera[getGame()];
}

// ===========================================================================

function isCustomCameraSupported() {
	return supportedFeatures.customCamera[getGame()];
}

// ===========================================================================

function areFightStylesSupported() {
	return supportedFeatures.fightStyles[getGame()];
}

// ===========================================================================

function areWorldLabelsSupported() {
	return supportedFeatures.worldLabels[getGame()];
}

// ===========================================================================

function isGameFeatureSupported(featureName) {
	return supportedFeatures[featureName][getGame()];
}

// ===========================================================================

function getAllowedSkins(gameId = getGame()) {
	return getGameConfig().skins[gameId].filter(skin => skin[2] == true);
}

// ===========================================================================

function getAllowedSkinIndexFromSkin(skin) {
	let allowedSkins = getAllowedSkins();
	for(let i in allowedSkins) {
		if(allowedSkins[i][0] == skin) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function getSkinIndexFromModel(model, gameId = getGame()) {
	let skins = getGameConfig().skins[gameId];
	for(let i in skins) {
		if(toLowerCase(skins[i][0]).indexOf(toLowerCase(model)) != -1) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function getSkinIndexFromName(name, gameId = getGame()) {
	let skins = getGameConfig().skins[gameId];
	for(let i in skins) {
		if(toLowerCase(skins[i][1]).indexOf(toLowerCase(name)) != -1) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function getObjectModelIndexFromModel(model, gameId = getGame()) {
	let objects = getGameConfig().objects[gameId];
	for(let i in objects) {
		if(toLowerCase(objects[i][0]).indexOf(toLowerCase(model)) != -1) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function getGameName(gameId = getGame()) {
	return getGameConfig().gameNames[gameId];
}

// ===========================================================================

function getVehicleModelIndexFromParams(params, gameId = getGame()) {
	let fromName = getVehicleModelIndexFromName(params, gameId);
	let fromModel = getVehicleModelIndexFromModel(params, gameId);

	if(fromModel && !fromName) {
		return fromModel;
	}

	if(!fromModel && fromName) {
		return fromName;
	}

	return false;
}

// ===========================================================================

function getVehicleModelIndexFromName(name, gameId = getGame()) {
	let vehicles = getGameConfig().vehicles[gameId];
	for(let i in vehicles) {
		if(toLowerCase(vehicles[i][1]).indexOf(toLowerCase(name)) != -1) {
			return i;
		}
	}

	return false;
}

// ===========================================================================

function getVehicleModelIndexFromModel(model, gameId = getGame()) {
	let vehicles = getGameConfig().vehicles[gameId];
	for(let i in vehicles) {
		if(isNaN(model)) {
			if(toLowerCase(vehicles[i][0]).indexOf(toLowerCase(model)) != -1) {
				return i;
			}
		} else {
			if(vehicles[i][0] == toInteger(model)) {
				return i;
			}
		}
	}

	return false;
}

// ===========================================================================

function getVehicleModelFromName(name, gameId = getGame()) {
	let vehicles = getGameConfig().vehicles[gameId];
	for(let i in vehicles) {
		if(toLowerCase(vehicles[i][1]).indexOf(toLowerCase(name)) != -1) {
			return vehicles[i][0];
		}
	}

	return false;
}

// ===========================================================================

function getVehicleNameFromModel(model, gameId = getGame()) {
	let vehicles = getGameConfig().vehicles[gameId];
	for(let i in vehicles) {
		if(isNaN(model)) {
			if(toLowerCase(vehicles[i][0]).indexOf(toLowerCase(model)) != -1) {
				return vehicles[i][1];
			}
		} else {
			if(vehicles[i][0] == toInteger(model)) {
				return vehicles[i][1];
			}
		}
	}

	return false;
}

// ===========================================================================

function getSkinModelIndexFromParams(params, gameId = getGame()) {
	let fromName = getSkinIndexFromName(params, gameId);
	let fromModel = getSkinIndexFromModel(params, gameId);

	if(fromModel && !fromName) {
		return fromModel;
	}

	if(!fromModel && fromName) {
		return fromName;
	}

	return false;
}

// ===========================================================================

function getSkinNameFromModel(model, gameId = getGame()) {
	let skins = getGameConfig().skins[gameId];
	for(let i in skins) {
		if(toLowerCase(skins[i][0]).indexOf(toLowerCase(model)) != -1) {
			return skins[i][1];
		}
	}

	return false;
}

// ===========================================================================

function getSkinNameFromIndex(index, gameId = getGame()) {
	if(typeof getGameConfig().skins[gameId][index] != "undefined") {
		return getGameConfig().skins[gameId][index][1];
	}

	return "Unknown";
}

// ===========================================================================

function getSkinModelFromName(name, gameId = getGame()) {
	let skins = getGameConfig().skins[gameId];
	for(let i in skins) {
		if(toLowerCase(skins[i][1]).indexOf(toLowerCase(name)) != -1) {
			return skins[i][0];
		}
	}
}

// ===========================================================================

function getObjectModelIndexFromParams(params, gameId = getGame()) {
	let fromName = getObjectModelIndexFromName(params, gameId);
	let fromModel = getObjectModelIndexFromModel(params, gameId);

	if(fromModel && !fromName) {
		return fromModel;
	}

	if(!fromModel && fromName) {
		return fromName;
	}

	return false;
}

// ===========================================================================

function getObjectNameFromModel(model, gameId = getGame()) {
	let objects = getGameConfig().objects[gameId];
	for(let i in objects) {
		if(toLowerCase(objects[i][0]).indexOf(toLowerCase(model)) != -1) {
			return objects[i][1];
		}
	}

	return false;
}

// ===========================================================================

function getObjectModelFromName(name, gameId = getGame()) {
	let objects = getGameConfig().objects[gameId];
	for(let i in objects) {
		if(toLowerCase(objects[i][1]).indexOf(toLowerCase(name)) != -1) {
			return objects[i][0];
		}
	}
}

// ===========================================================================

function getPosToRightOfPos(pos, angle, distance) {
	let x = (pos.x+((Math.cos((angle-1.57)+(Math.PI/2)))*distance));
	let y = (pos.y+((Math.sin((angle-1.57)+(Math.PI/2)))*distance));

	let rightPos = toVector3(x, y, pos.z);

	return rightPos;
}

// ===========================================================================

function getPosToLeftOfPos(pos, angle, distance) {
	let x = (pos.x+((Math.cos((angle+1.57)+(Math.PI/2)))*distance));
	let y = (pos.y+((Math.sin((angle+1.57)+(Math.PI/2)))*distance));

	let leftPos = toVector3(x, y, pos.z);

	return leftPos;
}

// ===========================================================================

function getPosInFrontOfPos(pos, angle, distance) {
	let x = pos.x;
	let y = pos.y;
	let z = pos.z;

	if(getGame() != VRR_GAME_MAFIA_ONE) {
		x = (pos.x+((Math.cos(angle+(Math.PI/2)))*distance));
		y = (pos.y+((Math.sin(angle+(Math.PI/2)))*distance));
	} else {
		while(angle < 0.0)
			angle += 360.0;

		while(angle > 360.0)
			angle -= 360.0;

		x = (pos.x+((Math.cos(angle-(Math.PI/2)))*distance));
		z = (pos.z+((Math.sin(angle+(Math.PI/2)))*distance));
	}

	return toVector3(x, y, z);
}

// ===========================================================================

function getPosBehindPos(pos, angle, distance) {
	let x = pos.x;
	let y = pos.y;
	let z = pos.z;

	if(getGame() < VRR_GAME_MAFIA_ONE) {
		y = (pos.y+((Math.sin(angle-(Math.PI/2)))*distance));
	} else {
		angle = radToDeg(angle);
		z = (pos.z+((Math.sin(angle-(Math.PI/2)))*distance));
	}

	x = (pos.x+((Math.cos(angle-(Math.PI/2)))*distance));

	return toVector3(x, y, z);
}

// ===========================================================================

function getPosAbovePos(pos, distance) {
	return toVector3(pos.x, pos.y, pos.z+distance);
}

// ===========================================================================

function getPosBelowPos(pos, distance) {
	return toVector3(pos.x, pos.y, pos.z-distance);
}

// ===========================================================================

function applyOffsetToPos(position, position2) {
	return toVector3(position.x+position2.x, position.y+position2.y, position.z+position2.z);
}

// ===========================================================================

function getRandom(min, max) {
	return Math.floor(Math.random() * (toInteger(max) - toInteger(min) + 1)) + toInteger(min)
}

// ===========================================================================

function splitArrayIntoChunks(originalArray, perChunk) {
	let tempArray = [];
	for (let i = 0; i < originalArray.length; i += perChunk) {
		tempArray.push(originalArray.slice(i, i + perChunk));
	}
	return tempArray;
}

// ===========================================================================

function intToBool(intVal) {
	return (intVal == 1) ? true : false;
}

// ===========================================================================

function boolToInt(boolVal) {
	return (boolVal) ? 1 : 0;
}

// ===========================================================================

function fixAngle(angle) {
	angle = radToDeg(angle);
	if(angle < 0)
	{
		angle = Math.abs(angle);
		angle = ((180-angle+1)+180);
	}
	return degToRad(angle);
}

// ===========================================================================

function addPositiveNegativeSymbol(value) {
	return (value >= 0) ? `+${value}` : `${value}`;
}

// ===========================================================================

function arrayBufferToString(arrayBuffer) {
	return String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
}

// ===========================================================================

function vec3ToVec2(pos) {
	return toVector2(pos[0], pos[1]);
}

// ===========================================================================

function vec2ToVec3(pos, z) {
	return toVector3(pos[0], pos[1], z);
}

// ===========================================================================

function degToRad(deg) {
	return deg * Math.PI / 180;
}

// ===========================================================================

function radToDeg(rad) {
	return rad * 180 / Math.PI;
}

// ===========================================================================

function getHeadingFromPosToPos(pos1, pos2) {
	let x = pos2.x-pos1.x;
	let y = pos2.y-pos1.y;
	let rad = Math.atan2(y, x);
	let deg = radToDeg(rad);
	deg -= 90;
	deg = deg % 360;
	return degToRad(deg);
}

// ===========================================================================

function getAngleInCircleFromCenter(center, total, current) {
	let gap = 360 / total;
	let deg = Math.floor(gap*current);

	if(deg <= 0) {
		deg = 1;
	} else {
		if(deg >= 360) {
			deg = 359;
		}
	}

	return degToRad(deg);
}

// ===========================================================================

function getArrayOfElementId(elements) {
	let tempArray = [];
	for(let i in elements) {
		tempArray.push(elements[i].id);
	}

	return tempArray;
}

// ===========================================================================

function getCurrentUnixTimestamp() {
	return new Date().getTime()/1000;
}

// ===========================================================================

function msToTime(duration) {
	let milliseconds = Math.floor(toInteger((duration % 1000) / 100));
	let seconds = Math.floor(toInteger((duration / 1000) % 60));
	let minutes = Math.floor(toInteger((duration / (1000 * 60)) % 60));
	let hours = Math.floor(toInteger((duration / (1000 * 60 * 60)) % 24));
	let days = Math.floor(toInteger((duration / (1000 * 60 * 60 * 24)) % 365));

	//hours = (hours < 10) ? "0" + hours : hours;
	//minutes = (minutes < 10) ? "0" + minutes : minutes;
	//seconds = (seconds < 10) ? "0" + seconds : seconds;

	if (days !== 0) {
		return `${days} days, ${hours} hours, ${minutes} minutes`;
	} else {
		return `${hours} hours, ${minutes} minutes`;
	}
}

// ===========================================================================

function generateRandomString(length, characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") {
	var result           = '';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

// ===========================================================================

function doesWordStartWithVowel(word) {
	switch(word.substr(0,1).toLowerCase()) {
		case "a":
		case "e":
		case "i":
		case "o":
		case "u":
			return true;

		default:
			return false;
	}

	return false;
}

// ===========================================================================

function getProperDeterminerForName(word) {
	switch(word.substr(0,1).toLowerCase()) {
		case "a":
		case "e":
		case "i":
		case "o":
			return "an";

		default:
			return "a";
	}
}

// ===========================================================================

function getPluralForm(name) {
	return name;
}

// ===========================================================================

function removeHexColoursFromString(str) {
	let matchRegex = /#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/gi;
	let matchedHexes = str.match(matchRegex);
	for(let i in matchHex) {
		str.replace(matchedHexes, `{${i}}`);
	}

	return [str, matchedHexes];
}

// ===========================================================================

async function waitUntil(condition) {
	return new Promise((resolve) => {
		let interval = setInterval(() => {
			if (!condition()) {
				return;
			}

			clearInterval(interval);
			resolve();
		}, 1);
	});
}

// ===========================================================================

function getGameLocationFromParams(params) {
	if(isNaN(params)) {
		let locations = getGameConfig().locations[getGame()];
		for(let i in locations) {
			if(toLowerCase(locations[i][0]).indexOf(toLowerCase(params)) != -1) {
				return i;
			}
		}
	} else {
		if(typeof getGameConfig().locations[getGame()][params] != "undefined") {
			return toInteger(params);
		}
	}
	return false;
}

// ===========================================================================

function getYesNoFromBool(boolVal) {
	return (boolVal) ? "Yes" : "No";
}

// ===========================================================================

function getOnOffFromBool(boolVal) {
	return (boolVal) ? "On" : "Off";
}

// ===========================================================================

function getEnabledDisabledFromBool(boolVal) {
	return (boolVal) ? "Enabled" : "Disabled";
}

// ===========================================================================

function getLockedUnlockedFromBool(boolVal) {
	return (boolVal) ? "Locked" : "Unlocked";
}

// ===========================================================================

function getOpenedClosedFromBool(boolVal) {
	return (boolVal) ? "Opened" : "Closed";
}

// ===========================================================================

function breakText(text, maxLength) {
	let lines = [];
	let j = Math.floor(text.length / maxLength);

	for(let i = 0; i < j; i++) {
		lines.push(text.substr(i*maxLength,maxLength));
	}

	let line = text.substr(j*maxLength, text.length % maxLength);
	if(line.length > 0) {
		lines.push(line);
	}

	return lines;
}

// ===========================================================================

function getSpeedFromVelocity(vel) {
	return Math.sqrt(vel.x*vel.x + vel.y*vel.y + vel.z*vel.z);
}

// ===========================================================================

function getCardinalDirection(pos1, pos2) {
	let a = pos1.x - pos2.x;
	let b = pos1.y - pos2.y;
	let c = pos1.z - pos2.z;

	let x = Math.abs(a);
	let y = Math.abs(b);
	let z = Math.abs(c);

	let no = 0;
	let ne = 1;
	let ea = 2;
	let se = 3;
	let so = 4;
	let sw = 5;
	let we = 6;
	let nw = 7;
	let na = 8;

	if(b < 0 && a < 0){
		if(x < (y/2)){
			return no;
		} else if(y < (x/2)){
			return ea;
		} else {
			return ne;
		}
	} else if(b < 0 && a >= 0){
		if(x < (y/2)){
			return no;
		} else if(y < (x/2)){
			return we;
		} else {
			return nw;
		}
	} else if(b >= 0 && a >= 0){
		if(x < (y/2)){
			return so;
		} else if(y < (x/2)){
			return we;
		} else {
			return sw;
		}
	} else if(b >= 0 && a < 0){
		if(x < (y/2)){
			return so;
		} else if(y < (x/2)){
			return ea;
		} else {
			return se;
		}
	} else {
		return na;
	}
	return na;
}

// ===========================================================================

function getTimeDifferenceDisplay(timeStamp2, timeStamp1) {
	timeStamp1 = timeStamp1 * 1000;
	timeStamp2 = timeStamp2 * 1000;
	if(isNaN(timeStamp1) || isNaN(timeStamp2)) {
		return "Unknown";
	}

	let millisecondDiff = timeStamp2 - timeStamp1;

	let days = Math.floor(millisecondDiff / 1000 / 60 / (60 * 24));
	let diffDate = new Date(millisecondDiff);

	return `${days} days, ${diffDate.getHours()} hours, ${diffDate.getMinutes()} minutes`;
}

// ===========================================================================

function doesWordStartWithVowel(word) {
	switch(toLowerCase(word.substr(0,1))) {
		case "a":
		case "e":
		case "i":
		case "o":
		case "u":
			return true;

		default:
			return false;
	}

	return false;
}

// ===========================================================================

function replaceEmojiIntoString(message) {
	for(let i in emojiReplaceString) {
		message = message.replace(emojiReplaceString[i][0], emojiReplaceString[i][1]);
	}
	return message;
}

// ===========================================================================

function makeReadableTime(hour, minute) {
	let hourStr = toString(hour);
	let minuteStr = toString(minute);
	let meridianStr = "AM";

	if(hour < 10) {
		hourStr = "0" + toString(hour);
		meridianStr = "AM";
	}

	if(hour > 11) {
		let actualHour = hour-12;
		if(actualHour < 10) {
			hourStr = "0" + toString(hour-12);
		} else {
			hourStr = toString(hour-12);
		}
		meridianStr = "PM";
	}

	if(minute < 10) {
		minuteStr = "0" + toString(minute);
	}

	return hourStr + ":" + minuteStr + " " + meridianStr;
}

// ===========================================================================

function getCardinalDirectionName(cardinalDirectionId) {
	let cardinalDirections = ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest", "Unknown" ];
	return cardinalDirections[cardinalDirectionId];
}

// ===========================================================================

function getWeekDayName(weekdayId) {
	let weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
	return weekdayNames[weekdayId];
}

// ===========================================================================

function getMonthName(monthId) {
	let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	return monthNames[monthId];
}

// ===========================================================================

function getLockedUnlockedEmojiFromBool(boolVal) {
	return (boolVal) ? "🔒" : "🔓";
}

// ===========================================================================

String.prototype.format = function() {
	let a = this;
	for(let i in arguments) {
		a = a.replace("{" + String(i) + "}", arguments[i]);
	}
	return a;
}

// ===========================================================================

function ArrayBufferToString(buffer) {
	return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

// ===========================================================================

function getElementTypeName(typeId) {
	if(getGame() == VRR_GAME_MAFIA_ONE) {
		switch(typeId) {
			case ELEMENT_VEHICLE:
				return "Vehicle";

			case ELEMENT_PED:
				return "Ped";

			case ELEMENT_PLAYER:
				return "Player Ped";

			default:
				return "Unknown"
		}
	} else {
		switch(typeId) {
			case ELEMENT_VEHICLE:
				return "Vehicle";

			case ELEMENT_OBJECT:
				return "Object";

			case ELEMENT_PED:
				return "Ped";

			case ELEMENT_PLAYER:
				return "Player Ped";

			case ELEMENT_PICKUP:
				return "Pickup";

			case ELEMENT_BLIP:
				return "Blip";

			case ELEMENT_MARKER:
				return "Marker";

			case ELEMENT_BUILDING:
				return "Building";

			default:
				return "Unknown"
		}
	}


	return "Unknown";
}

// ===========================================================================

function fillStringWithCharacter(character, amount) {
	let tempString = "";
	for(let i = 0; i <= amount; i++) {
		tempString = tempString + toString(character);
	}
	return tempString;
}

// ===========================================================================

function fixCharacterName(name) {
	return String(name.charAt(0).toUpperCase()) + String(name.slice(1).toLowerCase());
}

// ===========================================================================

function getCurrentTimeStampWithTimeZone(timeZone) {
	let date = new Date();

	let utcDate = new Date(date.toLocaleString('en-US', { timeZone: "UTC" }));
	let tzDate = new Date(date.toLocaleString('en-US', { timeZone: timeZone }));
	let offset = utcDate.getTime() - tzDate.getTime();

	date.setTime( date.getTime() + offset );

	return date;
};

// ===========================================================================

function getSyncerFromId(syncerId) {
	let clients = getClients();
	return clients[syncerId];
}

// ===========================================================================

function isConsole(client) {
	if(client == null) {
		return false;
	}

	return client.console;
}

// ===========================================================================

/**
 * Gets the console client (only valid on server)
 *
 * @return {Boolean} Whether or not the two clients are the same
 *
 */
function isSamePlayer(client1, client2) {
	return (client1 == client2);
}

// ===========================================================================

/**
 * Gets the console client (only valid on server)
 *
 * @return {Client} Console client
 *
 */
function getConsoleClient() {
	let clients = getClients();
	for(let i in clients) {
		if(isConsole(clients[i])) {
			return clients[i];
		}
	}
}

// ===========================================================================

/**
 * Gets the entire colours table
 *
 * @return {Object} Colours table
 *
 */
function getServerColours() {
	return serverColours;
}

// ===========================================================================

/**
 * Gets an RGB value for a colour type name
 *
 * @param {String} typeName - Colour type name (red, blue, etc)
 * @return {Number} Colour value (same as from toColour)
 *
 */
function getColourByType(typeName) {
	return getServerColours().byType[typeName];
}

// ===========================================================================

/**
 * Gets an RGB value for a colour name
 *
 * @param {String} colourName - Colour name (error, businessBlue, etc)
 * @return {Number} Colour value (same as from toColour)
 *
 */
function getColourByName(colourName) {
	return getServerColours().byName[colourName];
}

// ===========================================================================

/**
 * Gets a hex value for a colour type
 *
 * @param {String} colourName - Colour name (red, blue, etc)
 * @return {String} Hex value as string without brackets (has only the hashtag)
 *
 */
function getHexColourByName(colourName) {
	//let rgbaColour = getServerColours().byName[colourName];
	//let rgbaArray = rgbaArrayFromToColour(rgbaColour);
	//return rgbToHex(rgbaArray[0], rgbaArray[1], rgbaArray[2]);

	return `#${getServerColours().hex.byName[colourName]}`;
}

// ===========================================================================

/**
 * Gets a hex value for a colour type
 *
 * @param {String} typeName - Colour type name (error, businessBlue, etc)
 * @return {String} Hex value as string without brackets (has only the hashtag)
 *
 */
function getHexColourByType(typeName) {
	//let rgbaColour = getServerColours().byType[colourName];
	//let rgbaArray = rgbaArrayFromToColour(rgbaColour);
	//return rgbToHex(rgbaArray[0], rgbaArray[1], rgbaArray[2]);

	return `#${getServerColours().hex.byType[colourName]}`;
}

// ===========================================================================

function getPlayerColour(client) {
	if(getPlayerData(client) != false) {
		if(!isPlayerLoggedIn(client)) {
			return getColourByName("darkGrey");
		} else {
			if(isPlayerWorking(client)) {
				return getJobData(getJobIndexFromDatabaseId(getPlayerCurrentSubAccount(client).job)).colour;
			}
		}
	}

	return getColourByName("civilianWhite");
}

// ===========================================================================

/**
 * Gets the red/green colour depending on bool (red = false, green = true) for inline use in chatbox messages
 *
 * @param {Boolean} boolValue The boolean value
 * @return {String} Red or green inline HEX colour string
 *
 */
function getBoolRedGreenInlineColour(boolValue) {
	return (!boolValue) ? "{softRed}" : "{softGreen}";
}

// ===========================================================================

/**
 * Gets an array of RGB colour values from a HEX colour string
 *
 * @param {String} hexColour Hex colour string
 * @return {Array} 3-slot array where each slot is an RGB colour value
 *
 */
function hexToRgb(h) {
	return [
		'0x'+h[1]+h[2]|0,
		'0x'+h[3]+h[4]|0,
		'0x'+h[5]+h[6]|0
	];
}

// ===========================================================================

/**
 * Gets a HEX colour string from RGB values, without brackets (example: #FFFFFF)
 *
 * @param {Number} red Red RGB value
 * @param {Number} green Green RGB value
 * @param {Number} blue Blue RGB value
 * @return {String} HEX colour string
 *
 */
function rgbToHex(r, g, b) {
	return "#"+((1<<24)+(r<<16)+(g<<8)+ b).toString(16).slice(1);
}

// ===========================================================================

/**
 * Gets the current colour for a player (affected by job and status)
 *
 * @param {Client} client Player client
 * @return {Number} Colour integer
 *
 */
function getClientChatColour(client) {
	let tempJob = getPlayerCurrentSubAccount(client).job;
	if(tempJob != -1) {
		if(getPlayerData(client).isWorking) {
			return getJobData(tempJob).jobColour;
		}
	}
	return getColourByName("white");
}

// ===========================================================================

/**
 * Gets a toColour-created colour integer with random RGB values (alpha is always 255)
 *
 * @return {Number} Colour integer
 *
 */
function getRandomRGB() {
	return toColour.apply(null, [
		getRandom(0, 255),
		getRandom(0, 255),
		getRandom(0, 255),
		255
	]);
}

// ===========================================================================

/**
 * Gets a hex formatting colour by name for use inline in chatbox messages (example: [#FFFFFF]).
 *
 * @param {String} colourName - Colour name
 * @return {String} HEX-formatted colour string with brackets
 *
 */
function getInlineChatColourByName(colourName) {
	return `{${colourName}}`;
}

// ===========================================================================

/**
 * Gets a hex formatting colour by type for use inline in chatbox messages (example: [#FFFFFF]).
 *
 * @param {String} colourName - Colour type
 * @return {String} HEX-formatted colour string with brackets
 *
 */
function getInlineChatColourByType(colourName) {
	return `{${colourName}}`;
}

// ===========================================================================

/**
 * Gets an array of RGBA colour values from a toColour integer.
 *
 * @param {Number} colour - Colour integer created by toColour
 * @return {Array} 4-slot array where each slot is an RGBA colour value
 *
 */
function rgbaArrayFromToColour(colour) {
	//return [
	//    (colour >> 24) & 0xFF, // red
	//    (colour >> 16) & 0xFF,
	//    (colour >> 8) & 0xFF,
	//    colour & 0xFF // alpha
	//];
	return [
		(colour >> 16) & 0xFF, // red
		(colour >> 8) & 0xFF,
		colour & 0xFF,
		(colour >> 24) & 0xFF// alpha
	];
}

// ===========================================================================

/**
 * Gets a hex formatting colour by type for use inline in chatbox messages (example: [#FFFFFF]).
 *
 * @param {Number} colourValue - Colour value (from toColour)
 * @return {String} HEX-formatted colour string without brackets (just the hashtag)
 *
 */
function hexFromToColour(colour) {
	let rgba = rgbaArrayFromToColour(colour);
	return rgbToHex(rgba[0], rgba[1], rgba[2]);
}

// ===========================================================================

/**
 * Replaces colour types with HEX values in a message string
 *
 * @param {String} colouredString - String with colours
 * @return {String} String with replaced colours for inline chatbox usage
 *
 */
function replaceColoursInMessage(messageText) {
	if(messageText == null) {
		return "";
	}

	let tempFind = `{RESETCOLOUR}`;
	let tempRegex = new RegExp(tempFind, 'g');
	messageText = messageText.replace(tempRegex, "[/#]");

	tempFind = `{ALTCOLOUR}`;
	tempRegex = new RegExp(tempFind, 'g');
	messageText = messageText.replace(tempRegex, "[#C8C8C8]");

	tempFind = `{MAINCOLOUR}`;
	tempRegex = new RegExp(tempFind, 'g');
	messageText = messageText.replace(tempRegex, "[#FFFFFF]");

	for(let i in getServerColours().hex.byName) {
		let find = `{${i}}`;
		let re = new RegExp(find, 'g');
		messageText = messageText.replace(re, `[#${getServerColours().hex.byName[i]}]`);
	}

	for(let i in getServerColours().hex.byType) {
		let find = `{${i}}`;
		let re = new RegExp(find, 'g');
		messageText = messageText.replace(re, `[#${getServerColours().hex.byType[i]}]`);
	}

	return messageText;
}

// ===========================================================================

/**
 * Removes colour types from a message
 *
 * @param {String} colouredString - String with colours
 * @return {String} String without colours
 *
 */
function removeColoursInMessage(messageText) {
	if(messageText == null) {
		return "";
	}

	if(typeof messageText != "string") {
		return "";
	}

	if(messageText == "") {
		return "";
	}

	let tempFind = `{RESETCOLOUR}`;
	let tempRegex = new RegExp(tempFind, 'g');
	messageText = messageText.replace(tempRegex, "");

	tempFind = `{ALTCOLOUR}`;
	tempRegex = new RegExp(tempFind, 'g');
	messageText = messageText.replace(tempRegex, "");

	tempFind = `{MAINCOLOUR}`;
	tempRegex = new RegExp(tempFind, 'g');
	messageText = messageText.replace(tempRegex, "");

	for(let i in getServerColours().hex.byName) {
		let find = `{${i}}`;
		let re = new RegExp(find, 'g');
		messageText = messageText.replace(re, "");
	}

	for(let i in getServerColours().hex.byType) {
		let find = `{${i}}`;
		let re = new RegExp(find, 'g');
		messageText = messageText.replace(re, "");
	}

	return messageText;
}

// ===========================================================================

/**
 * Replaces emoji texts with actual emoji
 *
 * @param {String} colouredString - String with emoji names
 * @return {String} String with actual emoji images
 *
 */
function replaceEmojiInString(messageString) {
	for(let i in emojiReplaceString) {
		while(messageString.indexOf(emojiReplaceString[i][0]) != -1) {
			messageString = messageString.replace(emojiReplaceString[i][0], emojiReplaceString[i][1]);
		}
	}
	return messageString;
}

// ===========================================================================

function isWeekend() {
	let d = new Date();
	return d.getDay() == 6 || d.getDay() == 0;
}

// ===========================================================================

/*
function getPlayerLocationName(client) {
	if(getPlayerBusiness(client)) {
		return `at ${getBusinessData(getPlayerBusiness(client)).name}`;
	}

	if(getPlayerHouse(client)) {
		return `at ${getHouseData(getPlayerHouse(client)).description}`;
	}

	let closestBusiness = getClosestBusinessEntrance(client.position, getPlayerDimension(client));
	if(getBusinessData(closestBusiness)) {
		return `near ${getBusinessData(closestBusiness).name} in ${getGameAreaFromPos(getPlayerPosition(client))}`;
	}

	let closestHouse = getClosestHouseEntrance(client.position, getPlayerDimension(client));
	if(getHouseData(closestHouse)) {
		let areaId = getGameAreaFromPos(getPlayerPosition(client));
		if(getDistance(getHouseData(closestHouse).entrancePosition) > 7) {
			return `near ${getHouseData(closestHouse).description} in ${getGameConfig().areas[getGame()][areaId][1]}`;
		}
	}
}
*/

// ===========================================================================

function getGameAreaFromPos(position) {
	let areas = getGameConfig().areas[getGame()];
	for(let i in areas) {
		if(isPointInPoly(areas[i].borders, position)) {
			return i;
		}
	}
}

// ===========================================================================

function isPosInPoly(poly, position) {
	for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
		((poly[i].y <= position.y && position.y < poly[j].y) || (poly[j].y <= position.y && position.y < poly[i].y))
		&& (position.x < (poly[j].x - poly[i].x) * (position[1] - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
		&& (c = !c);
	return c;
}

// ===========================================================================

function createBitFlagTable(keyNames) {
	let bitVal = 0;
	let bitTable = {};
	let incVal = 1;

	for(let i in keyNames) {
		let key = keyNames[i];
		bitTable[key] = bitVal;
		bitVal = 1 << incVal;
		incVal++;
	}
	return bitTable;
}

// ===========================================================================

function hasBitFlag(allFlags, checkForFlag) {
	if(allFlags == 0) {
		return false;
	}

	if(allFlags == -1) {
		return true;
	}

	if((allFlags & checkForFlag) == checkForFlag) {
		return true;
	}

	return false;
}

// ===========================================================================

function addBitFlag(allFlags, flagValue) {
	return allFlags | flagValue;
}

// ===========================================================================

function removeBitFlag(allFlags, flagValue) {
	return allFlags ^ flagValue;
}

// ===========================================================================