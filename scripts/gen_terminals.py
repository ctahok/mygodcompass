#!/usr/bin/env python3
# Generates the TERMINALS section of ontology.ts with EN/RU/AZ translations
import json, sys

# (node_id, title_en, title_ru, title_az, blueprint_en, blueprint_ru, blueprint_az, social_proof, percent, minds_en, minds_ru, minds_az, tags)
# blueprint uses {adj} placeholders replaced inline; here we write full text per language.

T = []

def t(node_id, title, bp, proof, pct, minds, tags):
    # title: dict, bp: dict, minds: tuple of (en,ru,az) triples
    en, ru, az = title["en"], title["ru"], title["az"]
    ben, bru, baz = bp["en"], bp["ru"], bp["az"]
    minds_en = [m[0] for m in minds]
    minds_ru = [m[1] for m in minds]
    minds_az = [m[2] for m in minds]
    T.append((node_id, en, ru, az, ben, bru, baz, proof, pct, minds_en, minds_ru, minds_az, tags))

# ---------------- ORIGINAL CORE TERMINALS ----------------
t("terminal_secular_humanist",
  {"en":"The Secular Humanist","ru":"Светский гуманист","az":"Dünyəvi humanist"},
  {"en":"You hold that no higher power exists. Meaning is not discovered from above — it is authored by human reason, ethics, and community from below. You are the sovereign of your own values.",
   "ru":"Вы считаете, что высшей силы не существует. Смысл не открывается свыше — он создаётся человеческим разумом, этикой и обществом снизу. Вы — суверен собственных ценностей.",
   "az":"Siz hesab edirsiniz ki, ali güc mövcud deyil. Məna yuxarıdan kəşf edilmir — o, insan ağlı, etikası və cəmiyyəti tərəfindən aşağıdan yaradılır. Siz öz dəyərlərinizin suverenisiniz."},
  4821,14,[("Richard Dawkins","Ричард Докинз","Riçard Dokins"),("Bertrand Russell","Бертран Рассел","Bertran Rassel"),("Christopher Hitchens","Кристофер Хитченс","Kristofer Hitçens")],["atheist"])

t("terminal_deist",
  {"en":"The Clockmaker Deist","ru":"Деист-часовщик","az":"Saat ustası deist"},
  {"en":"You believe God is Real, acting as an Impersonal designer who set the cosmos in motion and then left it to run by natural law — a watchmaker who does not wind the watch again.",
   "ru":"Вы верите, что Бог Реален, действует как Безличный проектировщик, запустивший космос и оставивший его жить по естественным законам — часовщик, который больше не заводит часы.",
   "az":"Siz inanırsınız ki, Tanrı Realdır, kosmosu hərəkətə gətirən və onu təbii qanunlarla idarə olunmağa qoyan Şəxssiz dizayner kimi fəaliyyət göstərir — saatı bir daha qurmayan saat ustası."},
  893,9,[("Voltaire","Вольтер","Volter"),("Thomas Jefferson","Томас Джефферсон","Tomas Cefferson"),("Isaac Newton","Исаак Ньютон","İsaak Nyuton")],["deist"])

t("terminal_durkheimian",
  {"en":"The Durkheimian Constructivist","ru":"Дюркгеймианский конструктивист","az":"Dürkheymçi konstruktivist"},
  {"en":"You believe God is Abstract — a social construct that is nonetheless real in its effects. 'God' is society's self-image projected upward: the sacred is whatever binds us together.",
   "ru":"Вы верите, что Бог Абстрактен — социальный конструкт, однако реальный в своих последствиях. «Бог» — это самообраз общества, проецируемый вверх: священное — это то, что связывает нас.",
   "az":"Siz inanırsınız ki, Tanrı Abstraktdır — sosial konstruksiyadır, lakin təsirlərində realdır. «Tanrı» cəmiyyətin yuxarıya proyeksiya edilmiş öz obrazıdır: müqəddəs bizi birləşdirən şeydir."},
  342,3,[("Émile Durkheim","Эмиль Дюркгейм","Emil Dürkheym"),("Robert Bellah","Роберт Белла","Robert Bellah")],["durkheimian"])

t("terminal_jungian",
  {"en":"The Jungian Constructivist","ru":"Юнгианский конструктивист","az":"Yunqçu konstruktivist"},
  {"en":"You believe God is Abstract — a universal archetype living in the collective unconscious. The divine image is the psyche's oldest symbol: not a being 'out there', but the Self encountering its own depth.",
   "ru":"Вы верите, что Бог Абстрактен — универсальный архетип, живущий в коллективном бессознательном. Божественный образ — древнейший символ психики: не существо «там вовне», а Самость, встречающая собственную глубину.",
   "az":"Siz inanırsınız ki, Tanrı Abstraktdır — kollektiv şüursuzluqda yaşayan universal arxetip. İlahi obraz psixikanın ən qədim simvoludur: «orada» olan varlıq deyil, öz dərinliyi ilə qarşılaşan Öz."},
  1056,5,[("Carl Jung","Карл Юнг","Karl Yunq"),("Joseph Campbell","Джозеф Кэмпбелл","Cozef Kempbell"),("Mircea Eliade","Мирча Элиаде","Mirça Eliade")],["jungian"])

t("terminal_olympian",
  {"en":"The Olympian Polytheist","ru":"Олимпийский политеист","az":"Olimpiyalı politeist"},
  {"en":"You believe gods are Real and Personal — many beings, each with will, emotion, and domain. The cosmos is a society of powers: war, love, craft, and fate, each worthy of its own reverence.",
   "ru":"Вы верите, что боги Реальны и Личностны — множество существ, каждое со своей волей, эмоциями и сферой. Космос — это общество сил: войны, любви, ремесла и судьбы, каждая достойна своего почитания.",
   "az":"Siz inanırsınız ki, tanrılar Real və Şəxsiyyətlidir — hər birinin iradəsi, duyğusu və sahəsi olan çoxlu varlıqlar. Kosmos güclər cəmiyyətidir: müharibə, sevgi, sənət və tale — hər biri öz ehtiramına layiqdir."},
  517,4,[("Homer","Гомер","Homer"),("Proclus","Прокл","Prokl")],["polytheist"])

t("terminal_spinozan",
  {"en":"The Spinozan Pantheist","ru":"Спинозанский пантеист","az":"Spinozist panteist"},
  {"en":"You believe God is Real and Abstract — the single substance of the universe, identical with nature itself. Deus sive Natura: no separate being, only one infinite reality of which you are a mode.",
   "ru":"Вы верите, что Бог Реален и Абстрактен — единая субстанция вселенной, тождественная самой природе. Deus sive Natura: нет отдельного существа, есть лишь одна бесконечная реальность, модусом которой вы являетесь.",
   "az":"Siz inanırsınız ki, Tanrı Real və Abstraktdır — kainatın vahid substansiyası, təbiətin özü ilə eyni. Deus sive Natura: ayrıca varlıq yoxdur, yalnız bir sonsuz reallıq var və siz onun modususunuz."},
  1328,11,[("Baruch Spinoza","Бенедикт Спиноза","Barux Spinoza"),("Albert Einstein","Альберт Эйнштейн","Albert Eynşteyn"),("Giordano Bruno","Джордано Бруно","Cordano Bruno")],["spinozism"])

t("terminal_hegelian",
  {"en":"The Hegelian Absolutist","ru":"Гегельянский абсолютист","az":"Hegelçi mütləqiyyətçi"},
  {"en":"You believe God is Abstract — the Absolute, an all-encompassing reason that unfolds dialectically through history. The divine is not a being above time but the very process of spirit coming to know itself.",
   "ru":"Вы верите, что Бог Абстрактен — Абсолют, всеобъемлющий разум, развёртывающийся диалектически в истории. Божественное — не существо над временем, а сам процесс духа, познающего себя.",
   "az":"Siz inanırsınız ki, Tanrı Abstraktdır — Mütləq, tarix boyu dialektik şəkildə açılan hər şeyi əhatə edən ağıl. İlahi zaman üstündəki varlıq deyil, özünü tanıyan ruhun prosesinin özüdür."},
  447,4,[("G.W.F. Hegel","Г.В.Ф. Гегель","Q.V.F. Hegel"),("F.W.J. Schelling","Ф.В.Й. Шеллинг","F.V.Y. Şellinq")],["hegelianism"])

t("terminal_classical_theist",
  {"en":"The Classical Theist (Thomistic)","ru":"Классический теист (томистский)","az":"Klassik teist (Toma variantı)"},
  {"en":"You believe God is Real and Abstract — pure actuality, the Prime Mover, the logical ground of all existence. God is not one more thing in the world but the reason anything exists at all.",
   "ru":"Вы верите, что Бог Реален и Абстрактен — чистая актуальность, Перводвигатель, логическое основание всего бытия. Бог — не ещё одна вещь в мире, а причина того, что вообще что-либо существует.",
   "az":"Siz inanırsınız ki, Tanrı Real və Abstraktdır — saf aktuallıq, İlk Hərəkətverən, bütün varlığın məntiqi əsası. Tanrı dünyada əlavə bir şey deyil, hər şeyin mövcud olmasının səbəbidir."},
  1974,12,[("Thomas Aquinas","Фома Аквинский","Toma Akvinalı"),("Aristotle","Аристотель","Aristotel"),("Gottfried Leibniz","Готфрид Лейбниц","Qotfrid Leybnits")],["classical_theism"])

