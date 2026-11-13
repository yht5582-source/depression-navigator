# 憂鬱症照護導航

成人憂鬱症互動臨床輔助工具，依 NICE NG222 與 CANMAT 2023 更新版（2024 正式發表），輔以 VA／DoD MDD 2022。內容查核：2026-11-12。

**網站：https://yht5582-source.github.io/depression-navigator/**

## 功能與使用流程

1. **初始評估**：年齡、病程、功能、PHQ-9，並優先詢問自殺／自傷、躁期、精神病性症狀、身體／物質病因及周產期。未知不當作陰性。
2. **診斷確認**：由訪談確認同一段兩週的症狀、核心症狀、顯著痛苦／功能受損及鑑別。PHQ-9 不直接換算診斷項目。
3. **治療選擇**：依症狀、功能、偏好、過往反應及安全資料，討論心理介入、單一藥物選項或專科轉介。Sertraline、escitalopram、mirtazapine、duloxetine 列出起始、調整與注意事項，按肝腎功能、透析與 QT 等條件篩選。
4. **追蹤評估**：重測 PHQ-9、安全、功能、依從性、副作用與實際足量治療週數。相對原始基線計算改善，顯示趨勢與回診提示；新出現安全或嚴重不良反應優先處理。
5. **維持與復發預防**：記錄醫師確認緩解日，計算緩解後六及十二個月的檢討節點，並非自動停藥日。

附五個示範：輕症、中重症合併失眠、高齡透析、雙相鑑別，以及低總分但 PHQ-9 第九題陽性。

## 臨床依據

- [NICE NG222](https://www.nice.org.uk/guidance/ng222/chapter/recommendations)：全面評估、共享決策、症狀分層與早期複評。
- [CANMAT 2023 Update（2024 發表）](https://journals.sagepub.com/doi/full/10.1177/07067437241245384)：個別化、量測導向照護及療效不佳的處理。
- [VA／DoD 2022 MDD](https://healthquality.va.gov/HEALTHQUALITY/guidelines/mh/mdd/index.asp)：初始與進階照護流程。
- [NICE NG225](https://www.nice.org.uk/guidance/ng225/chapter/Recommendations#risk-assessment-tools-and-scales)：不以量表預測自殺或決定是否提供治療／出院。
- [NCBI 重鬱發作條件摘要](https://www.ncbi.nlm.nih.gov/books/NBK498652/table/depress-diab.T.dsm5__major_depressive_ep/?report=objectonly)
- [NIH PHQ-9 繁體中文資源](https://www.nih.gov/node/19946)

藥物頁另附 DailyMed 與臺灣 escitalopram 品項仿單連結。NICE 的 PHQ-9 16 分參考分層與一般五級分數分別標示；不同指引維持療程建議也分開呈現。

## 安全與限制

供醫療人員輔助決策，不取代面談、精神狀態檢查、醫師處方及臨床判斷。未滿 18 歲、周產期、疑似雙相、精神病性症狀與急性危機，不套用一般成人自動藥物討論。

不估算個人自殺機率，不將病人分為低／中／高風險，也不以第九題陰性保證安全。立即危險需安排急診。量表以繁體中文臨床語意呈現，正式施測須核對機構標準版本。

藥物選項不是合併服用清單。未涵蓋所有成分、禁忌、交互作用與換藥清除期；未核定臺灣健保資格，國外仿單也不等於臺灣核准／給付。實際需核對 TFDA 品項、院內用藥及當期規範。尚未經正式臨床效度或醫療器材驗證。

## 資料與隱私

無病人資料後端、無第三方分析程式、無外部字型或即時診斷 API。預設只留在頁面記憶體，重新整理會清除；可自行啟用 localStorage，並非加密病歷系統，共用裝置不宜啟用。

不輸入姓名、病歷號或其他可識別資訊。一次管理一位個案，換個案前匯出 JSON，然後按「開始新個案」。支援 JSON 匯入／匯出、CSV 與列印，備份可能含健康資訊，請依機構規範保護。關閉瀏覽器儲存會清除此工具的保留副本。

追蹤建立後鎖定基線，避免改變比較基準。匯入採欄位白名單、型別、日期與選項驗證，限制 1 MB、300 筆追蹤；同一天一筆。不主動發送提醒。

## 開發、測試與部署

零建置依賴的靜態 HTML／CSS／JavaScript。GitHub Pages 使用 `main` 分支根目錄。直接開啟 `index.html` 或啟動任意靜態伺服器。

```sh
node --check app.js
node --check engine.js
node --test tests/engine.test.cjs
```

`engine.js` 是核心安全、診斷與追蹤邏輯；`app.js` 負責介面、資料驗證、儲存及匯出；`styles.css` 支援桌面、手機與列印。修改醫療條件後應重新跑邊界測試、操作測試及臨床審閱。發布日期：2026-11-13。
