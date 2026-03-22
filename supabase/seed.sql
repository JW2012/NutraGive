-- Dummy requests — run once in the Supabase SQL editor (new query tab).
-- user_id is null so these are not tied to any account.
-- RLS is bypassed when running SQL directly in the dashboard.

insert into requests (name, title, description, amount_goal, status, tags, feeds_people, feeds_weeks) values

('Yasmin',
 'Displaced mother in Gaza — my children have not had a full meal in days',
 'I am a mother of four living in a displacement camp in southern Gaza. Since the conflict escalated we have been forced from our home and have almost no access to food. The aid trucks do not reach us consistently. My youngest is two years old and I am desperate to feed my children.',
 195, 'open', '{refugee,children,urgent}', 4, 2),

('Kofi',
 'Starving family in northern Ghana — drought destroyed our harvest',
 'Our village in the northern region of Ghana lost almost its entire harvest this year due to a severe drought. My wife and I have five children and we are rationing what little we have left. We have no income and no crops. Any help with food will carry us through until the next planting season.',
 175, 'open', '{family,children}', 5, 3),

('Amira',
 'Syrian refugee family — three years in a Lebanese camp with shrinking rations',
 'We fled Syria in 2021 and have been living in a camp in Lebanon ever since. The UN ration cuts have left us with far less than we need. My husband is ill and cannot work. We have two daughters in school who are coming home hungry every day.',
 160, 'open', '{refugee,children,medical}', 4, 2),

('Emmanuel',
 'Malnourished children in South Sudan — food crisis in our community',
 'I run a small community kitchen in Juba, South Sudan. We serve children who come to us severely malnourished. Our supplies ran out last week and we have no funding to restock. There are over a dozen children who depend on us for their only daily meal.',
 250, 'open', '{children,urgent}', 12, 1),

('Fatima',
 'Afghan widow — feeding my five children after losing everything',
 'My husband was killed and we lost our home. I fled to Kabul with my five children and we have been living with strangers. I have no income and no family nearby. My children are going to school hungry and I cannot bear to watch them suffer.',
 185, 'open', '{refugee,children,single parent}', 5, 2),

('Samuel',
 'Elderly man in rural Kenya — too weak to farm, too hungry to recover',
 'I am 74 years old and live alone in a small village in Kenya. I used to farm to feed myself but my health has deteriorated and I can no longer work the land. My children are far away. I have not had a proper meal in over a week and I am getting weaker.',
 90, 'open', '{elderly,medical}', 1, 3),

('Malia',
 'Single mother in war-torn Sudan — fleeing conflict with three children',
 'I fled the fighting in Khartoum with my three children after our neighborhood was destroyed. We crossed into Chad and are now in a refugee settlement. There is very little food here and what exists is not enough for growing children. My youngest has not been well.',
 200, 'open', '{refugee,single parent,children,urgent}', 3, 3),

('Ibrahim',
 'University student from Gaza — studying abroad with no access to family funds',
 'I am a Palestinian student studying abroad. Since the war began I have been completely cut off from my family and any financial support from home. I am struggling to afford food while keeping up with my studies. I do not know if my family is safe.',
 80, 'open', '{student,refugee}', 1, 2),

('Grace',
 'Orphaned children in eastern DRC — community feeding program needs help',
 'I care for eleven orphaned children in a small shelter in eastern Democratic Republic of Congo. The ongoing conflict in the region has destroyed our supply chains and we have received no donations in two months. The children are malnourished and I am running out of options.',
 230, 'open', '{children,urgent}', 11, 1),

('Nour',
 'Palestinian grandmother caring for grandchildren after parents were killed',
 'Both of my grandchildren''s parents were killed in the conflict. I am 68 years old and I am doing my best to raise them alone. We are surviving on very little. I cannot always find food and I worry every day that what I give them is not enough to keep them healthy.',
 140, 'open', '{elderly,children,refugee,urgent}', 3, 2);