t("terminal_mystical_theist",
  {"en":"The Mystical Theist","ru":"Мистический теист","az":"Mistik teist"},
  {"en":"You believe God is Real and Personal, yet encountered only in inner experience — not in creeds or history. The relationship is direct, wordless, and beyond doctrine.",
   "ru":"Вы верите, что Бог Реален и Личностен, но встречается только во внутреннем опыте — не в догмах и не в истории. Отношения прямые, безмолвные и вне доктрины.",
   "az":"Siz inanırsınız ki, Tanrı Real və Şəxsidir, lakin yalnız daxili təcrübədə qarşılanır — dini ehkam və tarixdə deyil. Münasibət birbaşa, sözsüz və doktrinadan kənardır."},
  763,7,[("Meister Eckhart","Мейстер Экхарт","Meyster Exhart"),("Rumi","Руми","Rumi"),("Teresa of Ávila","Тереза Авильская","Avilalı Tereza")],["mystical"])

# ---------------- CATHOLIC TERMINALS ----------------
def cath(node_id, name_en, name_ru, name_az, desc_en, proof, pct, minds):
    t(node_id, {"en":name_en,"ru":name_ru,"az":name_az},
      {"en":f"You are a Catholic Christian of the {desc_en} tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of {desc_en} spirituality within the universal Catholic faith.",
       "ru":f"Вы — католический христианин традиции {desc_en}. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность {desc_en} внутри вселенской католической веры.",
       "az":f"Siz {desc_en} ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində {desc_en} mənəviyyatıdır."},
      proof,pct,minds,["catholic"])

def desc_ru(s): return s
def desc_az(s): return s

# (node, title, ru, az, short-en-desc, proof, pct, minds)
catholic_terms = [
 ("terminal_catholic_scholastic","The Scholastic Catholic","Схоластический католик","Sxolastik katolik","Thomistic — reason and faith in harmony","Aquinas","Фома Аквинский","Toma Akvinalı","Augustine","Августин","Avqustin","Blaise Pascal","Блез Паскаль","Blez Paskal",1890,9),
 ("terminal_catholic_mystical","The Augustinian Mystic","Августинский мистик","Avqustin mistiki","Augustinian — grace, interiority, and divine love","Augustine","Августин","Avqustin","Thomas Merton","Томас Мертон","Tomas Merton","Julian of Norwich","Юлиана Норвичская","Norviçli Yuliana",1120,6),
 ("terminal_catholic_charismatic","The Charismatic Catholic","Харизматический католик","Xarizmatik katolik","Charismatic Renewal — baptism of the Holy Spirit","Francis","Франциск","Fransisk","Pope John Paul II","Папа Иоанн Павел II","Papa İohann Pavel II","Raniero Cantalamessa","Раниеро Канталамесса","Raniero Kantalamezza",880,4),
 ("terminal_catholic_traditionalist","The Traditionalist Catholic","Традиционалистский католик","Tradisionalist katolik","Tridentine — pre-Vatican II Latin Mass and reverence","Marcel Lefebvre","Марсель Лефевр","Marsel Lefevr","G.K. Chesterton","Г.К. Честертон","Q.K. Çesterton","Bishop Athanasius Schneider","Епископ Афанасий Шнайдер","Yepiskop Afanasius Şnayder",740,4),
 ("terminal_catholic_liberation","The Liberation Theologian","Теолог освобождения","Azadlıq ilahiyyatçısı","Liberation Theology — God's option for the poor","Gustavo Gutiérrez","Густаво Гутьеррес","Qustavo Qutyerrez","Óscar Romero","Оскар Ромеро","Oskar Romero","Jon Sobrino","Хон Собрино","Con Sobrino",990,5),
]
# (loops moved to end of file — after all data lists are defined)

# Eastern Catholic
ec_terms = [
 ("terminal_catholic_maronite","The Maronite Catholic","Маронитский католик","Maronit katolik","Maronite Church of Lebanon — Antiochene rite, Aramaic liturgy","Saint Maron","Святой Марон","Müqəddəs Maron","Charbel Makhlouf","Шарбель Махлуф","Şarbel Maxluf","Gibran Khalil Gibran","Джебран Халиль Джебран","Cübran Xəlil Cübran",450,2),
 ("terminal_catholic_melkite","The Melkite Catholic","Мелькитский католик","Melkit katolik","Melkite Greek Catholic — Byzantine rite in communion with Rome","Maximos IV Sayegh","Максим IV Сайег","Maksimos IV Sayeğ","Saint John of Damascus","Иоанн Дамаскин","Dəməşqli Yəhya",380,2),
 ("terminal_catholic_ukrainian","The Ukrainian Greek Catholic","Украинский греко-католик","Ukrayna yunan-katoliki","Ukrainian Greek Catholic — largest Eastern Catholic Church, Byzantine rite","Andrey Sheptytsky","Андрей Шептицкий","Andrey Şeptitski","Josyf Slipyj","Иосиф Слипый","Yosıf Slıpıy",560,3),
 ("terminal_catholic_chaldean","The Chaldean Catholic","Халдейский католик","Xaldey katolik","Chaldean Catholic Church of Iraq — East Syriac rite","Saint Thomas the Apostle","Апостол Фома","Həvari Tomas","Patriarch Louis Raphaël I Sako","Патриарх Луи Рафаэль I Сако","Patriarx Lui Rafael I Sako",340,2),
 ("terminal_catholic_syro","The Syro-Malabar Catholic","Сиро-малабарский католик","Siro-malabar katolik","Syro-Malabar / Syro-Malankara Church of India — Saint Thomas Christians","Saint Thomas the Apostle","Апостол Фома","Həvari Tomas","Kuriakose Elias Chavara","Куриакос Элиас Чавара","Kuriakose Elias Çavara",420,2),
 ("terminal_catholic_other_eastern","The Other Eastern Catholic","Другой восточный католик","Digər şərqi katolik","Other Eastern Catholic Church — Coptic, Armenian, Romanian, Ruthenian, or Ethiopian rites in union with Rome","Pope Francis","Папа Франциск","Papa Fransisk","Various Eastern patriarchs","Различные восточные патриархи","Müxtəlif şərq patriarxları",310,2),
]

# Religious orders
order_terms = [
 ("terminal_catholic_jesuit","The Jesuit","Иезуит","İezuit","Jesuit — Ignatian discernment, education, and 'finding God in all things'","Ignatius of Loyola","Игнатий Лойола","İqnati Loyola","Francis Xavier","Франциск Ксаверий","Fransisk Ksaveri","Pope Francis","Папа Франциск","Papa Fransisk",1340,7),
 ("terminal_catholic_franciscan","The Franciscan","Францисканец","Fransiskan","Franciscan — poverty, love of creation, and the crucified Christ","Francis of Assisi","Франциск Ассизский","Assizi Fransisk","Clare of Assisi","Клара Ассизская","Assizi Klara","Bonaventure","Бонавентура","Bonaventura",1120,6),
 ("terminal_catholic_dominican","The Dominican","Доминиканец","Dominikan","Dominican — veritas, preaching, and rigorous study","Dominic de Guzmán","Доминик де Гусман","Dominik de Qusman","Thomas Aquinas","Фома Аквинский","Toma Akvinalı","Catherine of Siena","Екатерина Сиенская","Sienalı Yekaterina",890,5),
 ("terminal_catholic_carmelite","The Carmelite","Кармелит","Karmelit","Carmelite — contemplative prayer, Teresa of Ávila, John of the Cross","Teresa of Ávila","Тереза Авильская","Avilalı Tereza","John of the Cross","Иоанн Креста","Xaçlı Yəhya","Thérèse of Lisieux","Тереза из Лизьё","Lizye Terezası",780,4),
 ("terminal_catholic_benedictine","The Benedictine","Бенедиктинец","Benediktin","Benedictine / Trappist — ora et labora, stability, and liturgy","Benedict of Nursia","Бенедикт Нурсийский","Nursiyalı Benedikt","Bernard of Clairvaux","Бернар Клервоский","Klervolu Bernard","Thomas Merton","Томас Мертон","Tomas Merton",660,3),
 ("terminal_catholic_other_order","The Religious Life Catholic","Католик монашеской жизни","Dini həyat katoliki","Other religious order — Salesian, Opus Dei, Focolare, Redemptorist, or another charism within the Church","Don Bosco","Дон Боско","Don Bosko","Josemaría Escrivá","Хосемария Эскрива","Xosemariya Eskriva","Chiara Lubich","Кьяра Любич","Kiara Lubiç",450,2),
]

# ---------------- ORTHODOX TERMINALS ----------------
def orthodox(node_id, name_en, name_ru, name_az, desc_en, proof, pct, minds):
    t(node_id, {"en":name_en,"ru":name_ru,"az":name_az},
      {"en":f"You are an Orthodox Christian of the {desc_en} tradition. God is Real, Personal, and Triune — known as mystery through theosis, the living tradition, and the holy icons. The Church is the hospital of souls.",
       "ru":f"Вы — православный христианин традиции {desc_en}. Бог Реален, Личностен и Троичен — познаётся как тайна через теозис, живую традицию и святые иконы. Церковь — это лечебница душ.",
       "az":f"Siz {desc_en} ənənəsindən olan Pravoslav xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — teozis, canlı ənənə və müqəddəs ikonalar vasitəsilə sirr kimi tanınır. Kilsə ruhların xəstəxanasıdır."},
      proof,pct,minds,["orthodox"])

