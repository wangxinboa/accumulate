/**
 * ============================================================
 *  卡牌游戏核心数据规范 (草案 - 用于代码开发参考)
 *
 *  本文件定义了整个游戏的静态数据骨架，所有游戏逻辑
 *  都由这些纯数据驱动，无硬编码。
 *
 *  核心模块：
 *    - attributes          属性定义（状态、数值、标签）
 *    - logicOperators      条件判断算子
 *    - slotGenerationRules 动态卡槽生成规则
 *    - environmentalRules  全局环境效果
 *    - actions             玩家可执行的动作
 *    - events              叙事事件/结局（支持自动、手动、周期触发）
 *    - cardTemplates       卡牌原型（主角、NPC、物品、地点）
 *    - saveData            运行时存档结构示例
 *    - effectTypesDoc      效果类型说明（非运行时数据）
 * ============================================================
 */
export default {
	// ========================
	// 1. 属性库
	//    定义游戏中所有可能出现的属性（数值、状态、标签等）。
	//    每张卡牌实例可以动态拥有任意这些属性。
	// ========================
	attributes: [
		{
			id: 0,
			type: "number", // 属性值类型："string" | "boolean" | "number" | "Array<string>" | "Array<boolean>" | "Array<number>"
			name: "灵币",
			description: "通用货币，可用于购买、献祭或支付各种消耗",
		},
		{
			id: 1,
			type: "string",
			name: "身份",
			description: "角色当前的社会身份，如“流浪者”、“修士”、“贵族”，影响剧情分支和可用动作",
		},
		{
			id: 2,
			type: "boolean",
			name: "已觉醒",
			description: "是否触发了觉醒事件，觉醒后可能解锁特殊能力或新动作",
		},
		{
			id: 3,
			type: "Array<string>",
			name: "标签",
			description: '卡牌携带的语义标签，用于动态匹配与分类。例如 ["可食用", "工具", "神圣"]',
		},
		{
			id: 4,
			type: "number",
			name: "灵力值",
			description: "角色的灵力强度，影响修炼、魔法效果等",
		},
		{
			id: 5,
			type: "number",
			name: "生命值",
			description: "角色的当前生命值，归零可能触发死亡事件",
		},
		{
			id: 10,
			type: "number",
			name: "残忍值",
			description: "角色的残忍程度，数值越高行为越冷酷，可解锁特定的残忍选项",
		},
		{
			id: 11,
			type: "boolean",
			name: "持有献祭密法",
			description: "是否已习得献祭密法，控制能否进行更复杂的献祭仪式",
		},
		{
			id: 12,
			type: "number",
			name: "天赋",
			description: "角色的天生资质，影响修炼速度和某些事件的触发",
		},
		{
			id: 100,
			type: "string",
			name: "卡牌位置状态",
			description: '卡牌实例当前所处的逻辑位置，如"inventory"（库存）、"equipped"（已装备）、"battlefield"（战场）',
		},
		{
			id: 200,
			type: "string",
			name: "当前天气",
			description: '世界范围内的天气状态，如"晴天"、"暴雨"、"沙尘"，影响环境规则',
		},
		{
			id: 201,
			type: "string",
			name: "当前季节",
			description: '世界当前的季节，如"春"、"夏"、"秋"、"冬"，可影响事件触发和环境效果',
		},
		// 示例：带有信息遮蔽的关系属性
		{
			id: 300,
			type: "number",
			name: "对李道人的好感",
			description: "主角对李道人的态度数值，正数友好，负数敌对",
			hidden: true, // UI默认不显示具体数值
			revealCondition: {
				// 满足此条件时，UI才显示数值或模糊描述
				logic: "numberGreaterOrEquals",
				attributeId: 300,
				value: 30,
				source: "cardTemplate:0",
			},
			fuzzyMapping: [
				// 模糊文本映射，用于展示“模糊状态”
				{ maxValue: -30, text: "充满敌意" },
				{ maxValue: 0, text: "态度冷淡" },
				{ maxValue: 30, text: "态度友善" },
				{ maxValue: 100, text: "十分亲近" },
			],
		},
		// 注：其它动态关系属性（如 relation_to_template_50）运行时添加，无需在此预定义
	],

	// ========================
	// 2. 逻辑算子
	//    条件判断的“动词”，描述了可以怎样比较属性和状态。
	//    每个条件对象需要引用一个算子，并提供相应参数。
	// ========================
	logicOperators: {
		// --- 基本比较 ---
		attributeEquals: "attributeEquals", // 字符串相等
		attributeNotEquals: "attributeNotEquals", // 字符串不等
		numberGreaterThan: "numberGreaterThan", // 数字大于
		numberGreaterOrEquals: "numberGreaterOrEquals", // 数字大于等于
		numberLessThan: "numberLessThan", // 数字小于
		numberLessOrEquals: "numberLessOrEquals", // 数字小于等于
		numberEquals: "numberEquals", // 数字等于
		arrayContains: "arrayContains", // 数组包含某元素
		arrayNotContains: "arrayNotContains", // 数组不包含某元素
		arrayEquals: "arrayEquals", // 数组完全等于
		booleanTrue: "booleanTrue", // 布尔为真
		booleanFalse: "booleanFalse", // 布尔为假
		attributeExists: "attributeExists", // 属性存在（已定义）
		attributeNotExists: "attributeNotExists", // 属性不存在

		// --- 玩家/世界库存 ---
		playerHasCardTemplate: "playerHasCardTemplate", // 玩家是否拥有某模板卡牌
		playerCardCount: "playerCardCount", // 玩家某模板卡牌数量比较

		// --- 主卡牌相关 ---
		mainCardHasAttribute: "mainCardHasAttribute", // 主卡牌是否拥有某属性
		mainCardAttribute: "mainCardAttribute", // 主卡牌某属性值比较

		// --- 槽内状态 ---
		slotHasCardTemplate: "slotHasCardTemplate", // 槽中是否有某模板卡牌
		slotHasCardWithTag: "slotHasCardWithTag", // 槽中是否有带某标签的卡牌
		slotTotalAttribute: "slotTotalAttribute", // 槽内卡牌某数值属性总和比较
		slotCardCount: "slotCardCount", // 槽内卡牌数量比较

		// --- 世界/时间 ---
		currentTurn: "currentTurn", // 当前回合数比较
		worldAttribute: "worldAttribute", // 直接比较世界属性
	},

	// ========================
	// 3. 全局槽生成规则
	//    描述动作面板中可能出现的每一个卡槽。
	//    每个规则定义一个槽的完整配置，并可包含放入后解锁新槽的逻辑。
	// ========================
	slotGenerationRules: [
		{
			id: "sg_offering", // 规则唯一ID
			description: "祭品槽定义",
			conditions: [], // 槽自身出现的条件（空=始终出现）
			slot: {
				id: "offering",
				label: "献上祭品",
				acceptedTemplateIds: [
					{
						templateId: 1, // 草药
						conditions: [], // 额外放入条件
						unlockSlots: [
							// 放入后解锁的新槽
							{
								unlockConditions: [
									// 解锁条件
									{ logic: "playerHasCardTemplate", templateId: 12 },
								],
								slotGenerationRuleIds: ["sg_catalyst"],
							},
						],
					},
					{
						templateId: 7, // 活物
						conditions: [],
						unlockSlots: [
							{
								unlockConditions: [],
								slotGenerationRuleIds: ["sg_sacrifice_blade"],
							},
						],
					},
				],
				minCards: 1,
				maxCards: 1,
				cardConditions: [], // 对放入卡牌自身属性的通用限制
			},
		},
		{
			id: "sg_catalyst",
			description: "催化剂槽（由祭品槽放入草药后解锁）",
			conditions: [],
			slot: {
				id: "catalyst",
				label: "放入催化剂",
				acceptedTemplateIds: [{ templateId: 13, conditions: [] }],
				minCards: 1,
				maxCards: 1,
			},
		},
		{
			id: "sg_sacrifice_blade",
			description: "祭刀槽（由祭品槽放入活物后解锁）",
			conditions: [],
			slot: {
				id: "sacrifice_blade",
				label: "选择祭刀",
				acceptedTemplateIds: [{ templateId: 10, conditions: [] }],
				minCards: 1,
				maxCards: 1,
			},
		},
		{
			id: "sg_cauldron",
			description: "主材料槽",
			conditions: [{ logic: "numberGreaterOrEquals", attributeId: 4, value: 10, source: "player" }],
			slot: {
				id: "cauldron",
				label: "放入主材料",
				acceptedTemplateIds: [
					{ templateId: 1, conditions: [] },
					{ templateId: 7, conditions: [] },
				],
				minCards: 1,
				maxCards: 1,
			},
		},
		{
			id: "sg_container",
			description: "容器槽",
			conditions: [{ logic: "booleanTrue", attributeId: 2, source: "player" }],
			slot: {
				id: "container",
				label: "选择容器",
				acceptedTemplateIds: [{ templateId: 15, conditions: [] }],
				minCards: 1,
				maxCards: 1,
			},
		},
	],

	// ========================
	// 4. 环境规则
	//    不附着于卡牌，是作用于整个世界的持续效果。
	// ========================
	environmentalRules: [
		{
			id: "env_storm",
			description: "暴雨削弱火焰",
			conditions: [{ logic: "attributeEquals", attributeId: 200, value: "暴雨", source: "world" }],
			effects: [
				{
					type: "modifyAttribute",
					target: "allCardsWithTag",
					tag: "火焰",
					attributeId: 4,
					operation: "multiply",
					value: 0.5,
				},
			],
		},
		{
			id: "env_winter",
			description: "冬季植物生长减半",
			conditions: [{ logic: "attributeEquals", attributeId: 201, value: "冬", source: "world" }],
			effects: [
				{
					type: "modifyAttribute",
					target: "allCardsWithTag",
					tag: "植物",
					attributeId: 4,
					operation: "multiply",
					value: 0.5,
				},
			],
		},
	],

	// ========================
	// 5. 动作定义
	//    玩家可执行的操作。引用槽生成规则，定义消耗与效果分支。
	// ========================
	actions: [
		{
			id: 0,
			name: "献祭仪式",
			description: "向古老神明献上祭品",
			slotGenerationRuleIds: ["sg_offering"],
			reEvaluateSlotsOnChange: true,
			cost: [{ logic: "numberGreaterOrEquals", attributeId: 0, value: 50, source: "player" }],
			matchMode: "first", // 匹配第一个满足条件的分支
			outcomeRules: [
				{
					id: "outcome_combined",
					description: "同时放入草药和活物",
					conditions: [
						{ logic: "slotHasCardTemplate", slotId: "offering", templateId: 1 },
						{ logic: "slotHasCardTemplate", slotId: "offering", templateId: 7 },
					],
					effects: [{ type: "produceCard", templateId: 99, location: "player", amount: 1 }],
				},
				{
					id: "outcome_herb",
					description: "只放入草药",
					conditions: [{ logic: "slotHasCardTemplate", slotId: "offering", templateId: 1 }],
					effects: [{ type: "produceCard", templateId: 20, location: "player", amount: 1 }],
				},
				{
					id: "outcome_creature",
					description: "只放入活物",
					conditions: [{ logic: "slotHasCardTemplate", slotId: "offering", templateId: 7 }],
					effects: [
						{ type: "modifyAttribute", target: "player", attributeId: 10, operation: "increase", value: 2 },
						{ type: "triggerEvent", eventId: 200 },
					],
				},
				{
					id: "outcome_default",
					description: "默认无效果",
					conditions: [],
					effects: [],
				},
			],
			conditions: [],
		},
		{
			id: 1,
			name: "炼制魔药",
			description: "将材料炼制成魔药",
			slotGenerationRuleIds: ["sg_cauldron", "sg_catalyst", "sg_container"],
			reEvaluateSlotsOnChange: true,
			cost: [{ logic: "numberGreaterOrEquals", attributeId: 0, value: 30, source: "player" }],
			matchMode: "first",
			outcomeRules: [
				{
					id: "potion_default",
					description: "炼制成功",
					conditions: [],
					effects: [{ type: "produceCard", templateId: 30, location: "player", amount: 1 }],
				},
			],
			conditions: [],
		},
		// 采摘动作（触发选择事件）
		{
			id: 10,
			name: "采摘",
			description: "采摘悬崖上的草药",
			slotGenerationRuleIds: ["sg_cliff_herb"],
			reEvaluateSlotsOnChange: false,
			cost: [],
			matchMode: "first",
			outcomeRules: [],
			effects: [{ type: "triggerEvent", eventId: 500 }],
			conditions: [],
		},
		// 空间移动相关动作
		{
			id: 20,
			name: "进入矿洞",
			description: "移动主角到灵石矿洞",
			slotGenerationRuleIds: [],
			effects: [
				{
					type: "modifyAttribute",
					target: "cardTemplate:0",
					attributeId: 100,
					operation: "set",
					value: "location_card_200",
				},
			],
		},
		{
			id: 21,
			name: "离开矿洞",
			description: "返回世界",
			effects: [
				{ type: "modifyAttribute", target: "cardTemplate:0", attributeId: 100, operation: "set", value: "world" },
			],
		},
		// 子区域移动动作
		{
			id: 30,
			name: "深入矿洞",
			effects: [
				{
					type: "modifyAttribute",
					target: "cardTemplate:200",
					attributeId: "currentSubLocation",
					operation: "set",
					value: "workers_camp",
				},
			],
		},
		{
			id: 31,
			name: "前往矿脉深处",
			effects: [
				{
					type: "modifyAttribute",
					target: "cardTemplate:200",
					attributeId: "currentSubLocation",
					operation: "set",
					value: "vein_deep",
				},
			],
		},
		{
			id: 32,
			name: "返回入口",
			effects: [
				{
					type: "modifyAttribute",
					target: "cardTemplate:200",
					attributeId: "currentSubLocation",
					operation: "set",
					value: "entrance",
				},
			],
		},
		{
			id: 33,
			name: "开采灵石",
			effects: [
				{ type: "produceCard", templateId: 2, location: "player", amount: 3 },
				{
					type: "modifyAttribute",
					target: "world",
					attributeId: "flag_vein_depleted",
					operation: "increase",
					value: 1,
				},
			],
		},
		{
			id: 34,
			name: "返回营地",
			effects: [
				{
					type: "modifyAttribute",
					target: "cardTemplate:200",
					attributeId: "currentSubLocation",
					operation: "set",
					value: "workers_camp",
				},
			],
		},
	],

	// ========================
	// 6. 事件 / 结局定义
	//    支持自动触发、手动触发、周期触发。分支可选系统判定或玩家选择。
	// ========================
	events: [
		{
			id: 200,
			name: "血祭事件",
			description: "残忍行为引起了血神的注意",
			conditions: [],
			triggerType: "manual",
			selectionMode: "player", // 玩家选择
			presentation: "dialog",
			cooldown: 0,
			maxOccurrences: 1,
			outcomes: [
				{
					id: "accept_blood_power",
					text: "接受血神力量",
					conditions: [],
					effects: [
						{ type: "modifyAttribute", target: "player", attributeId: 4, operation: "increase", value: 10 },
						{ type: "produceCard", templateId: 40, location: "player", amount: 1 },
					],
				},
				{
					id: "resist",
					text: "抗拒血神",
					conditions: [],
					effects: [{ type: "modifyAttribute", target: "player", attributeId: 10, operation: "decrease", value: 1 }],
				},
			],
		},
		{
			id: 300,
			name: "李道人的试探",
			description: "根据关系状态做出不同反应",
			conditions: [
				{ logic: "booleanTrue", attributeId: "flag_met_li_daoren", source: "world" },
				{ logic: "numberLessOrEquals", attributeId: "relation_to_template_0", value: -20, source: "cardTemplate:50" },
			],
			triggerType: "auto",
			selectionMode: "auto", // 系统自动选分支
			presentation: "dialog",
			cooldown: 3,
			maxOccurrences: 2,
			outcomes: [
				{
					id: "hostile_act",
					text: "李道人暗中使绊",
					conditions: [
						{
							logic: "numberLessOrEquals",
							attributeId: "relation_to_template_50",
							value: 30,
							source: "cardTemplate:0",
						},
					],
					effects: [
						{ type: "modifyAttribute", target: "cardTemplate:0", attributeId: 5, operation: "decrease", value: 15 },
						{
							type: "modifyAttribute",
							target: "cardTemplate:50",
							attributeId: "relation_to_template_0",
							operation: "decrease",
							value: 10,
						},
						{
							type: "modifyAttribute",
							target: "cardTemplate:0",
							attributeId: "relation_to_template_50",
							operation: "decrease",
							value: 20,
						},
						{ type: "enableEvent", eventId: 301 },
					],
				},
				{
					id: "neutral_observation",
					text: "李道人默默离去",
					conditions: [],
					effects: [
						{
							type: "modifyAttribute",
							target: "world",
							attributeId: "flag_li_observed_you",
							operation: "set",
							value: true,
						},
					],
				},
			],
		},
		{
			id: 301,
			name: "李道人的追杀",
			description: "关系恶化后的致命结局",
			conditions: [],
			triggerType: "manual",
			selectionMode: "player",
			presentation: "dialog",
			cooldown: 0,
			maxOccurrences: 1,
			outcomes: [
				{
					id: "fight_back",
					text: "反击",
					effects: [{ type: "triggerEvent", eventId: 400 }],
				},
				{
					id: "flee",
					text: "逃跑",
					effects: [
						{ type: "modifyAttribute", target: "cardTemplate:0", attributeId: 5, operation: "decrease", value: 10 },
						{ type: "disableEvent", eventId: 301 },
					],
				},
			],
		},
		{
			id: 500,
			name: "采摘草药",
			description: "采光还是留下根茎？",
			conditions: [],
			triggerType: "manual",
			selectionMode: "player",
			presentation: "dialog",
			cooldown: 0,
			maxOccurrences: 1,
			outcomes: [
				{
					id: "take_all",
					text: "全部采光",
					effects: [
						{ type: "produceCard", templateId: 1, location: "player", amount: 3 },
						{ type: "disableEvent", eventId: 500 },
					],
				},
				{
					id: "leave_some",
					text: "只采一半",
					effects: [
						{ type: "produceCard", templateId: 1, location: "player", amount: 1 },
						{
							type: "modifyAttribute",
							target: "world",
							attributeId: "flag_cliff_herb_regen",
							operation: "set",
							value: true,
						},
						{ type: "disableEvent", eventId: 500 },
					],
				},
			],
		},
		{
			id: 600,
			name: "道宫祖师收徒",
			description: "天赋异禀引祖师亲临",
			conditions: [
				{ logic: "numberGreaterOrEquals", attributeId: 12, value: 95, source: "cardTemplate:0" },
				{ logic: "numberGreaterOrEquals", attributeId: "reincarnation_count", value: 3, source: "world" },
			],
			triggerType: "auto",
			selectionMode: "player",
			presentation: "dialog",
			cooldown: 0,
			maxOccurrences: 1,
			outcomes: [
				{
					id: "join_taixuan",
					text: "拜入太玄宗",
					effects: [
						{ type: "modifyAttribute", target: "cardTemplate:0", attributeId: 1, operation: "set", value: "太玄弟子" },
						{ type: "addAction", target: "cardTemplate:0", actionId: 100, label: "太玄心法", showConditions: [] },
						{ type: "disableEvent", eventId: 600 },
					],
				},
				{
					id: "join_jianzong",
					text: "拜入剑宗",
					effects: [
						{ type: "modifyAttribute", target: "cardTemplate:0", attributeId: 1, operation: "set", value: "剑宗弟子" },
						{ type: "addAction", target: "cardTemplate:0", actionId: 101, label: "御剑术", showConditions: [] },
						{ type: "disableEvent", eventId: 600 },
					],
				},
				{
					id: "refuse_all",
					text: "婉拒，独自修行",
					effects: [
						{ type: "modifyAttribute", target: "cardTemplate:0", attributeId: 1, operation: "set", value: "散修" },
						{ type: "disableEvent", eventId: 600 },
					],
				},
			],
		},
		{
			id: 700,
			name: "夕阳下的感悟",
			description: "心有所悟",
			conditions: [{ logic: "booleanTrue", attributeId: "flag_visited_peak", source: "world" }],
			triggerType: "auto",
			selectionMode: "auto",
			presentation: "notification", // 纯文本提示
			cooldown: 0,
			maxOccurrences: 1,
			outcomes: [
				{
					id: "enlightenment",
					text: "你感到心境通明，灵力有所精进。",
					effects: [
						{ type: "modifyAttribute", target: "cardTemplate:0", attributeId: 4, operation: "increase", value: 5 },
					],
				},
			],
		},
		{
			id: 800,
			name: "季节更替",
			description: "每30回合自动切换",
			conditions: [],
			triggerType: "periodic", // 周期触发
			interval: 30, // 每隔30回合
			timing: "onTurnStart", // 回合开始时
			cooldown: 0,
			maxOccurrences: -1, // 无限循环
			selectionMode: "auto",
			outcomes: [
				{
					id: "cycle_season",
					effects: [{ type: "modifyAttribute", target: "world", attributeId: 201, operation: "set", value: "夏" }],
				},
			],
		},
		{
			id: 900,
			name: "矿洞塌方",
			description: "开采过度引发塌方",
			conditions: [
				{ logic: "attributeEquals", attributeId: 100, value: "location_card_200", source: "cardTemplate:0" },
				{ logic: "attributeEquals", attributeId: "currentSubLocation", value: "vein_deep", source: "cardTemplate:200" },
				{ logic: "numberGreaterOrEquals", attributeId: "flag_vein_depleted", value: 5, source: "world" },
			],
			triggerType: "auto",
			selectionMode: "player",
			outcomes: [
				{
					text: "迅速撤离",
					effects: [
						{
							type: "modifyAttribute",
							target: "cardTemplate:200",
							attributeId: "currentSubLocation",
							operation: "set",
							value: "entrance",
						},
						{ type: "modifyAttribute", target: "cardTemplate:0", attributeId: 5, operation: "decrease", value: 20 },
					],
				},
				{
					text: "冒险留在原地",
					effects: [
						{ type: "modifyAttribute", target: "cardTemplate:0", attributeId: 5, operation: "decrease", value: 50 },
						{ type: "produceCard", templateId: 999, location: "player", amount: 1 },
					],
				},
			],
		},
	],

	// ========================
	// 7. 卡牌模板
	//    所有卡牌的原型。包含属性、动作、被动效果、规则动词、
	//    子区域（地点）、NPC自主行为等。
	// ========================
	cardTemplates: [
		{
			id: 0,
			name: "主角",
			description: "玩家化身",
			initialAttributes: {
				0: 200,
				1: "流浪者",
				2: false,
				3: ["神圣"],
				4: 5,
				5: 100,
				10: 2,
				11: false,
				12: 50,
				100: "inventory",
			},
			actions: [
				{ label: "献祭仪式", actionId: 0, showConditions: [] },
				{ label: "炼制魔药", actionId: 1, showConditions: [] },
			],
			passiveEffects: [
				{
					id: "hero_aura",
					description: "在场时友方灵力+3",
					conditions: [{ logic: "attributeEquals", attributeId: 100, value: "battlefield", source: "self" }],
					effects: [
						{
							type: "modifyAttribute",
							target: "allCardsWithTag",
							tag: "友方",
							attributeId: 4,
							operation: "increase",
							value: 3,
						},
					],
				},
			],
			ruleAttributes: [{ rule: "unique", params: {} }],
		},
		{
			id: 1,
			name: "草药",
			description: "常见的施法材料",
			initialAttributes: { 3: ["可食用"], 4: 3 },
			actions: [],
			passiveEffects: [],
			ruleAttributes: [
				{ rule: "stackable", params: { maxStack: 20 } },
				{ rule: "perishable", params: { turnsToLive: 30 } },
			],
		},
		{
			id: 7,
			name: "活物",
			description: "一只兔子",
			initialAttributes: { 3: ["活物"], 4: 8 },
			actions: [],
			passiveEffects: [],
			ruleAttributes: [{ rule: "perishable", params: { turnsToLive: 15 } }],
		},
		{
			id: 10,
			name: "祭刀",
			description: "献祭利刃",
			initialAttributes: { 3: ["工具", "武器"], 4: 0 },
			actions: [],
			passiveEffects: [],
			ruleAttributes: [{ rule: "indestructible", params: {} }],
		},
		{
			id: 12,
			name: "献祭密法",
			description: "古老卷轴",
			initialAttributes: { 11: true },
			actions: [],
			passiveEffects: [],
			ruleAttributes: [{ rule: "unique", params: {} }],
		},
		{
			id: 20,
			name: "治愈之光",
			description: "温暖的恢复之光",
			initialAttributes: { 3: ["消耗品"], 4: 0 },
			actions: [{ label: "使用", actionId: 2, showConditions: [] }],
			passiveEffects: [],
			ruleAttributes: [{ rule: "consumable", params: {} }],
		},
		{
			id: 30,
			name: "普通魔药",
			description: "散发着微光",
			initialAttributes: { 3: ["消耗品", "魔药"], 4: 10 },
			actions: [{ label: "喝下", actionId: 2, showConditions: [] }],
			passiveEffects: [],
			ruleAttributes: [{ rule: "consumable", params: {} }],
		},
		{
			id: 50,
			name: "李道人",
			description: "游历四方的道人",
			initialAttributes: {
				1: "散修",
				4: 30,
				5: 80,
				relation_to_template_0: -10,
			},
			actions: [],
			passiveEffects: [],
			ruleAttributes: [{ rule: "unique", params: {} }],
			// NPC 自主行为规则
			autonomousRules: [
				{
					id: "meditate_cave",
					description: "在矿洞深处修炼",
					timing: "onTurnStart",
					interval: 3,
					conditions: [
						{ logic: "attributeEquals", attributeId: 100, value: "location_card_200", source: "self" },
						{
							logic: "attributeEquals",
							attributeId: "currentSubLocation",
							value: "vein_deep",
							source: "cardTemplate:200",
						},
					],
					effects: [{ type: "modifyAttribute", target: "self", attributeId: 4, operation: "increase", value: 2 }],
				},
				{
					id: "gather_herb",
					description: "在入口采集草药",
					timing: "onTurnEnd",
					interval: 10,
					conditions: [
						{ logic: "attributeEquals", attributeId: 100, value: "location_card_200", source: "self" },
						{
							logic: "attributeEquals",
							attributeId: "currentSubLocation",
							value: "entrance",
							source: "cardTemplate:200",
						},
					],
					effects: [{ type: "produceCard", templateId: 1, location: "player", amount: 1 }],
				},
			],
		},
		{
			id: 100,
			name: "精钢长剑",
			description: "可镶嵌宝石的武器",
			initialAttributes: { 3: ["武器", "装备"], 4: 15 },
			actions: [],
			passiveEffects: [],
			ruleAttributes: [
				{
					rule: "socketable",
					params: {
						slots: [
							{
								id: "weapon_gem",
								label: "镶嵌宝石",
								acceptedTemplateIds: [{ templateId: 200, conditions: [] }],
								minCards: 0,
								maxCards: 1,
							},
						],
					},
				},
			],
		},
		{
			id: 200,
			name: "灵石矿洞",
			description: "灵气浓郁的矿洞",
			initialAttributes: {
				1: "地点",
				4: 20,
				currentSubLocation: "entrance",
				flag_is_dangerous: false,
				vein_richness: 10,
			},
			// 子区域定义
			subLocations: [
				{
					id: "entrance",
					name: "矿洞入口",
					description: "光线昏暗的入口。",
					initial: true,
					actions: [{ label: "深入矿洞", actionId: 30, showConditions: [] }],
				},
				{
					id: "workers_camp",
					name: "工人据点",
					description: "矿工的营地。",
					actions: [
						{ label: "前往矿脉深处", actionId: 31, showConditions: [] },
						{ label: "返回入口", actionId: 32, showConditions: [] },
					],
				},
				{
					id: "vein_deep",
					name: "矿脉源头",
					description: "巨大的灵石矿脉。",
					actions: [
						{
							label: "开采灵石",
							actionId: 33,
							showConditions: [
								{ logic: "numberGreaterOrEquals", attributeId: "vein_richness", value: 1, source: "cardTemplate:200" },
							],
						},
						{ label: "返回营地", actionId: 34, showConditions: [] },
					],
				},
			],
			actions: [
				{ label: "进入矿洞", actionId: 20, showConditions: [] },
				{ label: "离开矿洞", actionId: 21, showConditions: [] },
			],
			passiveEffects: [
				{
					id: "entrance_rest",
					description: "入口恢复生命",
					conditions: [
						{ logic: "attributeEquals", attributeId: 100, value: "location_card_200", source: "cardTemplate:0" },
						{
							logic: "attributeEquals",
							attributeId: "currentSubLocation",
							value: "entrance",
							source: "cardTemplate:200",
						},
						{ logic: "booleanFalse", attributeId: "flag_entrance_collapsed", source: "cardTemplate:200" },
					],
					effects: [
						{ type: "modifyAttribute", target: "cardTemplate:0", attributeId: 5, operation: "increase", value: 1 },
					],
				},
				{
					id: "vein_boost",
					description: "矿脉深处修炼效率翻倍",
					conditions: [
						{ logic: "attributeEquals", attributeId: 100, value: "location_card_200", source: "cardTemplate:0" },
						{
							logic: "attributeEquals",
							attributeId: "currentSubLocation",
							value: "vein_deep",
							source: "cardTemplate:200",
						},
					],
					effects: [
						{ type: "modifyAttribute", target: "cardTemplate:0", attributeId: 4, operation: "multiply", value: 2.0 },
					],
				},
			],
			ruleAttributes: [
				{ rule: "unique", params: {} },
				{ rule: "indestructible", params: {} },
			],
		},
	],

	// ========================
	// 8. 存档结构（运行时数据示例）
	// ========================
	saveData: {
		cards: [
			{
				instanceId: "card_001",
				templateId: 0,
				currentAttributes: {
					0: 200,
					1: "流浪者",
					2: false,
					3: ["神圣"],
					4: 5,
					5: 100,
					10: 2,
					11: false,
					12: 50,
					100: "inventory",
					relation_to_template_50: 0,
				},
				currentActions: [
					{ label: "献祭仪式", actionId: 0, showConditions: [] },
					{ label: "炼制魔药", actionId: 1, showConditions: [] },
				],
				currentPassiveEffects: [],
				currentRuleAttributes: [{ rule: "unique", params: {} }],
				location: "player",
			},
			{
				instanceId: "card_050",
				templateId: 50,
				currentAttributes: {
					1: "散修",
					4: 30,
					5: 80,
					relation_to_template_0: -10,
					100: "world",
				},
				currentActions: [],
				currentPassiveEffects: [],
				currentRuleAttributes: [{ rule: "unique", params: {} }],
				location: "world",
			},
		],
		worldAttributes: {
			200: "晴天",
			201: "春",
			flag_met_li_daoren: true,
			flag_cliff_herb_regen: false,
			reincarnation_count: 3,
			flag_vein_depleted: 0,
			count_in_mine: 0,
		},
	},

	// ========================
	// 9. 效果类型说明（非运行时数据，仅供理解）
	// ========================
	effectTypesDoc: {
		modifyAttribute: {
			type: "modifyAttribute",
			target: "player | cardTemplate:<id> | cardInstance:<instanceId> | allCardsWithTag | slot:<slotId> | self",
			attributeId: 0, // 属性ID或名称字符串
			operation: "increase | decrease | set | multiply",
			value: 0,
		},
		produceCard: {
			type: "produceCard",
			templateId: 0,
			location: "player | world",
			amount: 1,
		},
		consumeCard: {
			type: "consumeCard",
			target: "cardInstance:<id> | slot:<slotId>",
			amount: "all | number",
		},
		triggerEvent: {
			type: "triggerEvent",
			eventId: 0,
		},
		enableEvent: {
			type: "enableEvent",
			eventId: 0,
			condition: {}, // 可选：仅满足时才启用
		},
		disableEvent: {
			type: "disableEvent",
			eventId: 0,
		},
		addAction: {
			type: "addAction",
			target: "cardTemplate:<id> | cardInstance:<instanceId>",
			actionId: 0,
			label: "按钮文字",
			showConditions: [],
		},
		removeAction: {
			type: "removeAction",
			target: "cardTemplate:<id> | cardInstance:<instanceId>",
			actionId: 0,
		},
		delay: {
			type: "delay",
			delay: 3, // 延迟回合数
			effects: [], // 延迟结束后执行的效果
		},
	},
};
