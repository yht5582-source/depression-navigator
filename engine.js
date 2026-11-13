(function(root){
'use strict';
const sum=q=>Array.isArray(q)&&q.length===9&&q.every(x=>Number.isInteger(x)&&x>=0&&x<=3)?q.reduce((a,b)=>a+b,0):null;
const severity=n=>n===null?'尚未完成':n<5?'極輕微':n<10?'輕度':n<15?'中度':n<20?'中重度':'重度';
function evaluate(s){
 const score=sum(s.phq),missing=[],count=(s.symptoms||[]).filter(Boolean).length;
 const r=(route,title,message)=>({route,title,message,score,count,severity:severity(score),missing});
 if(s.acute==='yes'||s.severe==='yes')return r('emergency','立即安排急診／緊急精神醫療評估','立即自殺危險、近期自傷行為、無法維持安全，或僵直、拒食拒水及身體不穩，須立即評估。安排陪同、避免獨處，協助遠離危險物品；勿等待下一次量表或例行門診。');
 if(s.psychosis==='yes')return r('specialist','儘速評估精神病性症狀','幻覺、妄想需當日專科評估；命令性幻聽或行為失控、安全疑慮立即急診。專科可考慮抗憂鬱劑合併抗精神病藥或 ECT。');
 if(s.ideation==='yes'||s.phq?.[8]>0)return r('safety','今日完成自殺風險臨床評估','第 9 題任何正向回答或有死亡／自傷想法，需直接詢問當前意圖、計畫、工具可近性、過往行為及支持，訂立安全計畫。這不代表停止憂鬱症治療；處方由完成風險評估的團隊決定。');
 if(s.mania==='yes')return r('bipolar','先釐清雙相情緒障礙','異常高昂／易怒、睡眠需求減少而不疲倦、精力及活動增加、話多或衝動等發作，需確認躁期／輕躁期與混合特徵。避免直接使用抗憂鬱劑單方。');
 if(s.medical==='yes')return r('medical','先釐清身體疾病、藥物或物質病因','依線索評估甲狀腺、貧血、睡眠障礙、譫妄、酒精與藥物影響，可同步處理情緒困擾，不直接確認原發性重度憂鬱症。');
 if(s.age!==''&&+s.age<18)return r('special','轉用兒童青少年照護流程','本工具限 18 歲以上成人，未滿 18 歲不套用成人處方。');
 if(s.perinatal==='yes')return r('special','安排周產期共同照護','懷孕、產後或哺乳需整合母嬰風險與既有用藥，精神科及婦產科共同決策。勿自行停藥；不產生一般成人處方。');
 for(const [k,l]of Object.entries({acute:'立即安全',ideation:'死亡／自傷想法',pastAttempt:'過往行為',severe:'僵直／身體不穩',psychosis:'精神病性症狀',mania:'躁期病史',medical:'其他病因',perinatal:'周產期',distress:'顯著痛苦／功能受損',otherPsychosis:'其他精神病鑑別',function:'功能影響'}))if(!s[k]||s[k]==='unknown')missing.push(l);
 if(s.age===''||!Number.isFinite(+s.age)||+s.age<18||+s.age>120)missing.push('有效成人年齡');
 if(s.weeks===''||!Number.isFinite(+s.weeks)||+s.weeks<0||+s.weeks>1040)missing.push('有效症狀週數');
 if(score===null)missing.push('完整 PHQ-9');if(!s.confirmSymptoms)missing.push('臨床症狀確認');
 if(missing.length)return r('incomplete','尚需完成評估','未知不視為陰性。請確認：'+missing.join('、')+'。');
 if(s.otherPsychosis==='yes')return r('specialist','進一步精神專科鑑別','釐清思覺失調、情感性思覺失調等疾病後再決定路徑。');
 if(+s.weeks<2||count<5||!(s.symptoms[0]||s.symptoms[1])||s.distress!=='yes')return r('subthreshold','目前尚未符合重鬱發作條件','仍需處理困擾，考慮適應障礙、哀傷、持續性憂鬱症與其他病因。提供支持與心理介入，約 2–4 週重評，有安全疑慮則提前。');
 return r('mdd','臨床條件支持重鬱發作，請由醫師確認','同一段至少兩週期間有至少五項症狀，含核心症狀，並有顯著痛苦或功能受損；最終診斷仍需完整病史及精神狀態檢查。');
}
function treatment(s){const a=evaluate(s);if(a.route!=='mdd')return {...a,eligible:false};const more=a.score>=16||s.function==='severe';return {...a,eligible:true,more,title:more?'討論心理治療合併抗憂鬱劑':'優先討論心理與行為介入',message:more?'症狀或功能負擔較高，優先討論個別 CBT 合併藥物；依偏好、過往療效與可近性，也可選擇適合的單一治療並密切追蹤。':'NICE 對較輕症狀通常先考慮引導式自助、CBT 或行為活化。若本人偏好藥物、曾有效或持續未改善，可共同討論藥物。'};}
function followup(b,v){const n=sum(v.phq),base=sum(b.phq),change=n!==null&&base>0?Math.round((base-n)/base*100):null,weeks=(Date.parse(v.date)-Date.parse(b.startDate))/604800000;let route='routine',title='持續追蹤症狀與功能',message='約 2–4 週評估症狀、生活功能、安全、耐受性及規律治療，必要時提前。';
 if(v.acute==='yes'||v.serious==='yes'){route='emergency';title='立即安排急診評估';message='有立即危險或疑似嚴重不良反應，勿等待例行門診；安排陪同，由醫師處理藥物。';}
 else if(v.mania==='yes'){route='specialist';title='儘速評估新出現的躁期／混合特徵';message='當日聯絡治療團隊，避免自行加量；有安全疑慮立即急診。';}
 else if(v.ideation==='yes'||v.phq?.[8]>0){route='safety';title='今日重新評估自殺風險';message='即使總分下降仍需直接訪談，更新安全計畫與聯絡安排。';}
 else if(['acute','ideation','mania','serious'].some(k=>!v[k]||v[k]==='unknown')||n===null){route='incomplete';title='本次評估尚未完成';message='請填完整 PHQ-9、安全與嚴重不良反應欄位。';}
 else if(v.side==='severe'){route='review';title='提前處理明顯副作用';message='檢查劑量、交互作用與診斷，討論調整或換藥；勿自行突然停藥。';}
 else if(n>base){route='review';title='較基線惡化，提前回診';message='重新評估安全、雙相特徵、身體疾病、依從性及壓力因素。';}
 else if(v.function==='severe'){route='review';title='功能仍嚴重受損，重新檢視照護';message='不能單以較低量表分數認定恢復，需確認生活功能、支持需求及病因。';}
 else if(n<5){title='量表達症狀緩解範圍';message='確認功能恢復、殘餘症狀與持續時間，單次低分不代表持續緩解。由醫師確認緩解日後討論維持照護。';}
 else if(change>=50){title='較基線改善至少 50%';message='達常用反應標準，持續有效且可耐受的照護，目標仍為症狀緩解與功能恢復。';}
 else if(v.adherence==='poor'){route='review';title='先處理未規律治療的原因';message='釐清副作用、可近性與理解；未達充分治療暴露不能判定抗藥性。';}
 else if(weeks>=4&&v.adequate==='yes'){route='review';title='足量治療改善不足，安排療程檢討';message='核對診斷、依從性及實際足量週數，討論優化、換藥或加心理治療。兩次充分療程失敗再由專科評估難治性憂鬱，不自動加藥。';}
 else if(weeks>=2&&change<20){route='review';title='早期改善有限，檢視治療進度';message='檢查耐受性、依從性、劑量與診斷，不能只憑早期分數判定失敗。';}
 return {route,title,message,score:n,change,weeks};}
const api={sum,severity,evaluate,treatment,followup};root.DepressionEngine=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);