orth_terms = [
 ("terminal_orthodox_greek","The Greek Orthodox","Греческий православный","Yunan pravoslav","Greek / Ecumenical Patriarchate","Gregory Palamas","Григорий Палама","Qriqori Palama","Nikos Kazantzakis","Никос Казандзакис","Nikos Kazancakis","Elder Paisios","Старец Паисий","Ağsaqqal Paisios",980,5),
 ("terminal_orthodox_antiochian","The Antiochian Orthodox","Антиохийский православный","Antioxiya pravoslav","Antiochian / Arab Orthodox","Saint John Chrysostom","Иоанн Златоуст","Xrisostom Yəhya","Apostle Peter","Апостол Пётр","Həvari Pyotr","Ignatius of Antioch","Игнатий Антиохийский","Antioxiyalı İqnati",420,2),
 ("terminal_orthodox_other_slavic","The Slavic Orthodox","Славянский православный","Slavyan pravoslav","Serbian, Bulgarian, Romanian, or Georgian Orthodox","Saint Sava","Святой Савва","Müqəddəs Sava","Paisius of Hilandar","Паисий Хилендарский","Xilendarlı Paisius","Justinian","Юстиниан","Yustinian",560,3),
 ("terminal_orthodox_old_believer","The Old Believer","Старообрядец","Köhnə inanan","Old Believers — pre-Nikonian rites, split of 1666, preservation of ancient piety","Avvakum","Аввакум","Avvakum","Archpriest Avvakum's followers","Последователи протопопа Аввакума","Protokoh Avvakumun ardıcılları",230,1),
 ("terminal_orthodox_true","The True Orthodox","Истинно православный","Həqiqi pravoslav","True / Genuine Orthodoxy — anti-ecumenist, preserving the old calendar","Metropolitan Philaret","Митрополит Филарет","Mitropolit Filaret","John of Shanghai","Иоанн Шанхайский","Şanxaylı İohann",310,2),
 ("terminal_orthodox_russian_mainstream","The Russian Orthodox","Русский православный","Rus pravoslav","Russian Orthodox — Moscow Patriarchate","Seraphim of Sarov","Серафим Саровский","Sarovlu Serafim","Dostoevsky","Достоевский","Dostoyevski","Patriarch Kirill","Патриарх Кирилл","Patriarx Kirill",1230,7),
 ("terminal_orthodox_rocor","The ROCOR Orthodox","Православный РПЦЗ","RPÇX pravoslav","ROCOR — Russian Orthodox Church Outside Russia","John of Shanghai","Иоанн Шанхайский","Şanxaylı İohann","Vitaly Ustinov","Виталий Устинов","Vitali Ustinov",390,2),
 ("terminal_orthodox_edinovertsy","The Edinoverets","Единоверец","Edinoverets","Edinovertsy — Old Ritualists in communion with the Moscow Patriarchate","Saint Ambrose of Optina","Амвросий Оптинский","Optinalı Amvrosi","Saint Seraphim","Серафим","Serafim","Patriarch Nikon","Патриарх Никон","Patriarx Nikon",180,1),
]

# Oriental Orthodox
oriental_terms = [
 ("terminal_oriental_coptic","The Coptic Orthodox","Коптский православный","Kopt pravoslav","Coptic Orthodox Church of Egypt","Saint Mark","Святой Марк","Müqəddəs Mark","Pope Shenouda III","Папа Шенуда III","Papa Şenuda III","Anthony the Great","Антоний Великий","Böyük Antoni",560,3),
 ("terminal_oriental_armenian","The Armenian Apostolic","Армянский апостольский","Erməni apostolik","Armenian Apostolic Church of Etchmiadzin","Gregory the Illuminator","Григорий Просветитель","İşıqlandıran Qriqori","Mesrop Mashtots","Месроп Маштоц","Mesrop Maşdots","Sayat-Nova","Саят-Нова","Sayat-Nova",450,2),
 ("terminal_oriental_ethiopian","The Ethiopian Orthodox","Эфиопский православный","Efiopiya pravoslav","Ethiopian Orthodox Tewahedo Church","Saint Tekle Haymanot","Текле Хайманот","Tekle Haymanot","Abba Gebre Menfes Kidus","Абба Гебре Менфес Кидус","Abba Gebre Menfes Kidus","Saint Yared","Святой Яред","Müqəddəs Yared",380,2),
 ("terminal_oriental_eritrean","The Eritrean Orthodox","Эритрейский православный","Eritreya pravoslav","Eritrean Orthodox Tewahedo Church","Abba Phillipos","Абба Филиппос","Abba Filippos","Saint Yonas","Святой Йонас","Müqəddəs Yonas","Abba Luqas","Абба Лукас","Abba Luqas",150,1),
 ("terminal_oriental_syriac","The Syriac Orthodox","Сирийский православный","Suriya pravoslav","Syriac Orthodox Church of Antioch","Jacob Baradaeus","Иаков Барадей","Yaqub Baradey","Ephrem the Syrian","Ефрем Сирин","Suriyalı Efrem","Saint Severus","Святой Север","Müqəddəs Sever",340,2),
 ("terminal_oriental_malankara","The Malankara Orthodox","Маланкарский православный","Malankara pravoslav","Malankara Orthodox Syrian Church of India","Saint Thomas","Апостол Фома","Həvari Tomas","Geevarghese Mar Gregorios","Геваргезе Мар Грегориос","Geevarghese Mar Qriqorios","Mar Dionysius","Мар Дионисий","Mar Dionisius",290,1),
]

# ---------------- PROTESTANT TERMINALS ----------------
def prot(node_id, name_en, name_ru, name_az, desc_en, proof, pct, minds):
    t(node_id, {"en":name_en,"ru":name_ru,"az":name_az},
      {"en":f"You are a Protestant Christian of the {desc_en} tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes {desc_en}.",
       "ru":f"Вы — протестантский христианин традиции {desc_en}. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает {desc_en}.",
       "az":f"Siz {desc_en} ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz {desc_en} vurğulayır."},
      proof,pct,minds,["protestant"])

prot_terms = [
 ("terminal_protestant_quaker","The Quaker","Квакер","Kveker","Quaker — the Inner Light and silent waiting worship","George Fox","Джордж Фокс","Corc Foks","William Penn","Уильям Пенн","Uilyam Penn","John Woolman","Джон Вулман","Con Vulman",520,3),
 ("terminal_lutheran_confessional","The Confessional Lutheran","Конфессиональный лютеран","Konfessional lüteran","Confessional Lutheran — Book of Concord, Law and Gospel","Martin Luther","Мартин Лютер","Martin Lüter","C.F.W. Walther","К.Ф.В. Вальтер","K.F.V. Valter","Hermann Sasse","Герман Зассе",480,2),
 ("terminal_lutheran_mainline","The Mainline Lutheran","Мейнстримный лютеран","Meynstrim lüteran","Mainline Lutheran (ELCA) — ecumenical and progressive","Martin Luther","Мартин Лютер","Martin Lüter","Dietrich Bonhoeffer","Дитрих Бонхёффер","Ditrix Bonhoeffer",560,3),
 ("terminal_lutheran_nordic","The Nordic Lutheran","Скандинавский лютеран","Skandinav lüteran","Nordic Folk Church Lutheran — cultural Christianity of Scandinavia","Nathan Söderblom","Натан Сёдерблом","Natan Söderblom","Kierkegaard","Кьеркегор","Kyerkeqor",340,2),
 ("terminal_lutheran_laestadian","The Laestadian","Лестадианец","Lestadian","Laestadianism — conservative pietist revival of Northern Finland","Lars Levi Laestadius","Ларс Леви Лестадиус","Lars Levi Lestadius",160,1),
 ("terminal_reformed_pcusa","The Mainline Presbyterian","Мейнстримный пресвитерианин","Meynstrim presviterian","Presbyterian (PCUSA) — Reformed heritage, progressive witness","John Calvin","Жан Кальвин","Con Kalvin","Karl Barth","Карл Барт","Karl Bart",620,3),
 ("terminal_reformed_conservative","The Confessional Presbyterian","Конфессиональный пресвитерианин","Konfessional presviterian","Presbyterian (PCA/OPC) — Westminster Standards, covenant theology","John Calvin","Жан Кальвин","Con Kalvin","J. Gresham Machen","Дж. Грешам Мейчен","C. Qreşam Meyçen","B.B. Warfield","Б.Б. Уорфилд","B.B. Uorfild",780,4),
 ("terminal_reformed_continental","The Continental Reformed","Континентальный реформат","Kontinental reformat","Continental Reformed — Heidelberg Catechism, Dutch Calvinism","John Calvin","Жан Кальвин","Con Kalvin","Abraham Kuyper","Абрахам Койпер","Abraham Kayper","Herman Bavinck","Герман Бавинк","Herman Bavink",560,3),
 ("terminal_reformed_new_calvinism","The New Calvinist","Новый кальвинист","Yeni kalvinist","New Calvinism — Sovereign Grace, Acts 29, Gospel Coalition","John Piper","Джон Пайпер","Con Payper","Timothy Keller","Тим Келлер","Tim Keller","Kevin DeYoung","Кевин ДеЯнг","Kevin DeYanq",890,5),
 ("terminal_reformed_theonomy","The Theonomist","Теономист","Teonomist","Christian Reconstructionism — theonomy, God's law for civil society","R.J. Rushdoony","Р.Дж. Рашдуни","R.C. Ruşduni","Greg Bahnsen","Грег Бахсен","Qreq Bahnsen",240,1),
 ("terminal_anglican_anglocatholic","The Anglo-Catholic","Англо-католик","Anglo-katolik","Anglo-Catholic — High Church ritual and apostolic succession","John Henry Newman","Джон Генри Ньюмен","Con Henri Nyumen","T.S. Eliot","Т.С. Элиот","T.S. Eliot",640,3),
 ("terminal_anglican_broad","The Broad Church Anglican","Англиканин широкой церкви","Geniş kilsə anqlikanı","Broad Church Anglican — via media, reasoned faith","Richard Hooker","Ричард Хукер","Riçard Huker","William Temple","Уильям Темпл","Uilyam Templ",450,2),
 ("terminal_anglican_low","The Evangelical Anglican","Евангельский англиканин","Evangelik anqlikan","Low Church Evangelical Anglican — scripture and preaching","John Stott","Джон Стотт","Con Stott","J.I. Packer","Дж.И. Пакер","C.İ. Paker",580,3),
 ("terminal_anglican_acna","The ACNA Anglican","Англиканин ACNA","ACNA anqlikanı","ACNA / GAFCON — Global South conservative Anglicanism","Justin Welby's critics","Критики Джастина Уэлби","Castin Uelbinin tənqidçiləri","Archbishop Foley Beach","Архиепископ Фоули Бич","Arxiyepiskop Fouli Biç",390,2),
 ("terminal_anglican_continuing","The Continuing Anglican","Продолжающийся англиканин","Davamedən anqlikan","Continuing Anglican — traditional BCP 1928, orthodox protest","Bishop Walter Grundorf","Епископ Вальтер Грундорф","Yepiskop Valter Qrundorf",210,1),
 ("terminal_anabaptist_amish","The Old Order Amish","Амиш старого порядка","Köhnə tərtibli amiş","Old Order Amish — separation, simplicity, and Gelassenheit","Jakob Ammann","Якоб Амман","Yakob Amman",340,2),
 ("terminal_anabaptist_conservative_mennonite","The Conservative Mennonite","Консервативный меннонит","Mühafizəkar menonit","Conservative Mennonite — plain living and nonresistance","Menno Simons","Менно Симонс","Menno Simons",280,1),
 ("terminal_anabaptist_mennonite_mainline","The Mennonite","Меннонит","Menonit","Mennonite Church USA/Canada — peace theology and service","Menno Simons","Менно Симонс","Menno Simons","Dorothy Day","Дороти Дэй","Doroti Dey",520,3),
 ("terminal_anabaptist_hutterite","The Hutterite","Гуттерит","Hutterit","Hutterite — communal living and shared goods","Jakob Hutter","Якоб Гуттер","Yakob Hutter",170,1),
 ("terminal_anabaptist_brethren","The Brethren","Брат","Qardaş","Church of the Brethren — love feast and simple biblical faith","Alexander Mack","Александр Мак","Aleksandr Mak",260,1),
]

