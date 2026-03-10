# 新增按鈕指南（統一按鈕）

專案按鈕一律使用以下四種組件，**不要**寫 `<button class="btn btn-primary">`。

**改顏色**：在 `src/styles/_custom.scss` 覆寫 **三種** 語意色即可，全站按鈕會一併更新：
- `.btn-primary` / `.btn-outline-primary`（及 hover、disabled）
- `.btn-secondary` / `.btn-outline-secondary`（及 hover、disabled）
- `.btn-danger` / `.btn-outline-danger`（及 hover、disabled）
若有使用 `variant="tertiary"` 再補 `.btn-tertiary`。

---

## 流程（四步）

```
1. 看情境 → 選組件
2. 看語意 → 選 variant（必要時選 appearance / size）
3. 在頁面寫組件 + 綁 @click
4. 跑檢查表
```

---

## 1. 選組件（依情境）

| 情境 | 組件 | 備註 |
|------|------|------|
| 表單底部（儲存、取消、重設） | **FormButton** | 多顆並排時加 `no-wrapper`，父層用 `col-*` 排 |
| 查詢區 / 工具列（查詢、匯出、新增） | **QueryButton** | — |
| 表格操作欄（明細、刪除、編輯） | **DataTableButton** | 預設 outlined |
| 對話框關閉、小工具、inline 鈕 | **UtilityButton** | 可加 `icon`、`class` |

---

## 2. 選樣式（variant / appearance / size）

| 屬性 | 可選值 | 常用對應 |
|------|--------|----------|
| **variant** | `primary` \| `secondary` \| `danger` | 主要動作 / 次要或取消 / 刪除或危險 |
| **appearance** | `contained` \| `outlined` \| `text` | 實心 / 描邊 / 文字鈕（預設多為 contained） |
| **size** | `sm` \| `md` \| `lg` | 小 / 中 / 大 |

文案用 i18n：`label="btn.xxx"` 或 `label="ui.xxx"`；非 key 時用 `:label="某變數"` + `:is-label-i18n="false"`。

---

## 3. 程式碼範例

```vue
<!-- 表單底一顆 -->
<FormButton label="btn.save" variant="primary" @click="submit" />

<!-- 表單底多顆並排 -->
<div class="row mt-2">
  <div class="col-md-2 p-2">
    <FormButton no-wrapper label="btn.save" variant="primary" @click="submit" />
  </div>
  <div class="col-md-2 p-2">
    <FormButton no-wrapper label="btn.reset" variant="secondary" @click="reset" />
  </div>
</div>

<!-- 查詢列 -->
<QueryButton label="btn.query" variant="primary" @click="query" />

<!-- 表格操作欄 -->
<DataTableButton label="btn.detail" variant="primary" @click="openDetail(row)" />
<DataTableButton label="btn.delete" variant="danger" @click="onDelete(row)" />

<!-- 對話框關閉 / 工具鈕 -->
<UtilityButton label="btn.close" variant="primary" appearance="contained" class="mt-3" @click="close" />
```

需要 **disabled**：`:is-disabled="條件"`。  
需要 **icon**（僅 UtilityButton）：`icon="ri-xxx"`。

---

## 4. 檢查表

- [ ] 依情境選了 FormButton / QueryButton / DataTableButton / UtilityButton（沒用裸 `<button class="btn ...">`）
- [ ] 用 `variant` / `appearance` / `size` 控制樣式
- [ ] 文案用 `label="btn.xxx"` 或 i18n；必要時 `isLabelI18n="false"`
- [ ] 表單底多顆用 FormButton 時有加 `no-wrapper` 且父層用 `col-*` 排版
- [ ] 若專案有保留按鈕展示頁，可到對應區補一顆新按鈕（非必要）

---

## 檔案位置

| 用途 | 路徑 |
|------|------|
| FormButton | `@/components/formTable/FormButton.vue` |
| QueryButton | `@/components/query/QueryButton.vue` |
| DataTableButton | `@/components/dataTable/DataTableButton.vue` |
| UtilityButton | `@/components/UtilityButton.vue` |
| 改顏色 | `src/styles/_custom.scss`（僅三種：.btn-primary、.btn-secondary、.btn-danger；有 tertiary 再補） |
