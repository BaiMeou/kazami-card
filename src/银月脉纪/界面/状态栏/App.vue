<template>
  <div class="panel">
    <header class="topbar">
      <div class="name">七〇七号别墅<small>KAZAMI</small></div>
      <div class="top-chips">
        <span class="chip">{{ data.时间.日期 }} · {{ data.时间.星期 }}</span>
        <span class="chip">{{ data.时间.时段 }}</span>
        <span class="chip moon">
          <svg width="11" height="11" viewBox="0 0 24 24"><path d="M20.5 14.5A9.5 9.5 0 1 1 9.5 3.5a7.5 7.5 0 0 0 11 11z" fill="none" stroke="#8ba0d8" stroke-width="1.8" stroke-linejoin="round"/></svg>
          {{ data.时间.月相 }}<span v-if="moonWarn" class="warn">·满月将至</span>
        </span>
        <span class="chip">{{ data.时间.天气 }} {{ data.时间.气温 }}</span>
      </div>
    </header>

    <div class="stage">

      <!-- ===== 首页 ===== -->
      <div class="home" v-show="page==='home'">
        <div class="fam-card">
          <div class="line1"><span class="big">{{ data.家庭.今日标题 }}</span><span class="small">{{ data.家庭.来客 }}</span></div>
          <div class="line2">{{ data.家庭.今日摘要 }}</div>
          <div class="vase">🌸 今日花瓶 <b>{{ data.家庭.今日花瓶 }}</b> · 按季节换的</div>
        </div>

        <div class="nav-grid">
          <div class="nav-card" @click="go('live')">
            <div class="ico">🏠</div>
            <div class="nlabel">在场</div>
            <div class="nsub">每个人的状态卡</div>
            <div class="nprev"><b>{{ charCount }}人</b> {{ homeHint }}</div>
          </div>
          <div class="nav-card" @click="go('money')">
            <div class="ico">💴</div>
            <div class="nlabel">账本</div>
            <div class="nsub">持有 · 收支 · 结余</div>
            <div class="nprev"><b>¥{{ fmtMoney(data.家计.持有金额) }}</b> <span v-if="warnExpense" class="warn">{{ warnExpense }}超支边缘</span></div>
          </div>
          <div class="nav-card" @click="go('item')">
            <div class="ico">🎒</div>
            <div class="nlabel">物品</div>
            <div class="nsub">持有物 · 库存</div>
            <div class="nprev">全家清单<span v-if="lowStock" class="warn"> · {{ lowStock }}见底</span></div>
          </div>
          <div class="nav-card" @click="go('hp')">
            <div class="ico">💚</div>
            <div class="nlabel">健康</div>
            <div class="nsub">身体状态</div>
            <div class="nprev">{{ hpSummary }}</div>
          </div>
          <div class="nav-card soon"><span class="soon-tag">未实装</span><div class="ico">💬</div><div class="nlabel">妖信</div><div class="nsub">YokaiChat · 群聊私聊</div></div>
          <div class="nav-card soon"><span class="soon-tag">未实装</span><div class="ico">📔</div><div class="nlabel">日记</div><div class="nsub">晓月的本子</div></div>
          <div class="nav-card soon"><span class="soon-tag">未实装</span><div class="ico">🗺️</div><div class="nlabel">地图</div><div class="nsub">风见市坐标</div></div>
        </div>

        <div class="home-foot">707 VILLA · KAZAMI DAILY PANEL</div>
      </div>

      <!-- ===== 在场页 ===== -->
      <div class="detail" v-show="page==='live'">
        <div class="dhead"><button class="back" @click="go('home')">‹</button><span class="dico">🏠</span><span class="dtitle">在 场</span><span class="dsub">{{ data.时间.时段 }} · {{ charCount }}人</span></div>
        <div class="dbody">
          <div v-for="(c, name) in data.角色" :key="name" class="ccard" :class="cls(name)" @click="openChar(name)">
            <span class="edge"></span>
            <div class="avatar">{{ c.图标 }}</div>
            <div class="body">
              <div class="row1"><span class="cname">{{ name }}</span><span class="role">{{ c.身份 }}</span><span class="state" :class="{off:!c.醒着}">{{ c.醒着 ? '醒着' : '睡着' }}</span></div>
              <div class="row2"><span class="loc">📍 {{ c.位置 }}</span></div>
              <div class="act">{{ c.活动 }}</div>
              <div class="vital">
                <span v-if="c.心情">心情 <b>{{ c.心情 }}</b></span>
                <span v-if="c.健康">健康 <b :class="hpClass(c.健康)">{{ c.健康 }}</b></span>
                <span v-if="c.今日">今天 <b>{{ c.今日 }}</b></span>
                <span v-if="c.存在天数">存在 <b>第{{ c.存在天数 }}天</b></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 账本页 ===== -->
      <div class="detail" v-show="page==='money'">
        <div class="dhead"><button class="back" @click="go('home')">‹</button><span class="dico">💴</span><span class="dtitle">家 用 账</span><span class="dsub">{{ monthLabel }}</span></div>
        <div class="dbody">
          <div class="money-hero">
            <div class="label">持 有 金 额</div>
            <div class="value">¥{{ fmtMoney(data.家计.持有金额) }}<small>JPY</small></div>
            <div class="inc"><span>本月进项 · {{ data.家计.进项名目 }}</span><b>+¥{{ fmtMoney(data.家计.本月进项) }}</b></div>
          </div>
          <div class="card">
            <div v-for="(amt, cat) in data.家计.本月支出" :key="cat" class="led" :class="{warn: isWarnExp(cat)}">
              <span class="lname">{{ cat }}</span>
              <span class="bar"><i :style="{width: expPct(amt) + '%'}"></i></span>
              <span class="lamt">{{ fmtMoney(amt) }}</span>
            </div>
            <div v-for="(note, cat) in data.家计.支出备注" :key="'n'+cat" class="led-note">{{ cat }}：{{ note }}</div>
          </div>
          <div class="card bal-card"><span>本月结余</span><b>+¥{{ fmtMoney(balance) }}</b></div>
        </div>
      </div>

      <!-- ===== 物品页 ===== -->
      <div class="detail" v-show="page==='item'">
        <div class="dhead"><button class="back" @click="go('home')">‹</button><span class="dico">🎒</span><span class="dtitle">持 有 物</span><span class="dsub">全家清单</span></div>
        <div class="dbody">
          <div class="own-tabs">
            <span v-for="t in itemTabs" :key="t.key" class="own-tab" :class="{cur: itab===t.key}" @click="itab=t.key">{{ t.label }}</span>
          </div>
          <div class="owner-page" v-for="t in itemTabs" :key="t.key" v-show="itab===t.key">
            <div class="owner-head" :class="t.cls"><span class="o-ico">{{ t.ico }}</span><span class="o-name">{{ t.label }}</span><span class="o-count">{{ data.物品[t.key]?.length || 0 }}件</span></div>
            <div class="item-grid">
              <div v-for="(it, i) in data.物品[t.key]" :key="i" class="item-card" :class="{low: it.状态==='告急'}" @click="openItem(t.key, i)">
                <div class="ihead"><span class="ic">{{ it.图标 }}</span><span class="istate" :class="istateCls(it.状态)">{{ it.状态 }}</span></div>
                <div class="iname">{{ it.名称 }}</div>
                <div class="idesc" v-if="it.描述">{{ it.描述 }}</div>
                <div class="iqty" v-if="it.余量 !== undefined"><span>{{ it.余量描述 || it.余量 + '%' }}</span><span class="qbar"><i :class="qtyCls(it.余量)" :style="{width: it.余量 + '%'}"></i></span></div>
                <div class="iloc" v-if="it.位置">📍 {{ it.位置 }}</div>
              </div>
              <div class="islot"><span>空位</span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== 健康页 ===== -->
      <div class="detail" v-show="page==='hp'">
        <div class="dhead"><button class="back" @click="go('home')">‹</button><span class="dico">💚</span><span class="dtitle">健 康</span><span class="dsub">身体状态</span></div>
        <div class="dbody">
          <div v-for="(c, name) in data.角色" :key="name" class="hcard" :class="cls(name)">
            <span class="edge"></span>
            <div class="body">
              <div class="row1"><span class="cname">{{ name }}</span><span class="badge" :class="{tired: isTired(c.健康)}">{{ c.健康 || '健康' }}</span></div>
              <div class="desc">{{ hpDesc(name, c) }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ===== 物品详情弹层 ===== -->
    <div class="mask" :class="{show: mItem}" @click.self="mItem=null">
      <div class="mcard" v-if="mItem">
        <div class="mhead">
          <div class="mic">{{ mItem.图标 }}</div>
          <div class="mtitle"><div class="mname">{{ mItem.名称 }}</div><div class="msub">{{ mOwner }} 持有</div></div>
          <button class="mclose" @click="mItem=null">✕</button>
        </div>
        <div class="mbody">
          <div class="mrow"><span class="mlabel">状态</span><span class="mval"><span class="istate" :class="istateCls(mItem.状态)">{{ mItem.状态 }}</span></span></div>
          <div class="mrow"><span class="mlabel">位置</span><span class="mval">{{ mItem.位置 || '—' }}</span></div>
          <div class="mrow"><span class="mlabel">描述</span><span class="mval">{{ mItem.描述 || '—' }}</span></div>
          <div class="mrow" v-if="mItem.余量 !== undefined"><span class="mlabel">余量</span><span class="mval">{{ mItem.余量描述 || mItem.余量 + '%' }}</span></div>
          <div class="move-picker" :class="{show: showMove}">
            <span v-for="d in dests" :key="d" class="mp" @click="doMove(d)">{{ d }}</span>
          </div>
          <div class="mext" :class="{show: showDetail}">
            <div class="xlabel">物 品 档 案</div>
            <div class="xrow"><span class="xl">状态</span><span class="xv">{{ mItem.状态 }}</span></div>
            <div class="xrow"><span class="xl">位置</span><span class="xv">{{ mItem.位置 }}</span></div>
            <div class="xrow"><span class="xl">描述</span><span class="xv">{{ mItem.描述 || '—' }}</span></div>
          </div>
        </div>
        <div class="mfoot">
          <button class="mbtn" @click="showMove=!showMove; showDetail=false">移动</button>
          <button class="mbtn" @click="doUse">使用</button>
          <button class="mbtn pri" @click="showDetail=!showDetail; showMove=false">{{ showDetail ? '收起详情' : '查看详情' }}</button>
        </div>
      </div>
    </div>

    <!-- ===== 角色详情弹层 ===== -->
    <div class="mask" :class="{show: mChar}" @click.self="mChar=null">
      <div class="mcard" v-if="mChar">
        <div class="mhead">
          <div class="mic">{{ mChar.c.图标 }}</div>
          <div class="mtitle"><div class="mname">{{ mChar.name }}</div><div class="msub">{{ mChar.c.身份 }}</div></div>
          <button class="mclose" @click="mChar=null">✕</button>
        </div>
        <div class="mbody">
          <div class="mrow"><span class="mlabel">状态</span><span class="mval"><span class="istate" :class="mChar.c.醒着 ? 'daily' : 'stored'">{{ mChar.c.醒着 ? '醒着' : '睡着' }}</span></span></div>
          <div class="mrow"><span class="mlabel">位置</span><span class="mval">{{ mChar.c.位置 || '—' }}</span></div>
          <div class="mrow"><span class="mlabel">在干嘛</span><span class="mval">{{ mChar.c.活动 || '—' }}</span></div>
          <div class="mrow"><span class="mlabel">身体</span><span class="mval">{{ mChar.c.健康 || '—' }}{{ mChar.c.存在天数 ? ' · 存在第' + mChar.c.存在天数 + '天' : '' }}</span></div>
          <div class="mext" :class="{show: showCDetail}">
            <div class="xlabel">档 案</div>
            <div class="xrow"><span class="xl">心情</span><span class="xv">{{ mChar.c.心情 || '—' }}</span></div>
            <div class="xrow"><span class="xl">今日</span><span class="xv">{{ mChar.c.今日 || '—' }}</span></div>
          </div>
        </div>
        <div class="mfoot">
          <button class="mbtn" @click="toggleWake">{{ mChar.c.醒着 ? '哄睡' : '叫醒' }}</button>
          <button class="mbtn" @click="follow">跟随</button>
          <button class="mbtn pri" @click="showCDetail=!showCDetail">{{ showCDetail ? '收起详情' : '查看详情' }}</button>
        </div>
      </div>
    </div>

    <div class="toast" :class="{show: toastMsg}">{{ toastMsg }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDataStore } from './store';

const store = useDataStore();
const data = computed(() => store.data);

// ===== 页面导航 =====
const page = ref<'home'|'live'|'money'|'item'|'hp'>('home');
function go(p: typeof page.value) { page.value = p; }

// ===== 通用 =====
function cls(name: string) {
  const m: Record<string,string> = { 晓光: 'xg', 晓月: 'xy', 白霜: 'bs', 主人: 'zr' };
  return m[name] || 'zr';
}
function fmtMoney(n: number) { return (n || 0).toLocaleString('ja-JP'); }
const charCount = computed(() => Object.keys(data.value.角色 || {}).length);
const homeHint = computed(() => {
  const names = Object.keys(data.value.角色 || {});
  const asleep = names.filter(n => !data.value.角色[n].醒着).length;
  return asleep ? `${asleep}人在睡` : '全员醒着';
});
const moonWarn = computed(() => /满月|十四夜|十五夜|十三夜/.test(data.value.时间.月相));

// ===== 账本 =====
const monthLabel = computed(() => (data.value.时间.日期.match(/(.+)月/) || ['','本月'])[1] + '月');
const balance = computed(() => {
  const spent = Object.values(data.value.家计.本月支出 || {}).reduce((a: number, b: any) => a + (Number(b) || 0), 0);
  return (data.value.家计.本月进项 || 0) - spent;
});
const expMax = computed(() => Math.max(1, ...Object.values(data.value.家计.本月支出 || {}).map((v: any) => Number(v) || 0)));
function expPct(amt: any) { return Math.min(100, Math.round((Number(amt) || 0) / expMax.value * 100)); }
function isWarnExp(cat: string) {
  const v = (data.value.家计.本月支出 as any)[cat] || 0;
  return v / (data.value.家计.本月进项 || 1) > 0.22;
}
const warnExpense = computed(() => Object.keys(data.value.家计.本月支出 || {}).find(k => isWarnExp(k)) || '');

// ===== 物品 =====
const itab = ref('晓光');
const itemTabs = [
  { key: '晓光', label: '🦊 晓光', cls: 'xg', ico: '🦊' },
  { key: '晓月', label: '🌙 晓月', cls: 'xy', ico: '🌙' },
  { key: '白霜', label: '🐈 白霜', cls: 'bs', ico: '🐈' },
  { key: '主人', label: '🚶 主人', cls: 'zr', ico: '🚶' },
  { key: '库存', label: '📦 库存', cls: '', ico: '📦' },
];
const lowStock = computed(() => (data.value.物品.库存 || []).find((i: any) => i.状态 === '告急' || i.余量 <= 15)?.名称 || '');
function istateCls(s: string) {
  const m: Record<string,string> = { 佩戴中: 'worn', 随身: 'carry', 常用: 'daily', 收着: 'stored', 备用: 'stored', 运转中: 'daily', 告急: 'low', 食材: 'daily', 醒着: 'daily' };
  return m[s] || 'stored';
}
function qtyCls(q: number) { return q <= 15 ? 'low' : q <= 50 ? 'warn' : ''; }

// ===== 健康 =====
function isTired(h: string) { return /疲劳|累|透支|困|病|伤|恢复/.test(h || ''); }
function hpClass(h: string) { return isTired(h) ? 'warn' : 'hp-ok'; }
function hpDesc(name: string, c: any) {
  const parts: string[] = [];
  if (c.健康) parts.push(c.健康);
  if (c.今日) parts.push(c.今日);
  if (c.存在天数) parts.push(`存在第${c.存在天数}天`);
  return parts.join(' · ') || '状态良好';
}
const hpSummary = computed(() => {
  const names = Object.keys(data.value.角色 || {});
  const tired = names.filter(n => isTired(data.value.角色[n].健康));
  return tired.length ? `良好 · ${tired.join('、')}需留意` : '全员良好';
});

// ===== Toast =====
const toastMsg = ref('');
let toastTimer: any = null;
function toast(msg: string) {
  toastMsg.value = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastMsg.value = '', 2200);
}