# Baptist
baptist_terms = [
 ("terminal_baptist_sbc","The Southern Baptist","Южный баптист","Cənubi baptist","Southern Baptist Convention — conservative evangelical congregationalism","Charles Spurgeon","Чарльз Сперджен","Çarlz Spurcon","Billy Graham","Билли Грэм","Billi Qrem","Albert Mohler","Альберт Молер","Albert Mohler",1240,7),
 ("terminal_baptist_abcusa","The American Baptist","Американский баптист","Amerika baptisti","American Baptist (ABCUSA) — mainline, progressive Baptist witness","Martin Luther King Jr.","Мартин Лютер Кинг-младший","Martin Lüter Kinq","Walter Rauschenbusch","Вальтер Раушенбуш","Valter Rauşenbuş",560,3),
 ("terminal_baptist_independent_fundamentalist","The Independent Fundamentalist Baptist","Независимый фундаменталист-баптист","Müstəqil fundamentalist baptist","Independent Fundamentalist Baptist — KJV-only separatism","Jack Hyles","Джек Хайлс","Cek Hayls","John R. Rice","Джон Р. Райс","Con R. Rays",380,2),
 ("terminal_baptist_reformed","The Reformed Baptist","Реформатский баптист","Reformasiya baptisti","Reformed Baptist — 1689 Confession, Calvinistic soteriology","Charles Spurgeon","Чарльз Сперджен","Çarlz Spurcon","John Bunyan","Джон Буньян","Con Bunyan",690,4),
 ("terminal_baptist_general","The General Baptist","Общий баптист","Ümumi baptist","General Baptist — Arminian free-will theology","Thomas Helwys","Томас Хелвис","Tomas Helvis",310,2),
 ("terminal_baptist_primitive","The Primitive Baptist","Примитивный баптист","Primitiv baptist","Primitive Baptist — hyper-Calvinist, no missions or societies","John Gill","Джон Гилл","Con Gill",210,1),
]

# Methodist
methodist_terms = [
 ("terminal_methodist_umc","The Wesleyan Methodist","Уэслианский методист","Uesliyan metodist","United / Global Methodist — Wesleyan grace and social holiness","John Wesley","Джон Уэсли","Con Uesli","Charles Wesley","Чарльз Уэсли","Çarlz Uesli",780,4),
 ("terminal_methodist_ame","The AME Methodist","Методист AME","AME metodisti","African Methodist Episcopal — Black church tradition of liberation","Richard Allen","Ричард Аллен","Riçard Allen","Absalom Jones","Абсалом Джонс","Absalom Cons",420,2),
 ("terminal_methodist_wesleyan_holiness","The Holiness Methodist","Святостный методист","Müqəddəslik metodisti","Wesleyan Church / Nazarene — entire sanctification","Phineas Bresee","Финеас Бризи","Finees Brizi","A.B. Simpson","А.Б. Симпсон","A.B. Simpson",460,2),
 ("terminal_methodist_salvation_army","The Salvationist","Спаситель","Xilasedici","Salvation Army — sacramental theology and social action","William Booth","Уильям Бут","Uilyam But","Catherine Booth","Кэтрин Бут","Ketrin But",390,2),
]

# Pentecostal
pente_terms = [
 ("terminal_pentecostal_classical","The Classical Pentecostal","Классический пятидесятник","Klassik pentekostal","Classical Pentecostal — Spirit baptism with speaking in tongues","William Seymour","Уильям Сеймур","Uilyam Seymur","Aimee Semple McPherson","Эйми Семпл Макферсон","Eymi Sempıl Makferson",890,5),
 ("terminal_pentecostal_oneness","The Oneness Pentecostal","Единственнический пятидесятник","Birlik pentekostalı","Oneness Pentecostal — Acts 2:38, Jesus-name baptism","Frank Ewart","Фрэнк Юарт","Frenk Yuart","David Bernard","Дэвид Бернард","David Bernard",480,3),
 ("terminal_pentecostal_charismatic","The Charismatic","Харизмат","Xarizmatik","Charismatic Movement — Spirit gifts within mainline churches","Dennis Bennett","Деннис Беннетт","Dennis Bennett",560,3),
 ("terminal_pentecostal_word_faith","The Word of Faith","Слово веры","İman sözü","Word of Faith — faith confession and prosperity teaching","Kenneth Hagin","Кеннет Хейгин","Kennet Heygin","Kenneth Copeland","Кеннет Коупленд","Kennet Kouplend",680,4),
 ("terminal_pentecostal_nar","The New Apostolic Reformer","Новый апостольский реформатор","Yeni apostolik islahatçı","New Apostolic Reformation — modern apostles and prophets","C. Peter Wagner","К. Питер Вагнер","C. Piter Vaqner","Bill Johnson","Билл Джонсон","Bil Conson",520,3),
]

# Non-denom
nondenom_terms = [
 ("terminal_nondenom_bible_church","The Bible Church Evangelical","Евангельская библейская церковь","Bibliya kilsəsi evangeliki","Bible Church — expository preaching, verse-by-verse","John MacArthur","Джон Макартур","Con Makartur","John Piper","Джон Пайпер","Con Payper",760,4),
 ("terminal_nondenom_megachurch","The Megachurch Attender","Прихожанин мегацеркви","Meqa-kilsə üzvü","Megachurch — modern worship, Hillsong / Life.Church culture","Brian Houston","Брайан Хьюстон","Brayan Hyuston","Craig Groeschel","Крейг Грошель","Kreq Qroşel","Steven Furtick","Стивен Фертик","Stiven Furtik",1120,6),
 ("terminal_nondenom_neo_calvinist","The Neo-Calvinist Evangelical","Неокальвинистский евангелик","Neo-kalvinist evangelik","Neo-Calvinist Evangelical — cross-centered preaching","Timothy Keller","Тим Келлер","Tim Keller","Mark Driscoll","Марк Дрисколл","Mark Driskoll",640,3),
 ("terminal_nondenom_progressive","The Progressive Evangelical","Прогрессивный евангелик","Proqressiv evangelik","Open / Progressive Evangelical — inclusive and questioning","Rachel Held Evans","Рэйчел Хелд Эванс","Reyçel Held Evans","Rob Bell","Роб Белл","Rob Bell",380,2),
]

# Adventist / JW
advent_terms = [
 ("terminal_adventist_sda","The Seventh-day Adventist","Адвентист седьмого дня","Yeddinci gün adventisti","Seventh-day Adventist — Sabbath rest, prophetic gift, holistic health","Ellen G. White","Эллен Уайт","Ellen Uayt","Joseph Bates","Джозеф Бейтс","Cozef Beyts",780,4),
 ("terminal_adventist_cog7","The Church of God (7th Day)","Церковь Бога (7-го дня)","Allah Kilsəsi (7-ci gün)","Church of God (Seventh Day) — Sabbath-keeping Adventist","Gilbert Cranmer","Гилберт Крэнмер","Gilbert Kranmer",190,1),
 ("terminal_adventist_jw","The Jehovah's Witness","Свидетель Иеговы","Yehova şahidi","Jehovah's Witnesses — Watchtower, 144,000, kingdom preaching","Charles Taze Russell","Чарльз Тейз Рассел","Çarlz Teyz Rassel","Joseph Rutherford","Джозеф Рутерфорд","Cozef Ruterford",520,3),
 ("terminal_adventist_other","The Christadelphian","Христадельфианин","Kristadelfiyan","Christadelphians / Church of God International — Bible-only restoration","John Thomas","Джон Томас","Con Tomas",160,1),
]

