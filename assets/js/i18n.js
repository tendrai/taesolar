/* ==========================================================================
   TAE SOLAR — Lightweight i18n (EN / TH / RU / ZH)
   --------------------------------------------------------------------------
   Usage in HTML:  <span data-i18n="nav.residential">Residential</span>
                   <input data-i18n-ph="form.name" placeholder="Name">
                   <a data-i18n-aria="nav.home" aria-label="Home">
   Language is set via ?lang=th in the URL, or the switcher (which updates
   the URL so the choice is shareable and survives reload).

   NOTE FOR LAUNCH: this is a client-side switcher, which is ideal for an MVP
   but is NOT the strongest SEO setup. For full multilingual SEO you want real
   per-language URLs (/th/, /ru/, /zh/) with hreflang tags. See README.
   Translations below are machine-assisted — have a native speaker review the
   Thai, Russian and Chinese before launch.
   ========================================================================== */

const I18N = {
  en: {
    _label: 'English', _flag: '🇬🇧', _dir: 'ltr',
    'nav.residential':'Residential','nav.commercial':'Commercial','nav.calculator':'Savings Calculator',
    'nav.about':'About','nav.blog':'Blog','nav.contact':'Contact','nav.quote':'Get a Quote',
    'nav.home':'Home','nav.services':'Services',

    'hero.badge':'Official Huawei Agent in Thailand',
    'hero.badge2':'Based in Kathu, Phuket',
    'hero.h1a':'Phuket\'s trusted','hero.h1b':'solar installers',
    'hero.sub':'Local, accountable and here for the long term. Custom solar installations, upgrades and maintenance for homes and businesses across Phuket and southern Thailand.',
    'hero.cta1':'Get a Free Quote','hero.cta2':'Calculate My Savings',
    'hero.t1':'Established 2020 · Phuket office','hero.t2':'Real local team, not a call centre','hero.t3':'10+ years of solar experience',

    'card.title':'Get your free solar estimate','card.sub':'Tell us about your property and we\'ll come back with honest advice and a tailored quote.',
    'card.mini':'No obligation · Reply within 1 working day',

    'strip.label':'Trusted technology partners:','strip.huawei':'Huawei — Official Agent',

    'paths.eyebrow':'Which are you?','paths.h2':'Solar built around how you use power',
    'paths.lead':'Homes and businesses have very different needs. Choose your path and we\'ll show you exactly what\'s involved.',
    'paths.res.t':'Residential Solar','paths.res.p':'Cut your household electricity bill with a system sized properly for your roof, your usage and your budget.',
    'paths.res.l1':'Free site survey and roof assessment','paths.res.l2':'On-grid, hybrid and battery options','paths.res.l3':'Help with PEA paperwork and approvals',
    'paths.res.cta':'Explore residential solar',
    'paths.com.t':'Commercial Solar','paths.com.p':'Cut operating costs and protect your business from rising tariffs with a commercial-grade rooftop system.',
    'paths.com.l1':'Load profile and ROI analysis','paths.com.l2':'Hotels, villas, factories and retail','paths.com.l3':'Ongoing O&M and performance monitoring',
    'paths.com.cta':'Explore commercial solar',

    'calc.eyebrow':'Savings Calculator','calc.h2':'See what solar could save you',
    'calc.lead':'Adjust the sliders for a quick, honest estimate based on real Thai electricity rates and Phuket sunshine levels.',
    'calc.type':'Property type','calc.res':'Home','calc.com':'Business',
    'calc.bill':'Your average monthly electricity bill','calc.size':'System size','calc.usage':'When do you use most power?',
    'calc.usage.day':'Mostly daytime','calc.usage.mixed':'Mixed','calc.usage.night':'Mostly evening',
    'calc.battery':'Include battery storage','calc.results':'Your estimate',
    'calc.r.saving':'Estimated saving in year 1','calc.r.cost':'Indicative system cost','calc.r.payback':'Estimated payback',
    'calc.r.gen':'Estimated annual generation','calc.r.bill':'New estimated monthly bill','calc.r.25':'Estimated 25-year saving',
    'calc.r.years':'years','calc.r.yr':'/year','calc.r.mo':'/month',
    'calc.disclaimer':'Guidelines only. These figures are indicative estimates based on typical Phuket conditions, current published tariffs and standard equipment. Your actual generation, savings and cost depend on your roof, shading, usage pattern and the equipment specified. We\'ll give you exact figures after a free site survey.',
    'calc.cta':'Get an exact quote',

    'why.eyebrow':'Why Choose TAE Solar','why.h2':'Local, accountable, and still here in ten years',
    'why.lead':'Phuket has no shortage of solar sellers. Far fewer are still around when a system needs servicing.',
    'why.f1.t':'A real local office','why.f1.p':'We\'re based in Kathu, Phuket — you can visit us, meet the team and see the equipment we install.',
    'why.f2.t':'Established since 2020','why.f2.p':'A registered Thai company with over a decade of hands-on experience in the solar industry.',
    'why.f3.t':'Honest sizing, not overselling','why.f3.p':'We size systems to your actual usage. A system that\'s too big is wasted money, and we\'ll tell you so.',
    'why.f4.t':'Aftercare that answers the phone','why.f4.p':'Maintenance, monitoring and repairs — for the systems we install and for systems installed by others.',

    'proc.eyebrow':'How It Works','proc.h2':'From first call to switched on',
    'proc.s1.t':'Talk to us','proc.s1.p':'Tell us about your property and your bills. We\'ll give you a realistic indication straight away.',
    'proc.s2.t':'Free site survey','proc.s2.p':'We assess your roof, shading, wiring and meter, then design a system that actually fits.',
    'proc.s3.t':'Installation','proc.s3.p':'Our team installs to specification, handles the paperwork and commissions the system.',
    'proc.s4.t':'Aftercare','proc.s4.p':'Monitoring, maintenance and support for the life of the system.',

    'rev.eyebrow':'What Our Customers Say','rev.h2':'Trusted by homes and businesses in Phuket',
    'rev.meta':'Google reviews','rev.cta':'Read all reviews on Google',

    'loc.eyebrow':'Find Us','loc.h2':'A real office in Kathu, Phuket',
    'loc.lead':'We\'re not a call centre or a middleman. Come and meet the team, see the equipment, and talk to the people who will actually install your system.',
    'loc.office':'Office','loc.sales':'Sales (Thai & English)','loc.tech':'Technical inquiries','loc.email':'Email','loc.hours':'Opening hours',
    'loc.hours.v':'Monday–Saturday, 9:00–18:00',

    'faq.eyebrow':'Common Questions','faq.h2':'Solar in Thailand, answered simply',

    'cta.h2':'Ready to find out what solar would cost you?','cta.p':'Free site survey, honest advice and a no-obligation quote.','cta.btn':'Get My Free Quote',

    'form.first':'First name','form.last':'Last name','form.email':'Email','form.phone':'Phone / LINE',
    'form.location':'Area / district','form.ptype':'Property type','form.service':'What do you need?','form.bill':'Monthly electricity bill',
    'form.msg':'Anything else we should know?','form.send':'Send my request','form.select':'Select…','form.optional':'Optional',
    'form.p.home':'Home / residential','form.p.biz':'Business / commercial','form.p.other':'Other',
    'form.s.new':'New installation','form.s.up':'System upgrade','form.s.fix':'Maintenance / repair','form.s.adv':'Not sure — need advice',
    'form.note':'We\'ll reply within one working day. Your details are only used to prepare your quote.',
    'form.ok':'Thank you — your request has been prepared. Your email app should open; if it doesn\'t, please call or LINE us directly.',
    'form.err':'Please add your name and email so we can reply.',

    'foot.blurb':'Custom solar solutions for homes and businesses across Phuket and southern Thailand. Honest advice, quality workmanship and long-term support.',
    'foot.explore':'Explore','foot.contact':'Contact','foot.legal':'Legal',
    'foot.privacy':'Privacy policy','foot.terms':'Terms of service','foot.rights':'All rights reserved.',
    'foot.company':'TAE 2020 (Thailand) Ltd.',
    'mob.call':'Call','mob.quote':'Free Quote'
  },

  th: {
    _label:'ไทย', _flag:'🇹🇭', _dir:'ltr',
    'nav.residential':'บ้านพักอาศัย','nav.commercial':'เชิงพาณิชย์','nav.calculator':'คำนวณเงินที่ประหยัดได้',
    'nav.about':'เกี่ยวกับเรา','nav.blog':'บทความ','nav.contact':'ติดต่อเรา','nav.quote':'ขอใบเสนอราคา',
    'nav.home':'หน้าแรก','nav.services':'บริการ',

    'hero.badge':'ตัวแทนอย่างเป็นทางการของ Huawei ในประเทศไทย',
    'hero.badge2':'สำนักงานที่กะทู้ ภูเก็ต',
    'hero.h1a':'ผู้ติดตั้งโซลาร์','hero.h1b':'ที่ภูเก็ตไว้วางใจ',
    'hero.sub':'ทีมงานท้องถิ่นที่รับผิดชอบและอยู่กับคุณในระยะยาว ออกแบบ ติดตั้ง อัปเกรด และบำรุงรักษาระบบโซลาร์สำหรับบ้านและธุรกิจทั่วภูเก็ตและภาคใต้',
    'hero.cta1':'ขอใบเสนอราคาฟรี','hero.cta2':'คำนวณเงินที่ประหยัดได้',
    'hero.t1':'ก่อตั้งปี 2563 · สำนักงานในภูเก็ต','hero.t2':'ทีมงานท้องถิ่นจริง ไม่ใช่คอลเซ็นเตอร์','hero.t3':'ประสบการณ์มากกว่า 10 ปี',

    'card.title':'รับการประเมินโซลาร์ฟรี','card.sub':'บอกรายละเอียดบ้านหรือธุรกิจของคุณ แล้วเราจะให้คำแนะนำตามจริงพร้อมใบเสนอราคา',
    'card.mini':'ไม่มีข้อผูกมัด · ตอบกลับภายใน 1 วันทำการ',

    'strip.label':'พันธมิตรด้านเทคโนโลยีที่เชื่อถือได้:','strip.huawei':'Huawei — ตัวแทนอย่างเป็นทางการ',

    'paths.eyebrow':'คุณคือใคร?','paths.h2':'ระบบโซลาร์ที่ออกแบบตามการใช้ไฟของคุณ',
    'paths.lead':'บ้านและธุรกิจมีความต้องการต่างกันมาก เลือกเส้นทางของคุณแล้วเราจะอธิบายทุกขั้นตอน',
    'paths.res.t':'โซลาร์สำหรับบ้าน','paths.res.p':'ลดค่าไฟบ้านด้วยระบบที่ออกแบบให้พอดีกับหลังคา การใช้ไฟ และงบประมาณของคุณ',
    'paths.res.l1':'สำรวจหน้างานและประเมินหลังคาฟรี','paths.res.l2':'ทางเลือกออนกริด ไฮบริด และแบตเตอรี่','paths.res.l3':'ช่วยดำเนินเอกสารและขออนุญาตกับ กฟภ.',
    'paths.res.cta':'ดูโซลาร์สำหรับบ้าน',
    'paths.com.t':'โซลาร์เชิงพาณิชย์','paths.com.p':'ลดต้นทุนการดำเนินงานและป้องกันธุรกิจจากค่าไฟที่สูงขึ้นด้วยระบบระดับอุตสาหกรรม',
    'paths.com.l1':'วิเคราะห์โหลดการใช้ไฟและผลตอบแทน','paths.com.l2':'โรงแรม วิลล่า โรงงาน และร้านค้า','paths.com.l3':'ดูแลบำรุงรักษาและติดตามประสิทธิภาพต่อเนื่อง',
    'paths.com.cta':'ดูโซลาร์เชิงพาณิชย์',

    'calc.eyebrow':'เครื่องคำนวณ','calc.h2':'ดูว่าโซลาร์ช่วยคุณประหยัดได้เท่าไร',
    'calc.lead':'ปรับแถบเลื่อนเพื่อประเมินเบื้องต้น คำนวณจากอัตราค่าไฟจริงในไทยและระดับแสงแดดของภูเก็ต',
    'calc.type':'ประเภทอาคาร','calc.res':'บ้าน','calc.com':'ธุรกิจ',
    'calc.bill':'ค่าไฟเฉลี่ยต่อเดือน','calc.size':'ขนาดระบบ','calc.usage':'คุณใช้ไฟมากที่สุดตอนไหน?',
    'calc.usage.day':'ช่วงกลางวันเป็นหลัก','calc.usage.mixed':'ผสมกัน','calc.usage.night':'ช่วงเย็นเป็นหลัก',
    'calc.battery':'รวมแบตเตอรี่สำรองไฟ','calc.results':'ผลการประเมิน',
    'calc.r.saving':'ประหยัดได้ในปีแรก','calc.r.cost':'ราคาระบบโดยประมาณ','calc.r.payback':'ระยะเวลาคืนทุน',
    'calc.r.gen':'ผลิตไฟได้ต่อปีโดยประมาณ','calc.r.bill':'ค่าไฟใหม่ต่อเดือนโดยประมาณ','calc.r.25':'ประหยัดรวม 25 ปี',
    'calc.r.years':'ปี','calc.r.yr':'/ปี','calc.r.mo':'/เดือน',
    'calc.disclaimer':'เป็นเพียงแนวทางเบื้องต้นเท่านั้น ตัวเลขนี้ประเมินจากสภาพทั่วไปในภูเก็ต อัตราค่าไฟที่ประกาศใช้ และอุปกรณ์มาตรฐาน ผลลัพธ์จริงขึ้นอยู่กับหลังคา เงา รูปแบบการใช้ไฟ และอุปกรณ์ที่เลือก เราจะให้ตัวเลขที่แม่นยำหลังการสำรวจหน้างานฟรี',
    'calc.cta':'ขอใบเสนอราคาที่แม่นยำ',

    'why.eyebrow':'ทำไมต้อง TAE Solar','why.h2':'ท้องถิ่น รับผิดชอบ และยังอยู่กับคุณในอีกสิบปี',
    'why.lead':'ภูเก็ตมีคนขายโซลาร์จำนวนมาก แต่มีน้อยรายที่ยังอยู่ให้บริการเมื่อระบบต้องการการดูแล',
    'why.f1.t':'สำนักงานท้องถิ่นจริง','why.f1.p':'เราอยู่ที่กะทู้ ภูเก็ต คุณเข้ามาพบทีมงานและดูอุปกรณ์ที่เราติดตั้งได้',
    'why.f2.t':'ก่อตั้งตั้งแต่ปี 2563','why.f2.p':'บริษัทจดทะเบียนในไทย พร้อมประสบการณ์ตรงในวงการโซลาร์มากกว่าสิบปี',
    'why.f3.t':'ออกแบบตามจริง ไม่ขายเกินจำเป็น','why.f3.p':'เราออกแบบระบบตามการใช้ไฟจริงของคุณ ระบบที่ใหญ่เกินไปคือเงินที่เสียเปล่า และเราจะบอกคุณตรง ๆ',
    'why.f4.t':'บริการหลังการขายที่ติดต่อได้จริง','why.f4.p':'ดูแล ตรวจสอบ และซ่อมบำรุง ทั้งระบบที่เราติดตั้งและระบบที่ติดตั้งโดยผู้อื่น',

    'proc.eyebrow':'ขั้นตอนการทำงาน','proc.h2':'ตั้งแต่โทรครั้งแรกจนระบบเริ่มทำงาน',
    'proc.s1.t':'พูดคุยกับเรา','proc.s1.p':'บอกรายละเอียดอาคารและค่าไฟของคุณ เราจะให้ตัวเลขเบื้องต้นได้ทันที',
    'proc.s2.t':'สำรวจหน้างานฟรี','proc.s2.p':'เราตรวจหลังคา เงา ระบบสายไฟ และมิเตอร์ แล้วออกแบบระบบที่เหมาะสมจริง',
    'proc.s3.t':'ติดตั้ง','proc.s3.p':'ทีมงานติดตั้งตามสเปก ดำเนินเอกสาร และทดสอบระบบให้พร้อมใช้งาน',
    'proc.s4.t':'ดูแลหลังติดตั้ง','proc.s4.p':'ติดตามผล บำรุงรักษา และให้การสนับสนุนตลอดอายุการใช้งาน',

    'rev.eyebrow':'เสียงจากลูกค้า','rev.h2':'ได้รับความไว้วางใจจากบ้านและธุรกิจในภูเก็ต',
    'rev.meta':'รีวิวจาก Google','rev.cta':'อ่านรีวิวทั้งหมดบน Google',

    'loc.eyebrow':'ที่ตั้งของเรา','loc.h2':'สำนักงานจริงที่กะทู้ ภูเก็ต',
    'loc.lead':'เราไม่ใช่คอลเซ็นเตอร์หรือคนกลาง เชิญเข้ามาพบทีมงาน ดูอุปกรณ์ และพูดคุยกับคนที่จะติดตั้งระบบให้คุณจริง ๆ',
    'loc.office':'สำนักงาน','loc.sales':'ฝ่ายขาย (ไทย & อังกฤษ)','loc.tech':'ฝ่ายเทคนิค','loc.email':'อีเมล','loc.hours':'เวลาทำการ',
    'loc.hours.v':'จันทร์–เสาร์ 9:00–18:00 น.',

    'faq.eyebrow':'คำถามที่พบบ่อย','faq.h2':'เรื่องโซลาร์ในไทย เข้าใจง่าย ๆ',

    'cta.h2':'อยากรู้ว่าโซลาร์สำหรับคุณราคาเท่าไร?','cta.p':'สำรวจหน้างานฟรี คำแนะนำตามจริง และใบเสนอราคาที่ไม่มีข้อผูกมัด','cta.btn':'ขอใบเสนอราคาฟรี',

    'form.first':'ชื่อ','form.last':'นามสกุล','form.email':'อีเมล','form.phone':'เบอร์โทร / LINE',
    'form.location':'พื้นที่ / อำเภอ','form.ptype':'ประเภทอาคาร','form.service':'คุณต้องการอะไร?','form.bill':'ค่าไฟต่อเดือน',
    'form.msg':'มีอะไรอยากบอกเราเพิ่มเติมไหม?','form.send':'ส่งคำขอ','form.select':'เลือก…','form.optional':'ไม่บังคับ',
    'form.p.home':'บ้านพักอาศัย','form.p.biz':'ธุรกิจ / เชิงพาณิชย์','form.p.other':'อื่น ๆ',
    'form.s.new':'ติดตั้งใหม่','form.s.up':'อัปเกรดระบบ','form.s.fix':'ซ่อมบำรุง','form.s.adv':'ยังไม่แน่ใจ ขอคำแนะนำ',
    'form.note':'เราจะตอบกลับภายใน 1 วันทำการ ข้อมูลของคุณใช้เพื่อจัดทำใบเสนอราคาเท่านั้น',
    'form.ok':'ขอบคุณ — เราเตรียมคำขอของคุณแล้ว แอปอีเมลจะเปิดขึ้น หากไม่เปิด กรุณาโทรหรือติดต่อทาง LINE',
    'form.err':'กรุณากรอกชื่อและอีเมลเพื่อให้เราติดต่อกลับได้',

    'foot.blurb':'ระบบโซลาร์ที่ออกแบบเฉพาะสำหรับบ้านและธุรกิจทั่วภูเก็ตและภาคใต้ คำแนะนำตามจริง งานติดตั้งคุณภาพ และการดูแลระยะยาว',
    'foot.explore':'เมนู','foot.contact':'ติดต่อ','foot.legal':'ข้อกำหนด',
    'foot.privacy':'นโยบายความเป็นส่วนตัว','foot.terms':'เงื่อนไขการให้บริการ','foot.rights':'สงวนลิขสิทธิ์',
    'foot.company':'บริษัท ทีเออี 2020 (ประเทศไทย) จำกัด',
    'mob.call':'โทร','mob.quote':'ขอราคา'
  },

  ru: {
    _label:'Русский', _flag:'🇷🇺', _dir:'ltr',
    'nav.residential':'Для дома','nav.commercial':'Для бизнеса','nav.calculator':'Калькулятор экономии',
    'nav.about':'О нас','nav.blog':'Блог','nav.contact':'Контакты','nav.quote':'Получить расчёт',
    'nav.home':'Главная','nav.services':'Услуги',

    'hero.badge':'Официальный агент Huawei в Таиланде',
    'hero.badge2':'Офис в Катху, Пхукет',
    'hero.h1a':'Надёжные установщики','hero.h1b':'солнечных панелей на Пхукете',
    'hero.sub':'Местная команда, которая отвечает за результат и остаётся с вами надолго. Проектирование, монтаж, модернизация и обслуживание солнечных систем для домов и бизнеса на Пхукете и юге Таиланда.',
    'hero.cta1':'Бесплатный расчёт','hero.cta2':'Рассчитать экономию',
    'hero.t1':'Основана в 2020 · офис на Пхукете','hero.t2':'Реальная местная команда, не колл-центр','hero.t3':'Более 10 лет опыта',

    'card.title':'Бесплатная оценка солнечной системы','card.sub':'Расскажите о вашем объекте — мы дадим честный совет и индивидуальный расчёт.',
    'card.mini':'Без обязательств · Ответим за 1 рабочий день',

    'strip.label':'Надёжные технологические партнёры:','strip.huawei':'Huawei — официальный агент',

    'paths.eyebrow':'Что вам подходит?','paths.h2':'Солнечная система под ваш режим потребления',
    'paths.lead':'У домов и бизнеса совершенно разные задачи. Выберите свой вариант — мы покажем, что именно входит в работу.',
    'paths.res.t':'Solar для дома','paths.res.p':'Снизьте счёт за электричество с системой, рассчитанной под вашу крышу, потребление и бюджет.',
    'paths.res.l1':'Бесплатный выезд и осмотр крыши','paths.res.l2':'Сетевые, гибридные системы и аккумуляторы','paths.res.l3':'Помощь с документами и согласованием PEA',
    'paths.res.cta':'Подробнее о системах для дома',
    'paths.com.t':'Solar для бизнеса','paths.com.p':'Сократите операционные расходы и защититесь от роста тарифов с промышленной кровельной системой.',
    'paths.com.l1':'Анализ нагрузки и окупаемости','paths.com.l2':'Отели, виллы, производства и ритейл','paths.com.l3':'Обслуживание и мониторинг производительности',
    'paths.com.cta':'Подробнее о системах для бизнеса',

    'calc.eyebrow':'Калькулятор','calc.h2':'Узнайте, сколько можно сэкономить',
    'calc.lead':'Двигайте ползунки для быстрой честной оценки на основе реальных тайских тарифов и уровня солнца на Пхукете.',
    'calc.type':'Тип объекта','calc.res':'Дом','calc.com':'Бизнес',
    'calc.bill':'Средний счёт за электричество в месяц','calc.size':'Мощность системы','calc.usage':'Когда вы больше всего расходуете энергию?',
    'calc.usage.day':'В основном днём','calc.usage.mixed':'Смешанно','calc.usage.night':'В основном вечером',
    'calc.battery':'С накопителем (аккумулятором)','calc.results':'Ваша оценка',
    'calc.r.saving':'Экономия в первый год','calc.r.cost':'Ориентировочная стоимость','calc.r.payback':'Срок окупаемости',
    'calc.r.gen':'Годовая выработка (оценка)','calc.r.bill':'Новый счёт в месяц (оценка)','calc.r.25':'Экономия за 25 лет',
    'calc.r.years':'лет','calc.r.yr':'/год','calc.r.mo':'/мес',
    'calc.disclaimer':'Только ориентировочно. Расчёт основан на типичных условиях Пхукета, действующих тарифах и стандартном оборудовании. Реальная выработка, экономия и стоимость зависят от вашей крыши, затенения, режима потребления и выбранного оборудования. Точные цифры мы дадим после бесплатного выезда на объект.',
    'calc.cta':'Получить точный расчёт',

    'why.eyebrow':'Почему TAE Solar','why.h2':'Местные, ответственные и всё ещё рядом через десять лет',
    'why.lead':'На Пхукете хватает продавцов солнечных панелей. Гораздо меньше тех, кто останется, когда системе понадобится обслуживание.',
    'why.f1.t':'Настоящий местный офис','why.f1.p':'Мы находимся в Катху, Пхукет — можно приехать, познакомиться с командой и посмотреть оборудование.',
    'why.f2.t':'Работаем с 2020 года','why.f2.p':'Зарегистрированная тайская компания с более чем десятилетним практическим опытом в солнечной энергетике.',
    'why.f3.t':'Честный расчёт, без навязывания','why.f3.p':'Мы подбираем систему под реальное потребление. Слишком большая система — это выброшенные деньги, и мы прямо об этом скажем.',
    'why.f4.t':'Поддержка, которая отвечает','why.f4.p':'Обслуживание, мониторинг и ремонт — как наших систем, так и установленных другими.',

    'proc.eyebrow':'Как это работает','proc.h2':'От первого звонка до запуска',
    'proc.s1.t':'Свяжитесь с нами','proc.s1.p':'Расскажите об объекте и счетах — мы сразу дадим реалистичный ориентир.',
    'proc.s2.t':'Бесплатный осмотр','proc.s2.p':'Оценим крышу, затенение, проводку и счётчик, затем спроектируем подходящую систему.',
    'proc.s3.t':'Монтаж','proc.s3.p':'Наша команда выполняет монтаж по спецификации, готовит документы и вводит систему в работу.',
    'proc.s4.t':'Обслуживание','proc.s4.p':'Мониторинг, техобслуживание и поддержка на весь срок службы системы.',

    'rev.eyebrow':'Отзывы клиентов','rev.h2':'Нам доверяют дома и компании на Пхукете',
    'rev.meta':'Отзывы Google','rev.cta':'Все отзывы в Google',

    'loc.eyebrow':'Как нас найти','loc.h2':'Реальный офис в Катху, Пхукет',
    'loc.lead':'Мы не колл-центр и не посредник. Приезжайте познакомиться с командой, посмотреть оборудование и поговорить с теми, кто действительно установит вашу систему.',
    'loc.office':'Офис','loc.sales':'Продажи (тайский и английский)','loc.tech':'Технические вопросы','loc.email':'Эл. почта','loc.hours':'Часы работы',
    'loc.hours.v':'Понедельник–суббота, 9:00–18:00',

    'faq.eyebrow':'Частые вопросы','faq.h2':'Просто о солнечной энергии в Таиланде',

    'cta.h2':'Хотите узнать, сколько это будет стоить именно вам?','cta.p':'Бесплатный осмотр, честный совет и расчёт без обязательств.','cta.btn':'Получить расчёт',

    'form.first':'Имя','form.last':'Фамилия','form.email':'Эл. почта','form.phone':'Телефон / LINE',
    'form.location':'Район','form.ptype':'Тип объекта','form.service':'Что вам нужно?','form.bill':'Счёт за электричество в месяц',
    'form.msg':'Что ещё нам стоит знать?','form.send':'Отправить запрос','form.select':'Выберите…','form.optional':'Необязательно',
    'form.p.home':'Дом / жильё','form.p.biz':'Бизнес / коммерция','form.p.other':'Другое',
    'form.s.new':'Новая установка','form.s.up':'Модернизация системы','form.s.fix':'Обслуживание / ремонт','form.s.adv':'Не уверен — нужен совет',
    'form.note':'Ответим в течение одного рабочего дня. Ваши данные используются только для подготовки расчёта.',
    'form.ok':'Спасибо — запрос подготовлен. Должно открыться почтовое приложение; если нет, позвоните или напишите нам в LINE.',
    'form.err':'Укажите, пожалуйста, имя и эл. почту, чтобы мы могли ответить.',

    'foot.blurb':'Солнечные решения для домов и бизнеса на Пхукете и юге Таиланда. Честный совет, качественный монтаж и долгосрочная поддержка.',
    'foot.explore':'Разделы','foot.contact':'Контакты','foot.legal':'Правовая информация',
    'foot.privacy':'Политика конфиденциальности','foot.terms':'Условия обслуживания','foot.rights':'Все права защищены.',
    'foot.company':'TAE 2020 (Thailand) Ltd.',
    'mob.call':'Позвонить','mob.quote':'Расчёт'
  },

  zh: {
    _label:'中文', _flag:'🇨🇳', _dir:'ltr',
    'nav.residential':'家庭光伏','nav.commercial':'商业光伏','nav.calculator':'节省计算器',
    'nav.about':'关于我们','nav.blog':'资讯','nav.contact':'联系我们','nav.quote':'获取报价',
    'nav.home':'首页','nav.services':'服务',

    'hero.badge':'华为泰国官方代理',
    'hero.badge2':'普吉island卡图办公室',
    'hero.h1a':'普吉值得信赖的','hero.h1b':'太阳能安装商',
    'hero.sub':'本地团队，负责到底，长期为您服务。为普吉及泰南地区的住宅和企业提供太阳能系统设计、安装、升级与维护。',
    'hero.cta1':'免费获取报价','hero.cta2':'计算我的节省',
    'hero.t1':'成立于2020年 · 普吉办公室','hero.t2':'真正的本地团队，而非客服中心','hero.t3':'超过十年行业经验',

    'card.title':'免费太阳能评估','card.sub':'告诉我们您的房产情况，我们将提供诚实的建议和量身定制的报价。',
    'card.mini':'无需承诺 · 一个工作日内回复',

    'strip.label':'值得信赖的技术合作伙伴：','strip.huawei':'华为 — 官方代理',

    'paths.eyebrow':'您属于哪一类？','paths.h2':'依据您的用电方式量身设计',
    'paths.lead':'住宅与企业的需求截然不同。选择适合您的方案，我们会详细说明整个流程。',
    'paths.res.t':'家庭太阳能','paths.res.p':'通过与您的屋顶、用电量和预算相匹配的系统，降低家庭电费支出。',
    'paths.res.l1':'免费现场勘察与屋顶评估','paths.res.l2':'并网、混合及储能电池方案','paths.res.l3':'协助办理PEA相关手续与审批',
    'paths.res.cta':'了解家庭太阳能',
    'paths.com.t':'商业太阳能','paths.com.p':'通过商用级屋顶系统降低运营成本，抵御电价上涨风险。',
    'paths.com.l1':'负荷分析与投资回报测算','paths.com.l2':'酒店、别墅、工厂与零售','paths.com.l3':'持续运维与性能监测',
    'paths.com.cta':'了解商业太阳能',

    'calc.eyebrow':'节省计算器','calc.h2':'看看太阳能能为您省多少',
    'calc.lead':'拖动滑块即可获得快速、真实的估算，依据泰国实际电价与普吉日照水平计算。',
    'calc.type':'房产类型','calc.res':'住宅','calc.com':'企业',
    'calc.bill':'您的月均电费','calc.size':'系统容量','calc.usage':'您用电高峰在什么时候？',
    'calc.usage.day':'主要在白天','calc.usage.mixed':'白天和晚上都有','calc.usage.night':'主要在晚上',
    'calc.battery':'包含储能电池','calc.results':'您的估算结果',
    'calc.r.saving':'第一年预计节省','calc.r.cost':'系统参考造价','calc.r.payback':'预计回本时间',
    'calc.r.gen':'预计年发电量','calc.r.bill':'预计新月度电费','calc.r.25':'25年预计总节省',
    'calc.r.years':'年','calc.r.yr':'/年','calc.r.mo':'/月',
    'calc.disclaimer':'仅供参考。以上数字基于普吉典型条件、现行公布电价及标准设备估算。实际发电量、节省金额与造价取决于您的屋顶、遮挡情况、用电习惯及所选设备。我们将在免费现场勘察后提供准确数据。',
    'calc.cta':'获取准确报价',

    'why.eyebrow':'为什么选择 TAE Solar','why.h2':'本地、负责，十年后依然在您身边',
    'why.lead':'普吉从不缺太阳能销售商，但在系统需要维修时仍然找得到的公司却屈指可数。',
    'why.f1.t':'真实的本地办公室','why.f1.p':'我们位于普吉卡图，您可以随时来访、与团队见面并查看我们所安装的设备。',
    'why.f2.t':'2020年成立至今','why.f2.p':'在泰国注册的公司，拥有超过十年的太阳能行业实操经验。',
    'why.f3.t':'如实设计，绝不过度推销','why.f3.p':'我们按您的实际用电量设计系统。系统过大就是浪费钱，我们会直言相告。',
    'why.f4.t':'售后随时找得到人','why.f4.p':'维护、监测与维修——无论系统是我们安装的，还是他人安装的。',

    'proc.eyebrow':'服务流程','proc.h2':'从第一通电话到系统启用',
    'proc.s1.t':'与我们联系','proc.s1.p':'告诉我们您的房产与电费情况，我们会立即给出符合实际的初步估算。',
    'proc.s2.t':'免费现场勘察','proc.s2.p':'我们会评估屋顶、遮挡、线路与电表，然后设计真正合适的系统。',
    'proc.s3.t':'安装施工','proc.s3.p':'团队按规格施工，办理相关手续，并完成系统调试。',
    'proc.s4.t':'后续维护','proc.s4.p':'在系统整个使用寿命期内提供监测、维护与技术支持。',

    'rev.eyebrow':'客户评价','rev.h2':'深受普吉住宅与企业客户信赖',
    'rev.meta':'谷歌评价','rev.cta':'在谷歌查看全部评价',

    'loc.eyebrow':'找到我们','loc.h2':'普吉卡图的实体办公室',
    'loc.lead':'我们不是客服中心，也不是中间商。欢迎前来与团队见面、查看设备，并与真正为您施工的人员当面沟通。',
    'loc.office':'办公室','loc.sales':'销售（泰语与英语）','loc.tech':'技术咨询','loc.email':'电子邮件','loc.hours':'营业时间',
    'loc.hours.v':'周一至周六 9:00–18:00',

    'faq.eyebrow':'常见问题','faq.h2':'泰国太阳能，简单说清楚',

    'cta.h2':'想知道太阳能对您来说要花多少钱？','cta.p':'免费现场勘察、诚实建议以及无义务报价。','cta.btn':'免费获取报价',

    'form.first':'名字','form.last':'姓氏','form.email':'电子邮件','form.phone':'电话 / LINE',
    'form.location':'区域','form.ptype':'房产类型','form.service':'您需要什么服务？','form.bill':'月度电费',
    'form.msg':'还有什么需要我们了解的吗？','form.send':'发送需求','form.select':'请选择…','form.optional':'选填',
    'form.p.home':'住宅','form.p.biz':'企业 / 商业','form.p.other':'其他',
    'form.s.new':'新装系统','form.s.up':'系统升级','form.s.fix':'维护 / 维修','form.s.adv':'尚未确定，需要建议',
    'form.note':'我们会在一个工作日内回复。您的信息仅用于准备报价。',
    'form.ok':'感谢您——需求已准备好。邮件应用应会打开；若未打开，请直接致电或通过LINE联系我们。',
    'form.err':'请填写您的姓名和电子邮件，以便我们回复。',

    'foot.blurb':'为普吉及泰南地区的住宅与企业提供定制太阳能解决方案。诚实建议、优质施工与长期支持。',
    'foot.explore':'导航','foot.contact':'联系方式','foot.legal':'法律信息',
    'foot.privacy':'隐私政策','foot.terms':'服务条款','foot.rights':'版权所有。',
    'foot.company':'TAE 2020 (Thailand) Ltd.',
    'mob.call':'致电','mob.quote':'免费报价'
  }
};