// ===== 物品弹层 =====
const mItem = ref<any>(null);
const mOwner = ref('');
let mItemKey = '';
let mItemIdx = -1;
const showMove = ref(false);
const showDetail = ref(false);
const dests = ['玄关', '客厅', '厨房', '二楼画室', '床头', '仓库'];
function openItem(key: string, idx: number) {
  mItemKey = key; mItemIdx = idx;
  mOwner.value = key === '库存' ? '全家' : key;
  mItem.value = data.value.物品[key][idx];
  showMove.value = false; showDetail.value = false;
}
function doMove(d: string) {
  if (mItem.value) {
    mItem.value.位置 = d;
    toast(`【${mItem.value.名称}】移到了${d}`);
  }
  showMove.value = false;
}
function doUse() {
  if (!mItem.value) return;
  if (mItem.value.余量 !== undefined) {
    mItem.value.余量 = Math.max(0, mItem.value.余量 - 15);
    if (mItem.value.余量 <= 15) {
      mItem.value.状态 = '告急';
      toast(`【${mItem.value.名称}】用掉了一些，见底了，该补货了`);
    } else {
      toast(`【${mItem.value.名称}】用掉了一点，余量 ${Math.round(mItem.value.余量)}%`);
    }
  } else {
    toast(`使用了【${mItem.value.名称}】`);
  }
}