# Restorationist / LDS
rest_terms = [
 ("terminal_restorationist_community_christ","The Community of Christ","Община Христа","Məsih icması","Community of Christ — Latter Day Saint heritage with ecumenical direction","Joseph Smith III","Джозеф Смит III","Cozef Smit III",180,1),
 ("terminal_restorationist_flds","The Fundamentalist LDS","Фундаменталист СПД","Fundamentalist LDS","Fundamentalist LDS (FLDS) — plural marriage, patriarchic restoration","Warren Jeffs","Уоррен Джеффс","Uorren Ceffs",90,0),
 ("terminal_restorationist_unitarian","The Unitarian Universalist","Унитарианский универсалист","Unitarian universalist","Unitarian Universalism — free faith, no creed, lived values","Ralph Waldo Emerson","Ральф Уолдо Эмерсон","Ralf Uoldo Emerson","William Ellery Channing","Уильям Эллери Чаннинг","Uilyam Elleri Çanninq",480,3),
 ("terminal_restorationist_christian_science","The Christian Scientist","Христианский учёный","Xristian elm","Christian Science — metaphysical healing, Mary Baker Eddy","Mary Baker Eddy","Мэри Бейкер Эдди","Meri Beyker Eddi",240,1),
 ("terminal_lds_main","The Latter-day Saint","Святой последних дней","Axırıncı gün müqəddəsi","The Church of Jesus Christ of Latter-day Saints — restored gospel, modern prophet","Joseph Smith","Джозеф Смит","Cozef Smit","Brigham Young","Бригам Янг","Briqam Yanq","Russell M. Nelson","Рассел М. Нельсон","Rassel M. Nelson",1340,7),
 ("terminal_lds_coc","The Community of Christ (LDS)","Община Христа (СПД)","Məsih icması (LDS)","Community of Christ — Latter Day Saint, ecumenical and progressive","Joseph Smith III","Джозеф Смит III","Cozef Smit III",210,1),
 ("terminal_lds_other","The Other Latter Day Saint","Другой святой последних дней","Digər axırıncı gün müqəddəsi","Other Latter Day Saint movement — Strangite, Bickertonite, or Hedrickite","James Strang","Джеймс Стрэнг","Ceyms Streynq",120,1),
]

# ---------------- ISLAM TERMINALS ----------------
def islam(node_id, name_en, name_ru, name_az, desc_en, proof, pct, minds):
    t(node_id, {"en":name_en,"ru":name_ru,"az":name_az},
      {"en":f"You follow the Islamic path of {desc_en}. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes {desc_en} within the unity of Islam (tawhid).",
       "ru":f"Вы следуете исламскому пути {desc_en}. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает {desc_en} в единстве ислама (таухид).",
       "az":f"Siz {desc_en} İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) {desc_en} vurğulayır."},
      proof,pct,minds,["islam"])