/* --- Engine --------------------------------------------------------------- */
const I18n = (() => {
  let current = 'en';
  const SUPPORTED = Object.keys(I18N);

  function detect(){
    const url = new URLSearchParams(location.search).get('lang');
    if(url && SUPPORTED.includes(url)) return url;
    const nav = (navigator.language || 'en').slice(0,2).toLowerCase();
    if(SUPPORTED.includes(nav)) return nav;
    return 'en';
  }

  function t(key){
    const dict = I18N[current] || I18N.en;
    return dict[key] !== undefined ? dict[key] : (I18N.en[key] !== undefined ? I18N.en[key] : key);
  }

  function apply(lang){
    if(!SUPPORTED.includes(lang)) lang = 'en';
    current = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = t(el.getAttribute('data-i18n'));
      if(v) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const v = t(el.getAttribute('data-i18n-ph'));
      if(v) el.setAttribute('placeholder', v);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const v = t(el.getAttribute('data-i18n-aria'));
      if(v) el.setAttribute('aria-label', v);
    });

    // Update switcher UI
    const cur = I18N[current];
    document.querySelectorAll('[data-lang-current]').forEach(el => {
      el.textContent = cur._flag + ' ' + cur._label;
    });
    document.querySelectorAll('.lang-menu button').forEach(b => {
      b.setAttribute('aria-current', b.dataset.lang === current ? 'true' : 'false');
    });

    // Keep language across internal links so navigation doesn't reset it
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if(!href || href.startsWith('#') || href.startsWith('http') ||
         href.startsWith('mailto:') || href.startsWith('tel:')) return;
      const u = new URL(href, location.href);
      if(current === 'en') u.searchParams.delete('lang');
      else u.searchParams.set('lang', current);
      a.setAttribute('href', u.pathname + u.search + u.hash);
    });

    document.dispatchEvent(new CustomEvent('langchange', {detail:{lang:current}}));
  }

  function set(lang){
    apply(lang);
    const u = new URL(location.href);
    if(lang === 'en') u.searchParams.delete('lang'); else u.searchParams.set('lang', lang);
    history.replaceState({}, '', u);
  }

  function init(){
    // Build menus
    document.querySelectorAll('.lang-menu').forEach(menu => {
      menu.innerHTML = SUPPORTED.map(code =>
        `<button type="button" data-lang="${code}"><span class="flag">${I18N[code]._flag}</span>${I18N[code]._label}</button>`
      ).join('');
      menu.querySelectorAll('button').forEach(b =>
        b.addEventListener('click', () => { set(b.dataset.lang); menu.closest('.lang').classList.remove('open'); })
      );
    });
    document.querySelectorAll('.lang').forEach(l => {
      const btn = l.querySelector('.lang-btn');
      btn && btn.addEventListener('click', (e) => { e.stopPropagation(); l.classList.toggle('open'); });
    });
    document.addEventListener('click', () => document.querySelectorAll('.lang.open').forEach(l => l.classList.remove('open')));
    apply(detect());
  }

  return { init, set, t, get lang(){ return current; } };
})();
