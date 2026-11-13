const Character = z.object({
  图标: z.string().default('🧝'),
  身份: z.string().default(''),
  醒着: z.boolean().default(true),
  位置: z.string().default(''),
  活动: z.string().default(''),
  心情: z.string().default('平常'),
  健康: z.string().default('健康'),
  今日: z.string().default(''),
  存在天数: z.number().optional(),
});

const Item = z.object({
  名称: z.string(),
  图标: z.string().default('📦'),
  状态: z.string().default('收着'), // 佩戴中/随身/常用/收着/备用/运转中/告急/食材
  位置: z.string().default(''),
  描述: z.string().default(''),
});

const StockItem = Item.extend({
  余量: z.number().min(0).max(100).default(100),
  余量描述: z.string().default(''),
});

export const Schema = z.object({
  $已初始化: z.boolean().default(false),

  时间: z.object({
    日期: z.string().default('八月二十三日'),
    星期: z.string().default('星期六'),
    时段: z.enum(['早晨', '上午', '午后', '傍晚', '夜晚', '深夜']).default('傍晚'),
    月相: z.string().default('十一夜'),
    天气: z.string().default('晴'),
    气温: z.string().default('29°'),
    学期: z.string().default('暑假'),
  }),

  角色: z.record(z.string(), Character).default({}),

  家计: z.object({
    持有金额: z.number().default(486200),
    本月进项: z.number().default(180000),
    进项名目: z.string().default('S.C.B观察配合费'),
    本月支出: z.record(z.string(), z.number()).default({}),
    支出备注: z.record(z.string(), z.string()).default({}),
  }),

  物品: z.object({
    晓光: z.array(Item).default([]),
    晓月: z.array(Item).default([]),
    白霜: z.array(Item).default([]),
    主人: z.array(Item).default([]),
    库存: z.array(StockItem).default([]),
  }),

  家庭: z.object({
    今日标题: z.string().default('今天很平常'),
    今日摘要: z.string().default(''),
    来客: z.string().default('无来客'),
    今日花瓶: z.string().default('向日葵'),
  }),
});

export type Schema = z.output<typeof Schema>;