islam_terms = [
 ("terminal_islam_ibadi","The Ibadi Muslim","Ибадит","İbadi müsəlman","Ibadi Islam of Oman — moderate Kharijite heritage","Jābir ibn Zayd","Джабир ибн Зайд","Cabir ibn Zeyd",310,2),
 ("terminal_islam_just_muslim","The Non-Madhhab Muslim","Мусульманин без мазхаба","Məzhəbsiz müsəlman","non-denominational — simply Muslim","Malcolm X","Малькольм Икс","Malkolm X",690,4),
 ("terminal_islam_maturidi","The Maturidi Hanafi","Матуридит-ханафит","Maturidi hənəfi","Maturidi creed within Hanafi jurisprudence — reason and revelation","Abu Mansur al-Maturidi","Абу Мансур аль-Матуриди","Əbu Mənsur əl-Maturidi",890,5),
 ("terminal_islam_barelvi","The Barelvi Muslim","Барельви","Bareylvi müsəlman","Barelvi tradition — Sufi veneration and love of the Prophet","Ahmed Raza Khan","Ахмед Раза Хан","Əhməd Rza Xan",640,4),
 ("terminal_islam_tablighi","The Tablighi Muslim","Таблиг","Təbliğçi müsəlman","Tablighi Jamaat — the six principles of missionary da'wah","Muhammad Ilyas Kandhlawi","Мухаммад Ильяс Кандхлави","Məhəmməd İlyas Kandhlavi",560,3),
 ("terminal_islam_gulen","The Hizmet Follower","Последователь Хизмет","Hizmet davamçısı","Gülen / Hizmet movement — education and interfaith service","Fethullah Gülen","Фетхуллах Гюлен","Fətullah Gülən",290,2),
 ("terminal_islam_deobandi_main","The Deobandi Muslim","Деобанди","Deobandi müsəlman","Deobandi tradition — Darul Uloom, traditionalist reform","Muhammad Qasim Nanautavi","Мухаммад Касим Нанаутави","Məhəmməd Qasim Nanautavi",720,4),
 ("terminal_islam_taliban","The Taliban-aligned","Талибан-ориентированный","Taliban yönümlü","Taliban-aligned Deobandism — Afghan student movement","Mullah Omar","Мулла Омар","Molla Ömər",240,1),
 ("terminal_islam_jamiat_ulema","The Jamiat Ulema","Джамиат Улема","Cəmiyyət üləma","Jamiat Ulema-e-Islam — political Deobandi party","Maulana Shabbir Ahmad Usmani","Маулана Шаббир Ахмад Усмани","Mövlana Şəbbir Əhməd Usmani",190,1),
 ("terminal_islam_tijaniyyah","The Tijani","Тиджани","Ticani","Tijaniyyah Sufi order — West African devotion","Ahmad al-Tijani","Ахмад ат-Тиджани","Əhməd ət-Ticani",480,3),
 ("terminal_islam_qadiriyya","The Qadiri Sufi","Кадирийский суфий","Qadiri sufi","Qadiriyya Sufi order — the oldest tariqa","Abdul-Qadir Gilani","Абдул-Кадир Гилани","Əbdülqadir Gilani",560,3),
 ("terminal_islam_muridiyya","The Murid","Мурид","Murid","Muridiyya of Senegal — Amadou Bamba's path of work and prayer","Amadou Bamba","Амаду Бамба","Amadu Bamba",390,2),
 ("terminal_islam_maliki_orthodox","The Maliki Muslim","Маликит","Maliki müsəlman","Maliki fiqh without Sufi affiliation","Malik ibn Anas","Малик ибн Анас","Malik ibn Ənəs",720,4),
 ("terminal_islam_ba_alawi","The Ba 'Alawi Sufi","Суфий Ба 'Алави","Ba 'Alavi sufi","Ba 'Alawi Sufi tradition of Yemen and Indonesia","Habib Umar bin Hafiz","Хабиб Умар бин Хафиз","Həbib Ömər bin Hafiz",340,2),
 ("terminal_islam_shadhiliyya","The Shadhili Sufi","Шазилийский суфий","Şazili sufi","Shadhiliyya Sufi order — Egypt and the Levant","Abu al-Hasan al-Shadhili","Абу аль-Хасан аш-Шазили","Əbu əl-Həsən əş-Şazili",420,2),
 ("terminal_islam_shafii_ashari","The Ash'ari Shafi'i","Ашарит-шафиит","Əşəri şafii","Ash'ari creed with Shafi'i fiqh — Southeast Asian mainstream","Abu al-Hasan al-Ash'ari","Абу аль-Хасан аль-Ашари","Əbu əl-Həsən əl-Əşəri",890,5),
 ("terminal_islam_shafii_orthodox","The Shafi'i Muslim","Шафиит","Şafii müsəlman","Shafi'i fiqh path","Al-Shafi'i","Аш-Шафии","əş-Şafii",640,4),
 ("terminal_islam_athari_hanbali","The Athari Hanbali","Асарский ханбалит","Əsəri hənbəli","Athari Hanbali — textual literalism of the Salaf","Ibn Taymiyyah","Ибн Таймия","İbn Teymiyyə",560,3),
 ("terminal_islam_saudi_wahhabi","The Saudi Wahhabi","Саудовский ваххабит","Səudiyyə vəhhabi","Official Wahhabism — state-sponsored purification of Saudi Arabia","Muhammad ibn Abd al-Wahhab","Мухаммад ибн Абд аль-Ваххаб","Məhəmməd ibn Əbdül-Vəhhab",780,4),
 ("terminal_islam_quietist_salafi","The Quietist Salafi","Тихий салафит","Sakit sələfi","Quietist Salafism — obedience to rulers, no politics","Rabee al-Madkhali","Раби аль-Мадхали","Rəbi əl-Mədxali",420,2),
 ("terminal_islam_activist_salafi","The Activist Salafi","Активистский салафит","Aktivist sələfi","Haraki / Sahwa Salafism — political engagement","Safar al-Hawali","Сафар аль-Хавали","Səfər əl-Havali",380,2),
 ("terminal_islam_pure_salafi","The Salafi Muslim","Салафит","Sələfi müsəlman","Salafiyya — revival of the first generations","Ibn Baz","Ибн Баз","İbn Baz",690,4),
 ("terminal_islam_alqaeda","The Al-Qaeda Aligned","Аль-Каида-ориентированный","Əl-Qaidə yönümlü","Al-Qaeda — global jihad network of Osama bin Laden","Osama bin Laden","Усама бен Ладен","Usamə bin Laden",150,1),
 ("terminal_islam_isis","The ISIS Aligned","ИГИЛ-ориентированный","İŞİD yönümlü","ISIS / ISIL / Daesh — self-styled caliphate of Abu Bakr al-Baghdadi","Abu Bakr al-Baghdadi","Абу Бакр аль-Багдади","Əbu Bəkr əl-Bağdadi",120,1),
 ("terminal_islam_boko_haram","The Boko Haram Aligned","Боко Харам-ориентированный","Boko Haram yönümlü","Boko Haram — West African takfiri jihadism","Abubakar Shekau","Абубакар Шекау","Abubakar Şekau",80,0),
 ("terminal_islam_al_shabaab","The Al-Shabaab Aligned","Аш-Шабаб-ориентированный","Əş-Şəbab yönümlü","Al-Shabaab — East African jihadist movement","Ahmed Godane","Ахмед Годане","Əhməd Godane",70,0),
 ("terminal_islam_hts","The HTS Aligned","ХТШ-ориентированный","HTS yönümlü","Hay'at Tahrir al-Sham — Syrian jihadist coalition","Abu Mohammad al-Julani","Абу Мухаммад аль-Джулани","Əbu Məhəmməd əl-Culani",90,0),
 ("terminal_islam_jihadist_other","The Jihadist","Джихадист","Cihadist","other Salafi-Jihadist affiliation","Abdullah Azzam","Абдулла Аззам","Abdulla Əzzam",100,1),
 ("terminal_islam_alawite","The Alawite","Алавит","Ələvi","Alawite (Nusayri) — Syria's distinct Shia theology","Ibn Nusayr","Ибн Нусайр","İbn Nüsəyr",340,2),
 ("terminal_islam_alevi","The Alevi","Алевит","Ələvi","Alevism of Turkey — Anatolian folk Shia with Sufi elements","Haji Bektash Veli","Хаджи Бекташ Вели","Hacı Bəktaş Vəli",480,3),
 ("terminal_islam_akhbari","The Akhbari Shia","Ахбарит","Əxbari şiə","Akhbari Twelver — tradition only, no ijtihad","Muhammad Amin al-Astarabadi","Мухаммад Амин аль-Астарабади","Məhəmməd Əmin əl-Əstərabadi",210,1),
 ("terminal_islam_shaykhi","The Shaykhi Shia","Шейхит","Şeyxi şiə","Shaykhism — 19th-century esoteric Twelver school","Ahmad al-Ahsa'i","Ахмад аль-Ахсаи","Əhməd əl-Əhsai",190,1),
 ("terminal_islam_iranian_establishment","The Iranian Establishment Shia","Шиит иранского истеблишмента","İran rəhbərliyi şiəsi","Iranian establishment — Velayat-e Faqih, Islamic Republic","Ruhollah Khomeini","Рухолла Хомейни","Ruhullah Xomeyni",890,5),
 ("terminal_islam_hezbollah","The Hezbollah-aligned","Хезболла-ориентированный","Hizbullah yönümlü","Hezbollah — Lebanese resistance movement","Hassan Nasrallah","Хасан Насралла","Həsən Nəsrullah",420,2),
 ("terminal_islam_al_dawa","The Al-Da'wa Shia","Шиит партии Да'ва","Dəvət partiyası şiəsi","Al-Da'wa Party — Iraqi Twelver political Islam","Muhammad Baqir al-Sadr","Мухаммад Бакир ас-Садр","Məhəmməd Baqir əs-Sədr",310,2),
 ("terminal_islam_najaf_quietist","The Najaf Quietist Shia","Тихий шиит Наджафа","Nəcəf sakit şiəsi","Najaf quietism — Grand Ayatollah Sistani's apolitical scholarship","Ali al-Sistani","Али ас-Систани","Əli əs-Sistani",560,3),
 ("terminal_islam_azerbaijani_twelver","The Azerbaijani Twelver","Азербайджанский шиит","Azərbaycan şiəsi","Azerbaijani / Caspian Twelver Shi'ism — regional religious identity","Nasimi","Насими","Nəsimi","Shah Ismail Khatai","Шах Исмаил Хатаи","Şah İsmayıl Xətai",640,4),
 ("terminal_islam_ismaili_other","The Ismaili Muslim","Исмаилит","İsmaili müsəlman","Ismaili tradition without specific lineage","Nasir Khusraw","Насир Хосров","Nasir Xosrov",340,2),
 ("terminal_islam_nizari_modern","The Nizari Ismaili","Низарит-исмаилит","Nizari ismaili","Nizari Ismailism — the living Imam, Aga Khan IV, and pluralism","Aga Khan IV","Ага Хан IV","Ağa Xan IV","Rumi","Руми","Rumi",560,3),
 ("terminal_islam_hashashin","The Hashashin Heritage","Наследие ассасинов","Haşşaşin irsi","Hashashins — the Nizari Ismaili order of Alamut, fortress-state of Hassan-i Sabbah","Hassan-i Sabbah","Хасан ибн Саббах","Həsən ibn Sabbah","Rashid al-Din Sinan","Рашид ад-Дин Синан","Rəşid əd-Din Sinan",240,1),
 ("terminal_islam_dawoodi_bohra","The Dawoodi Bohra","Давуди-бохра","Davudi bohra","Dawoodi Bohras — Mumbai merchant community, the Da'i al-Mutlaq","Syedna Mohammed Burhanuddin","Сайедна Мохаммед Бурхануддин","Seydna Məhəmməd Burhanuddin",340,2),
 ("terminal_islam_sulaymani_bohra","The Sulaymani Bohra","Сулеймани-бохра","Süleymani bohra","Sulaymani Bohras of Yemen","Sulayman ibn Hassan","Сулейман ибн Хассан","Süleyman ibn Həsən",110,1),
 ("terminal_islam_alavi_bohra","The Alavi Bohra","Алави-бохра","Əlavi bohra","Alavi Bohras of India","Syedna Khuzaima Qutbuddin","Сайедна Хузайма Кутбуддин","Seydna Xuzayma Qutbuddin","Ali ibn Abi Talib","Али ибн Аби Талиб","Əli ibn Əbi Talib","The Fatimid Imams","Фатимидские имамы","Fatimi imamları",90,0),
 ("terminal_islam_zaidi_traditional","The Zaidi Muslim","Зейдит","Zeydi müsəlman","Traditional Zaidism — Yemen's Hadawi school, closest to Sunni","Zayd ibn Ali","Зейд ибн Али","Zeyd ibn Əli",310,2),
 ("terminal_islam_houthi","The Houthi-aligned","Хусит-ориентированный","Husi yönümlü","Houthi / Ansar Allah — Zaidi revivalist movement of Yemen","Abdul-Malik al-Houthi","Абдул-Малик аль-Хуси","Əbdül-Malik əl-Husi",240,1),
 ("terminal_islam_naqshbandi","The Naqshbandi Sufi","Накшбандийский суфий","Nəqşibəndi sufi","Naqshbandi Sufi order — silent dhikr of Central Asia and Turkey","Baha-ud-Din Naqshband","Бахауддин Накшбанд","Bəhaəddin Nəqşibənd",780,4),
 ("terminal_islam_mevlevi","The Mevlevi","Мевлеви","Mövləvi","Mevlevi order — the whirling dervishes of Rumi","Rumi","Руми","Rumi","Sultan Walad","Султан Валад","Sultan Vələd",640,4),
 ("terminal_islam_chishti","The Chishti Sufi","Чиштийский суфий","Çişti sufi","Chishti order — the love-centered Sufism of the Indian subcontinent","Moinuddin Chishti","Муинуддин Чишти","Moinuddin Çişti","Nizamuddin Auliya","Низамуддин Аулия","Nizamuddin Övliya",520,3),
 ("terminal_islam_sufi_other","The Sufi Muslim","Суфий","Sufi müsəlman","non-affiliated Islamic mysticism","Al-Ghazali","Аль-Газали","əl-Qəzali","Ibn Arabi","Ибн Араби","İbn Ərəbi",690,4),
]

# ---------------- JUDAISM TERMINALS ----------------
def judaism(node_id, name_en, name_ru, name_az, desc_en, proof, pct, minds):
    t(node_id, {"en":name_en,"ru":name_ru,"az":name_az},
      {"en":f"You are Jewish within the {desc_en} tradition. The covenant with God and the observance of Halakha (Jewish law) shape your path of {desc_en}.",
       "ru":f"Вы — иудей в традиции {desc_en}. Завет с Богом и соблюдение Галахи (еврейского закона) формируют ваш путь {desc_en}.",
       "az":f"Siz {desc_en} ənənəsində yəhudisiniz. Tanrı ilə əhd və Halaxa (Yəhudi qanunu) sizin {desc_en} yolunuzu formalaşdırır."},
      proof,pct,minds,["judaism"])