// ===== 角色弹层 =====
const mChar = ref<{name: string, c: any} | null>(null);
const showCDetail = ref(false);
function openChar(name: string) {
  mChar.value = { name, c: data.value.角色[name] };
  showCDetail.value = false;
}
function toggleWake() {
  if (!mChar.value) return;
  const c = mChar.value.c;
  c.醒着 = !c.醒着;
  toast(c.醒着 ? `【${mChar.value.name}】醒了` : `把【${mChar.value.name}】哄去睡了`);
}
function follow() {
  if (!mChar.value) return;
  toast(`跟上【${mChar.value.name}】→ ${mChar.value.c.位置 || '？'}`);
}
</script>

<style scoped>
.panel{
  width:430px;max-width:100%;min-height:660px;margin:0 auto;
  background:var(--bg);
  border:1px solid var(--border);border-radius:6px;
  overflow:hidden;display:flex;flex-direction:column;
  box-shadow:0 18px 50px rgba(0,0,0,.5);
}

.topbar{
  flex:none;padding:10px 14px;
  background:linear-gradient(135deg,#1d1810,#241d12);
  border-bottom:1px solid var(--border);
  display:flex;align-items:center;gap:10px;
}
.topbar .name{font-family:var(--font-display);font-size:15px;font-weight:700;color:var(--gold);letter-spacing:2px;}
.topbar .name small{font-size:9px;letter-spacing:1px;opacity:.55;margin-left:6px;font-family:var(--font-data);}
.top-chips{margin-left:auto;display:flex;gap:5px;align-items:center;flex-wrap:wrap;justify-content:flex-end;}
.chip{display:inline-flex;align-items:center;gap:4px;font-size:10px;padding:3px 8px;border-radius:3px;background:var(--card-hi);border:1px solid var(--border-soft);color:var(--text-secondary);font-family:var(--font-data);white-space:nowrap;}
.chip.moon{color:var(--moon);border-color:rgba(139,160,216,.35);}
.chip.moon .warn{color:var(--warning);}

.stage{flex:1;display:flex;flex-direction:column;min-height:0;}
@keyframes fade{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}

.home{flex:1;padding:14px;display:flex;flex-direction:column;gap:10px;animation:fade .18s ease;}
.fam-card{background:linear-gradient(140deg,var(--card-hi),var(--card));border:1px solid var(--border);border-radius:5px;padding:13px 15px;}
.fam-card .line1{display:flex;align-items:baseline;justify-content:space-between;}
.fam-card .big{font-family:var(--font-display);font-size:15px;font-weight:700;letter-spacing:1px;}
.fam-card .small{font-size:10px;color:var(--text-dim);font-family:var(--font-data);}
.fam-card .line2{margin-top:7px;font-size:11px;color:var(--text-secondary);line-height:1.65;}
.fam-card .vase{margin-top:9px;padding-top:8px;border-top:1px dashed var(--border-soft);display:flex;align-items:center;gap:7px;font-size:10.5px;color:var(--text-dim);}
.fam-card .vase b{color:var(--warning);font-weight:500;}

.nav-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
.nav-card{background:var(--card);border:1px solid var(--border);border-radius:5px;padding:13px 12px 11px;cursor:pointer;transition:border-color .12s,background .12s;position:relative;}
.nav-card:hover{border-color:var(--accent);background:var(--card-hi);}
.nav-card .ico{font-size:20px;line-height:1;}
.nav-card .nlabel{margin-top:7px;font-size:13px;font-weight:700;letter-spacing:1px;font-family:var(--font-display);}
.nav-card .nsub{font-size:10px;color:var(--text-dim);margin-top:3px;letter-spacing:.5px;}
.nav-card .nprev{margin-top:7px;font-size:10.5px;color:var(--text-secondary);line-height:1.4;border-top:1px dashed var(--border-soft);padding-top:7px;}
.nav-card .nprev b{color:var(--gold);font-weight:600;font-family:var(--font-data);}
.nav-card .nprev .warn{color:var(--danger);font-weight:600;}
.nav-card.soon{opacity:.42;cursor:default;}
.nav-card.soon:hover{border-color:var(--border);background:var(--card);}
.nav-card.soon .soon-tag{position:absolute;top:9px;right:9px;font-size:9px;color:var(--text-dim);border:1px solid var(--border-soft);border-radius:3px;padding:1px 5px;letter-spacing:1px;}
.home-foot{margin-top:auto;text-align:center;font-size:9px;color:var(--text-dim);letter-spacing:2px;font-family:var(--font-data);opacity:.7;}

.detail{flex:1;display:flex;flex-direction:column;min-height:0;animation:fade .18s ease;}
.dhead{flex:none;display:flex;align-items:center;gap:10px;padding:11px 14px;border-bottom:1px solid var(--border);background:var(--card);}
.dhead .back{width:26px;height:26px;border-radius:4px;border:1px solid var(--border);background:var(--bg);color:var(--text-secondary);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:none;}
.dhead .back:hover{border-color:var(--accent);color:var(--accent);}
.dhead .dico{font-size:17px;}
.dhead .dtitle{font-family:var(--font-display);font-size:14px;font-weight:700;letter-spacing:2px;}
.dhead .dsub{font-size:10px;color:var(--text-dim);margin-left:auto;font-family:var(--font-data);letter-spacing:.5px;text-align:right;}
.dbody{flex:1;padding:13px 14px;overflow-y:auto;}

.ccard{display:flex;gap:0;background:var(--card);border:1px solid var(--border);border-radius:6px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,.25);cursor:pointer;}
.ccard + .ccard{margin-top:10px;}
.ccard .edge{width:4px;flex:none;}
.ccard.xg .edge{background:linear-gradient(180deg,var(--gold),#9a6f24);}
.ccard.xy .edge{background:linear-gradient(180deg,var(--moon),#5a6ea8);}
.ccard.bs .edge{background:linear-gradient(180deg,var(--mint),#4a7d6a);}
.ccard.zr .edge{background:linear-gradient(180deg,var(--slate),#6a6370);}
.ccard .avatar{width:64px;flex:none;display:flex;align-items:center;justify-content:center;font-size:26px;}
.ccard.xg .avatar{background:radial-gradient(circle at 40% 35%,rgba(212,162,74,.28),rgba(212,162,74,.05));}
.ccard.xy .avatar{background:radial-gradient(circle at 40% 35%,rgba(139,160,216,.28),rgba(139,160,216,.05));}
.ccard.bs .avatar{background:radial-gradient(circle at 40% 35%,rgba(111,174,150,.28),rgba(111,174,150,.05));}
.ccard.zr .avatar{background:radial-gradient(circle at 40% 35%,rgba(154,147,160,.25),rgba(154,147,160,.05));}
.ccard .body{padding:10px 12px;flex:1;min-width:0;}
.ccard .row1{display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
.ccard .cname{font-size:14px;font-weight:700;letter-spacing:1px;font-family:var(--font-display);}
.ccard.xg .cname{color:var(--gold);}
.ccard.xy .cname{color:var(--moon);}
.ccard.bs .cname{color:var(--mint);}
.ccard.zr .cname{color:var(--slate);}
.ccard .role{font-size:9px;padding:1px 7px;border-radius:3px;letter-spacing:1px;border:1px solid var(--border-soft);color:var(--text-dim);}
.ccard .state{font-size:9.5px;padding:2px 8px;border-radius:3px;letter-spacing:1px;background:rgba(127,174,132,.12);color:var(--success);border:1px solid rgba(127,174,132,.3);margin-left:auto;}
.ccard .state.off{background:rgba(140,126,108,.1);color:var(--text-dim);border-color:var(--border-soft);}
.ccard .loc{font-size:10px;color:var(--text);background:var(--card-hi);padding:2px 8px;border-radius:3px;border:1px solid var(--border-soft);letter-spacing:.5px;font-family:var(--font-data);}
.ccard .act{margin-top:8px;font-size:11px;color:var(--text-secondary);line-height:1.6;}
.ccard .vital{margin-top:8px;padding-top:7px;border-top:1px dashed var(--border-soft);display:flex;gap:12px;flex-wrap:wrap;font-size:10px;color:var(--text-dim);}
.ccard .vital b{color:var(--text-secondary);font-weight:500;}
.ccard .vital b.warn{color:var(--warning);}
.ccard .vital b.hp-ok{color:var(--success);}

.money-hero{background:linear-gradient(140deg,#2a2419,#211c14);border:1px solid var(--border);border-radius:5px;padding:15px;margin-bottom:9px;}
.money-hero .label{font-size:10px;color:var(--text-dim);letter-spacing:2.5px;}
.money-hero .value{font-size:29px;font-weight:700;font-family:var(--font-data);color:var(--gold);margin-top:5px;letter-spacing:.5px;}
.money-hero .value small{font-size:11px;font-weight:400;color:var(--text-dim);margin-left:4px;}
.money-hero .inc{margin-top:11px;padding-top:9px;border-top:1px dashed var(--border-soft);display:flex;justify-content:space-between;font-size:10.5px;color:var(--text-secondary);}
.money-hero .inc b{color:var(--success);font-family:var(--font-data);}
.led{display:grid;grid-template-columns:66px 1fr 58px;align-items:center;gap:8px;font-size:11px;padding:3px 0;}
.led .lname{color:var(--text);letter-spacing:.5px;}
.led .bar{height:6px;background:var(--bg-deep);border-radius:3px;overflow:hidden;}
.led .bar i{display:block;height:100%;background:var(--info);border-radius:3px;}
.led.warn .lname{color:var(--danger);}
.led.warn .bar i{background:var(--danger);}
.led .lamt{text-align:right;font-family:var(--font-data);font-size:11.5px;color:var(--text-secondary);}
.led-note{font-size:9.5px;color:var(--danger);margin:4px 0 2px;line-height:1.45;}
.bal-card{display:flex;justify-content:space-between;align-items:center;border-left:3px solid var(--success);font-size:11.5px;color:var(--text-secondary);}
.bal-card b{font-family:var(--font-data);font-size:16px;color:var(--success);}
.card{background:var(--card);border:1px solid var(--border);border-radius:5px;padding:11px 13px;}
.card + .card{margin-top:9px;}

.own-tabs{display:flex;gap:4px;margin-bottom:10px;flex-wrap:wrap;}
.own-tab{font-size:10.5px;padding:5px 11px;border-radius:4px;background:var(--card);color:var(--text-secondary);border:1px solid var(--border);cursor:pointer;transition:all .12s;user-select:none;}
.own-tab:hover{border-color:var(--accent);}
.own-tab.cur{background:var(--card-hi);color:var(--text);font-weight:600;border-color:var(--accent);}
.owner-head{display:flex;align-items:center;gap:8px;padding:7px 11px;margin-bottom:7px;background:var(--card);border:1px solid var(--border);border-radius:5px;}
.owner-head .o-ico{font-size:14px;}
.owner-head .o-name{font-size:12px;font-weight:700;letter-spacing:1.5px;font-family:var(--font-display);}
.owner-head .o-count{margin-left:auto;font-size:9.5px;color:var(--text-dim);font-family:var(--font-data);letter-spacing:.5px;}
.owner-head.xg{border-left:3px solid var(--gold);}.owner-head.xg .o-name{color:var(--gold);}
.owner-head.xy{border-left:3px solid var(--moon);}.owner-head.xy .o-name{color:var(--moon);}
.owner-head.bs{border-left:3px solid var(--mint);}.owner-head.bs .o-name{color:var(--mint);}
.owner-head.zr{border-left:3px solid var(--slate);}.owner-head.zr .o-name{color:var(--slate);}
.item-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.item-card{background:var(--card);border:1px solid var(--border);border-radius:5px;padding:10px 11px;transition:border-color .12s;cursor:pointer;}
.item-card:hover{border-color:var(--accent);}
.item-card:active{transform:scale(.98);}
.item-card .ihead{display:flex;align-items:center;justify-content:space-between;}
.item-card .ic{font-size:20px;line-height:1;width:34px;height:34px;flex:none;display:flex;align-items:center;justify-content:center;background:var(--card-hi);border:1px solid var(--border-soft);border-radius:5px;}
.istate{font-size:9px;padding:2px 8px;border-radius:3px;letter-spacing:1px;border:1px solid var(--border-soft);color:var(--text-dim);}
.istate.worn{color:var(--gold);border-color:rgba(212,162,74,.4);background:rgba(212,162,74,.08);}
.istate.carry{color:var(--info);border-color:rgba(125,159,196,.4);background:rgba(125,159,196,.08);}
.istate.daily{color:var(--mint);border-color:rgba(111,174,150,.35);background:rgba(111,174,150,.08);}
.istate.stored{color:var(--text-dim);border-color:var(--border-soft);background:var(--card-hi);}
.istate.low{color:var(--danger);border-color:rgba(217,106,85,.45);background:rgba(217,106,85,.1);}
.item-card .iname{font-size:11.5px;font-weight:600;margin-top:8px;letter-spacing:.5px;}
.item-card .idesc{font-size:10px;color:var(--text-dim);margin-top:3px;line-height:1.4;}
.item-card .iloc{margin-top:7px;padding-top:6px;border-top:1px dashed var(--border-soft);font-size:9.5px;color:var(--text-dim);font-family:var(--font-data);letter-spacing:.3px;}
.item-card .iqty{margin-top:6px;display:flex;align-items:center;gap:6px;font-size:10px;font-family:var(--font-data);color:var(--text-secondary);}
.item-card .iqty .qbar{flex:1;height:4px;background:var(--bg-deep);border-radius:2px;overflow:hidden;}
.item-card .iqty .qbar i{display:block;height:100%;background:var(--mint);border-radius:2px;}
.item-card .iqty .qbar i.warn{background:var(--warning);}
.item-card .iqty .qbar i.low{background:var(--danger);}
.item-card.low{border-color:rgba(217,106,85,.45);}
.item-card.low .iname{color:var(--danger);}
.islot{border:1px dashed var(--border);border-radius:5px;min-height:96px;display:flex;align-items:center;justify-content:center;color:var(--text-dim);font-size:11px;letter-spacing:3px;opacity:.55;}

.hcard{display:flex;background:var(--card);border:1px solid var(--border);border-radius:5px;overflow:hidden;}
.hcard + .hcard{margin-top:9px;}
.hcard .edge{width:4px;flex:none;}
.hcard.xg .edge{background:var(--gold);}
.hcard.xy .edge{background:var(--moon);}
.hcard.bs .edge{background:var(--mint);}
.hcard.zr .edge{background:var(--slate);}
.hcard .body{padding:10px 12px;flex:1;}
.hcard .row1{display:flex;align-items:center;gap:8px;}
.hcard .cname{font-size:13px;font-weight:700;letter-spacing:1px;font-family:var(--font-display);}
.hcard.xg .cname{color:var(--gold);}
.hcard.xy .cname{color:var(--moon);}
.hcard.bs .cname{color:var(--mint);}
.hcard.zr .cname{color:var(--slate);}
.hcard .badge{margin-left:auto;font-size:9.5px;padding:2px 9px;border-radius:3px;background:rgba(127,174,132,.12);color:var(--success);border:1px solid rgba(127,174,132,.3);letter-spacing:1px;}
.hcard .badge.tired{background:rgba(224,160,80,.1);color:var(--warning);border-color:rgba(224,160,80,.35);}
.hcard .desc{margin-top:7px;font-size:11px;color:var(--text-secondary);line-height:1.55;}

.mask{position:fixed;inset:0;background:rgba(10,8,5,.62);backdrop-filter:blur(2px);display:none;align-items:center;justify-content:center;z-index:100;padding:16px;animation:maskIn .15s ease;}
.mask.show{display:flex;}
@keyframes maskIn{from{opacity:0}to{opacity:1}}
.mcard{width:380px;max-width:100%;background:var(--bg);border:1px solid var(--border);border-radius:7px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,.6);animation:slideUp .18s ease;}
@keyframes slideUp{from{transform:translateY(10px);opacity:0}to{transform:none;opacity:1}}
.mhead{display:flex;align-items:center;gap:12px;padding:14px 15px;border-bottom:1px solid var(--border);background:linear-gradient(135deg,var(--card-hi),var(--card));}
.mhead .mic{font-size:28px;width:52px;height:52px;flex:none;display:flex;align-items:center;justify-content:center;background:var(--bg-deep);border:1px solid var(--border);border-radius:6px;}
.mhead .mtitle{flex:1;min-width:0;}
.mhead .mname{font-family:var(--font-display);font-size:15px;font-weight:700;letter-spacing:1px;}
.mhead .msub{font-size:10px;color:var(--text-dim);margin-top:3px;font-family:var(--font-data);}
.mhead .mclose{width:26px;height:26px;border-radius:50%;border:none;background:transparent;color:var(--text-dim);font-size:17px;cursor:pointer;flex:none;display:flex;align-items:center;justify-content:center;}
.mhead .mclose:hover{background:rgba(255,255,255,.06);color:var(--text);}
.mbody{padding:13px 15px;}
.mrow{display:flex;gap:9px;padding:6px 0;font-size:11.5px;line-height:1.55;}
.mrow + .mrow{border-top:1px dashed var(--border-soft);}
.mrow .mlabel{flex:none;width:44px;color:var(--text-dim);font-size:10px;letter-spacing:1px;padding-top:1px;}
.mrow .mval{flex:1;color:var(--text-secondary);}
.move-picker{display:none;flex-wrap:wrap;gap:6px;margin-top:9px;}
.move-picker.show{display:flex;animation:fade .15s ease;}
.move-picker .mp{font-size:10.5px;padding:5px 11px;border-radius:4px;cursor:pointer;background:var(--card-hi);border:1px solid var(--border);color:var(--text-secondary);}
.move-picker .mp:hover{border-color:var(--accent);color:var(--text);}
.mext{display:none;margin-top:9px;padding:10px 12px;background:var(--card-hi);border:1px solid var(--border-soft);border-radius:5px;}
.mext.show{display:block;animation:fade .15s ease;}
.mext .xlabel{font-size:10px;color:var(--text-dim);letter-spacing:2px;margin-bottom:6px;}
.mext .xrow{display:flex;gap:8px;padding:4px 0;font-size:11px;line-height:1.55;}
.mext .xrow .xl{flex:none;width:56px;color:var(--text-dim);font-size:10px;}
.mext .xrow .xv{flex:1;color:var(--text-secondary);}
.mfoot{display:flex;gap:7px;padding:12px 15px;border-top:1px solid var(--border);background:var(--card);}
.mbtn{flex:1;padding:9px;border-radius:4px;border:1px solid var(--border);background:var(--card-hi);color:var(--text-secondary);font-size:11.5px;cursor:pointer;letter-spacing:1px;font-family:var(--font-body);}
.mbtn:hover{border-color:var(--accent);color:var(--text);}
.mbtn.pri{background:var(--accent);border-color:var(--accent);color:#fff;font-weight:600;font-family:var(--font-display);}

.toast{position:fixed;left:50%;bottom:42px;transform:translateX(-50%) translateY(12px);background:var(--card-hi);border:1px solid var(--border);color:var(--text);font-size:11.5px;padding:8px 16px;border-radius:5px;letter-spacing:.5px;opacity:0;transition:all .25s ease;z-index:200;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,.5);max-width:90%;}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
</style>