judaism_terms = [
 ("terminal_judaism_conservative","The Conservative Jew","Консервативный иудей","Konservativ yəhudi","Conservative Judaism — Halakha as evolving tradition","Abraham Joshua Heschel","Авраам Иошуа Хешель","İbrahim Yoşua Heşel","Solomon Schechter","Соломон Шехтер","Solomon Şexter",560,3),
 ("terminal_judaism_reform","The Reform Jew","Реформистский иудей","Reform yəhudisi","Reform Judaism — ethics over law, Tikkun Olam","Abraham Geiger","Авраам Гейгер","İbrahim Qeyqer","Stephen S. Wise","Стивен С. Вайз","Stiven S. Vayz",690,4),
 ("terminal_judaism_reconstructionist","The Reconstructionist Jew","Реконструктивистский иудей","Rekonstruksionist yəhudi","Reconstructionist Judaism — Judaism as evolving civilization","Mordecai Kaplan","Мордекай Каплан","Mordekay Kaplan",310,2),
 ("terminal_judaism_karaites","The Karaite Jew","Караим","Karaim yəhudisi","Karaite Judaism — Torah alone, rejecting the Talmud","Anan ben David","Анан бен Давид","Anan ben David",210,1),
 ("terminal_judaism_samaritan","The Samaritan","Самаритянин","Samariyalı","Samaritan community — Mount Gerizim, the Samaritan Torah","Baba Rabba","Баба Рабба","Baba Rabba","Eleazar ben Tsedaka","Элеазар бен Цедака","Eleazar ben Tsedaka","The Abisha Scroll","Свиток Абиши","Abişa Tumarı",90,0),
 ("terminal_judaism_centrist","The Centrist Orthodox Jew","Центристский ортодоксальный иудей","Mərkəzçi ortodoks yəhudi","Centrist Orthodoxy — Torah u-Madda, Yeshiva University","Norman Lamm","Норман Ламм","Norman Lamm",420,2),
 ("terminal_judaism_hardal","The Hardal Jew","Хардаль","Hardal yəhudisi","Hardal — Nationalist Haredi, Torah and Zionism combined","Zvi Yehuda Kook","Цви Иегуда Кук","Zvi Yehuda Kuk",240,1),
 ("terminal_judaism_litvish","The Litvak","Литвак","Litvaş","Litvish / Misnagdim — Talmudic excellence and yeshiva culture","Elijah of Vilna (Vilna Gaon)","Элиягу из Вильны (Виленский Гаон)","Vilna Qaonu Eliyahu",380,2),
 ("terminal_judaism_sephardic_haredi","The Sephardic Haredi","Сефардский хареди","Sefarad haredi","Sephardic Haredi (Shas) — Mizrahi Torah tradition","Ovadia Yosef","Овадия Йосеф","Ovadiya Yosef",340,2),
 ("terminal_judaism_chabad","The Chabad Hasid","Хабадский хасид","Xabad xasidi","Chabad-Lubavitch — outreach and the Rebbe's message","Menachem Mendel Schneerson","Менахем Мендель Шнеерсон","Menahem Mendl Şneerson",780,4),
 ("terminal_judaism_satmar","The Satmar Hasid","Сатмарский хасид","Satmar xasidi","Satmar — insulated, fiercely anti-Zionist Hasidism","Joel Teitelbaum","Йоэль Тейтельбаум","Yoel Teytelbaum",290,2),
 ("terminal_judaism_other_hasidic","The Hasidic Jew","Хасид","Xasid yəhudi","Hasidic dynasty of Bobov, Ger, Belz, or Vizhnitz","Baal Shem Tov","Баал-Шем-Тов","Baal Şem Tov",480,3),
 ("terminal_judaism_religious_zionist","The Religious Zionist","Религиозный сионист","Dini sionist","Religious Zionism — Mizrachi, Bnei Akiva, and the return to Israel","Abraham Isaac Kook","Авраам Ицхак Кук","İbrahim İshaq Kuk",560,3),
 ("terminal_judaism_open_orthodox","The Open Orthodox Jew","Иудей открытой ортодоксии","Açıq ortodoks yəhudi","Open Orthodoxy — progressive change within halakhic commitment","Avi Weiss","Ави Вайс","Avi Vays",210,1),
 ("terminal_judaism_torah_umadda","The Torah u-Madda Jew","Иудей Тора у-Мадда","Tövra u-Madda yəhudisi","Torah u-Madda — Yeshiva University's synthesis of Torah and science","Joseph B. Soloveitchik","Йосеф Б. Соловейчик","Yosef B. Soloveychik",340,2),
]

# ---------------- OTHER UNITARIAN ----------------
t("terminal_bahai",
  {"en":"The Bahá'í","ru":"Бахаи","az":"Bəhai"},
  {"en":"You follow the Bahá'í Faith — the unity of God, the unity of religion, and the unity of humanity. Bahá'u'lláh is the latest Messenger in a line that includes Abraham, Moses, Buddha, Jesus, and Muhammad.",
   "ru":"Вы следуете вере Бахаи — единство Бога, единство религии и единство человечества. Бахаулла — последний Посланник в линии, включающей Авраама, Моисея, Будду, Иисуса и Мухаммада.",
   "az":"Siz Bəhai dininə — Tanrının, dinin və bəşəriyyətin birliyinə inanırsınız. Bəhaullah İbrahim, Musa, Buddha, İsa və Məhəmmədi əhatə edən xəttin son Elçisidir."},
  380,2,[("Bahá'u'lláh","Бахаулла","Bəhaullah"),("Abdul-Baha","Абдул-Баха","Əbdül-Bəha"),("Shoghi Effendi","Шоги Эффенди","Şoqi Əffəndi")],["bahai"])

t("terminal_druze",
  {"en":"The Druze","ru":"Друз","az":"Druz"},
  {"en":"You belong to the Druze tradition — an esoteric offshoot of Ismaili Shia, centered on the divine call of al-Hakim bi-Amr Allah, with belief in reincarnation and a hidden inner doctrine (batin).",
   "ru":"Вы принадлежите к традиции друзов — эзотерической ветви исмаилитского шиизма, сосредоточенной на божественном призыве аль-Хакима би-Амриллаха, с верой в реинкарнацию и скрытым внутренним учением (батин).",
   "az":"Siz Druz ənənəsinə aidsiniz — İsmaili şiəliyinin ezoterik qolu, əl-Hakim bi-Əmr Allahın ilahi çağırışına əsaslanan, reinkarnasiyaya inam və gizli daxili təlim (batin) ilə."},
  170,1,[("Al-Hakim bi-Amr Allah","Аль-Хаким би-Амриллах","əl-Hakim bi-Əmr Allah"),("Hamza ibn Ali","Хамза ибн Али","Həmzə ibn Əli")],["druze"])

# ---------------- HINDU TERMINALS ----------------
def hindu(node_id, name_en, name_ru, name_az, desc_en, proof, pct, minds):
    t(node_id, {"en":name_en,"ru":name_ru,"az":name_az},
      {"en":f"You follow the Hindu path of {desc_en}. The eternal dharma (Sanatana Dharma) leads you through devotion, knowledge, and practice toward moksha — liberation from the cycle of rebirth.",
       "ru":f"Вы следуете индуистскому пути {desc_en}. Вечная дхарма (санатана-дхарма) ведёт вас через преданность, знание и практику к мокше — освобождению из цикла перерождений.",
       "az":f"Siz {desc_en} Hindu yolunu izləyirsiniz. Əbədi dharma (Sanatana Dharma) sizi bəxşiş, bilik və praktika vasitəsilə mokşaya — yenidən doğum dövründən azadlığa aparır."},
      proof,pct,minds,["hindu"])

hindu_terms = [
 ("terminal_hindu_other","The New Hindu Movement","Новое индуистское движение","Yeni hindu hərəkatı","Ayyavazhi or another new Hindu movement","Ayya Vaikundar","Айя Вайкундар","Ayya Vaykundar",290,2),
 ("terminal_hindu_iskcon","The ISKCON Devotee","Преданный ИСККОН","ISKCON davamçısı","ISKCON / Hare Krishna — Gaudiya Vaishnavism and sankirtan","A.C. Bhaktivedanta Swami Prabhupada","А.Ч. Бхактиведанта Свами Прабхупада","A.Ç. Bhaktivedanta Svami Prabhupada","Chaitanya Mahaprabhu","Чайтанья Махапрабху","Çaytanya Mahaprabhu",780,4),
 ("terminal_hindu_swaminarayan","The Swaminarayan Devotee","Преданный Сваминараяна","Svaminarayan davamçısı","Swaminarayan (BAPS) — Akshar-Purushottam devotion","Bhagwan Swaminarayan","Бхагаван Сваминараян","Bhagvan Svaminarayan","Pramukh Swami Maharaj","Прамукх Свами Махарадж","Pramux Svami Maharac",480,3),
 ("terminal_hindu_sri_vaishnava","The Sri Vaishnava","Шри-вайшнав","Şri vaişnava","Sri Vaishnava — Ramanuja's qualified non-dualism","Ramanuja","Рамануджа","Ramanuca","Vedanta Desika","Веданта Десика","Vedanta Desika",420,2),
 ("terminal_hindu_madhva","The Madhva Vaishnava","Мадхва-вайшнав","Madhva vaişnava","Madhva Vaishnava — dualistic devotion to Vishnu","Madhvacharya","Мадхвачарья","Madhvaçarya",340,2),
 ("terminal_hindu_ramandi","The Ramanandi Bhakta","Рамананди-бхакт","Ramanandi bhakt","Ramanandi / North Indian bhakti — devotion to Lord Rama","Tulsidas","Тулсидас","Tulsidas","Hanuman","Хануман","Hanuman",390,2),
 ("terminal_hindu_shaiva_siddhanta","The Shaiva Siddhanta","Шайва-сиддханта","Şaiva siddhanta","Shaiva Siddhanta of Tamil Nadu — dualistic Shiva devotion","Tirumular","Тирумулар","Tirumular","Meykandar","Мейкандар","Meykandar",310,2),
 ("terminal_hindu_kashmir_shaiva","The Kashmir Shaiva","Кашмирский шайва","Kəşmir şaivası","Kashmir Shaivism (Trika) — monistic recognition of Shiva","Abhinavagupta","Абхинавагупта","Abhinavaqupta","Utpaladeva","Утпаладева","Utpaladeva",280,2),
 ("terminal_hindu_lingayat","The Lingayat","Лингаят","Linqayat","Lingayat / Virashaiva — Basava's reform without Vedic ritual","Basava","Басава","Basava","Allama Prabhu","Аллама Прабху","Allama Prabhu",290,2),
 ("terminal_hindu_nath","The Nath Yogi","Натх-йог","Nat yoqi","Nath / Hatha Yoga tradition of Gorakhnath","Gorakhnath","Горакхнатх","Qorakhnat","Matsyendranath","Мацьендранатх","Matsyendranat",340,2),
 ("terminal_hindu_kali","The Kali Bhakta","Бхакт Кали","Kali bhaktı","Kali worship of Bengal — the divine mother","Ramakrishna","Рамакришна","Ramakrişna","Swami Vivekananda","Свами Вивекананда","Svami Vivekananda",520,3),
 ("terminal_hindu_sri_vidya","The Sri Vidya Sadhaka","Сахаджака Шри-видьи","Şri Vidya sadhaka","Sri Vidya / Lalita — tantric goddess worship","Adi Shankara","Ади Шанкара","Adi Şankara","Bhaskararaya","Бхаскарарайя","Bhaskararaya",260,2),
 ("terminal_hindu_durga","The Durga Devotee","Преданный Дурги","Durqa davamçısı","Durga / Navaratri devotional Shaktism","Ramprasad Sen","Рампрасад Сен","Ramprasad Sen",310,2),
 ("terminal_hindu_advaita","The Advaitin","Адвайтин","Advaitin","Advaita Vedanta — Shankara's non-dualism, Brahman alone is real","Adi Shankara","Ади Шанкара","Adi Şankara","Swami Vivekananda","Свами Вивекананда","Svami Vivekananda",890,5),
 ("terminal_hindu_neo_vedanta","The Neo-Vedantin","Нео-ведантин","Neo-vedantin","Neo-Vedanta / Integral Yoga — modern universalized Vedanta","Swami Vivekananda","Свами Вивекананда","Svami Vivekananda","Sri Aurobindo","Шри Ауробиндо","Şri Aurobindo",560,3),
 ("terminal_hindu_arsha","The Smarta Hindu","Смарта-индуист","Smarta hindu","Arsha / Smarta orthopraxy — the six-sect Vedic householder path","Adi Shankara","Ади Шанкара","Adi Şankara",340,2),
]
# (hindu_terms handled by flexible_loop below)

# ---------------- RUN ALL LOOPS (after data lists) ----------------
def flexible_loop(terms, fn, pad_en, pad_ru, pad_az):
    """Handle tuples with 1, 2, or 3 similar-mind triples."""
    for row in terms:
        nid, en, ru, az, d = row[:5]
        tail = row[5:]
        proof, pct = tail[-2], tail[-1]
        mind_triples = tail[:-2]
        minds = list(zip(mind_triples[0::3], mind_triples[1::3], mind_triples[2::3]))
        while len(minds) < 3:
            minds.append((pad_en, pad_ru, pad_az))
        fn(nid, en, ru, az, d, proof, pct, minds[:3])

for (nid, en, ru, az, d, m1, m1r, m1a, m2, m2r, m2a, m3, m3r, m3a, pr, pc) in catholic_terms:
    cath(nid, en, ru, az, d, pr, pc, [(m1,m1r,m1a),(m2,m2r,m2a),(m3,m3r,m3a)])

flexible_loop(ec_terms, cath, "The Eastern Fathers", "Восточные отцы", "Şərq ataları")

for (nid, en, ru, az, d, m1, m1r, m1a, m2, m2r, m2a, m3, m3r, m3a, pr, pc) in order_terms:
    cath(nid, en, ru, az, d, pr, pc, [(m1,m1r,m1a),(m2,m2r,m2a),(m3,m3r,m3a)])

flexible_loop(orth_terms, orthodox, "The Church Fathers", "Отцы Церкви", "Kilsə ataları")
flexible_loop(oriental_terms, orthodox, "The Oriental Fathers", "Древневосточные отцы", "Qədim Şərq ataları")

flexible_loop(prot_terms, prot, "The Reformers", "Реформаторы", "İslahatçılar")
flexible_loop(baptist_terms, prot, "The Baptist Fathers", "Баптистские отцы", "Baptist ataları")
flexible_loop(methodist_terms, prot, "The Wesleyan Fathers", "Уэслианские отцы", "Uesliyan ataları")
flexible_loop(pente_terms, prot, "The Pentecostal Pioneers", "Пятидесятнические пионеры", "Pentekostal qabaqcıllar")
flexible_loop(nondenom_terms, prot, "The Evangelical Teachers", "Евангельские учителя", "Evangelik müəllimlər")
flexible_loop(advent_terms, prot, "The Adventist Pioneers", "Адвентистские пионеры", "Adventist qabaqcıllar")
flexible_loop(rest_terms, prot, "The Restorationists", "Реставрационисты", "Restavrasionistlər")
flexible_loop(islam_terms, islam, "The Ulema", "Улемы", "Üləma")
flexible_loop(judaism_terms, judaism, "The Sages", "Мудрецы", "Müdriklər")
flexible_loop(hindu_terms, hindu, "The Rishis", "Риши", "Rişilər")

# ---------------- EMIT TYPESCRIPT ----------------
lines = []
lines.append("// ------------------------------------------------------------")
lines.append("// TERMINALS — the Definition Cards")
lines.append("// ------------------------------------------------------------")
lines.append("export const TERMINALS: Record<string, Terminal> = {")
for (node_id, en, ru, az, ben, bru, baz, proof, pct, minds_en, minds_ru, minds_az, tags) in T:
    lines.append(f"  {node_id}: {{")
    lines.append(f"    node_id: \"{node_id}\",")
    lines.append(f"    title: {{ en: {json.dumps(en, ensure_ascii=False)}, ru: {json.dumps(ru, ensure_ascii=False)}, az: {json.dumps(az, ensure_ascii=False)} }},")
    lines.append(f"    blueprint: {{")
    lines.append(f"      en: {json.dumps(ben, ensure_ascii=False)},")
    lines.append(f"      ru: {json.dumps(bru, ensure_ascii=False)},")
    lines.append(f"      az: {json.dumps(baz, ensure_ascii=False)},")
    lines.append(f"    }},")
    lines.append(f"    social_proof: {proof},")
    lines.append(f"    percent_of_users: {pct},")
    lines.append(f"    similar_minds: [")
    for i, m in enumerate(minds_en):
        lines.append(f"      {{ en: {json.dumps(m, ensure_ascii=False)}, ru: {json.dumps(minds_ru[i], ensure_ascii=False)}, az: {json.dumps(minds_az[i], ensure_ascii=False)} }},")
    lines.append(f"    ],")
    lines.append(f"    tags: {json.dumps(tags, ensure_ascii=False)},")
    lines.append(f"  }},")
lines.append("};")
lines.append("")
lines.append("// ------------------------------------------------------------")
lines.append("// GRAPH HELPERS")
lines.append("// ------------------------------------------------------------")
lines.append("")
lines.append("/** Terminal ids for quick checks */")
lines.append("export const TERMINAL_IDS = new Set(Object.keys(TERMINALS));")
lines.append("")
lines.append("export function isTerminal(nodeId: string): boolean {")
lines.append("  return TERMINAL_IDS.has(nodeId);")
lines.append("}")
lines.append("")
lines.append("export function getNode(nodeId: string): Node {")
lines.append("  const n = NODES[nodeId];")
lines.append("  if (!n) throw new Error(`Unknown node: ${nodeId}`);")
lines.append("  return n;")
lines.append("}")
lines.append("")
lines.append("export function getTerminal(nodeId: string): Terminal {")
lines.append("  const t = TERMINALS[nodeId];")
lines.append("  if (!t) throw new Error(`Unknown terminal: ${nodeId}`);")
lines.append("  return t;")
lines.append("}")
lines.append("")
lines.append("/** Max depth (in answer steps) reachable from a node — for the progress bar */")
lines.append("export function maxDepthFrom(nodeId: string, memo: Map<string, number> = new Map()): number {")
lines.append("  if (memo.has(nodeId)) return memo.get(nodeId)!;")
lines.append("  if (isTerminal(nodeId)) return 0;")
lines.append("  const node = getNode(nodeId);")
lines.append("  const depth = 1 + Math.max(...node.options.map((o) => maxDepthFrom(o.next_node, memo)));")
lines.append("  memo.set(nodeId, depth);")
lines.append("  return depth;")
lines.append("}")
lines.append("")
lines.append("/** The DAG as a flat edge list for React Flow */")
lines.append("export function buildEdges(): { source: string; target: string }[] {")
lines.append("  const edges: { source: string; target: string }[] = [];")
lines.append("  for (const node of Object.values(NODES)) {")
lines.append("    for (const opt of node.options) {")
lines.append("      edges.push({ source: node.node_id, target: opt.next_node });")
lines.append("    }")
lines.append("  }")
lines.append("  return edges;")
lines.append("}")

print("\n".join(lines))
print(f"\n// TOTAL TERMINALS: {len(T)}", file=sys.stderr)
