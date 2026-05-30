/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoUrl from './logo.png';
import { 
  Users, 
  Info, 
  MessageSquare, 
  PlayCircle, 
  ShieldCheck, 
  BarChart3, 
  ChevronDown,
  Menu,
  X,
  Send,
  Heart,
  Zap,
  BookOpen,
  Quote,
  Lock,
  LogOut,
  Trash2
} from 'lucide-react';
import fieldImg from './field.JPG';
import field2Img from './field2.png';
import humanImg from './human.png';
import { submitFeedback, submitSurvey, auth, signIn, subscribeToFeedbacks, subscribeToSurveys } from './services/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

// --- Bilingual Translations ---
const T = {
  en: {
    navbarBrand: 'Co-exist Pitch',
    studentInitiative: 'A Student-Led Initiative',
    heroHeading: 'A Pitch for Everyone',
    heroTagline: 'Every goal deserves to be celebrated.\nWe are committed to creating a mixed-gender pitch without "performance pressure".',
    exploreMovement: 'Explore the movement',
    motivation: 'The Motivation',
    whyHeading: 'Why "Co-exist Pitch"?',
    whyPara1: 'On our school soccer pitch, there is a clear gender imbalance in resource utilization. Observations, independently confirmed by ten of my fellow students, show that while the center is dominated by high-intensity male matches, female students are often relegated to the sidelines.',
    whyPara2: 'This is not just about space; it is about social comfort. Many girls feel shy or self-conscious about accidental physical contact and the "performance pressure" of playing with experienced boys.',
    whyQuote: 'This issue limits girls\' opportunities to stay active and reinforces the stereotype that competitive sports are a male domain.',
    communityReport: 'Community Report',
    witnesses: '10+ Witnesses',
    ourMission: 'Our Mission',
    missionQuote: '"Every goal deserves to be celebrated. We are committed to creating a mixed-gender pitch without \'performance pressure\', allowing everyone to find the joy of sports here."',
    keyMeasures: 'Key Measures',
    solutionTitle: 'Our Solution for a Better Pitch.',
    noContactPlay: '"No-Contact" Play',
    noContactDesc: 'By removing high-intensity physical contact, we shift the focus to technical skill and spacing. This eliminates the intimidation factor for students of all genders and sizes.',
    confidenceFirst: 'Confidence First',
    confidenceDesc: 'We\'ve established a "Beginner\'s Corner" to provide confidence tips, ensuring that the pitch is a place for learning, not just for elite performance.',
    tip1: 'Focus on the flow, not the score.',
    tip2: 'Lower intensity means more space.',
    equitableAccess: 'Equitable Access',
    equitableDesc: 'Our goal is to rebalance the 80/20 occupancy ratio. By creating a regulated mixed-gender space, we ensure every student gets a fair turn at the center.',
    currentParticipation: 'Current Participation',
    femaleLabel: 'Female (20%)',
    maleLabel: 'Male (80%)',
    respectQuote: '"Respecting the \'No-Contact\' rule has actually made me a better technical player."',
    equityCampaign: 'EQUITY CAMPAIGN',
    surveyTitle: 'School Soccer Pitch Inclusivity Survey',
    surveyDesc: 'Help us bridge the gender gap and create a warm, welcoming sport environment for everyone. Share your opinions and suggestions anonymously.',
    takeSurveyBtn: 'Take Survey Form',
    hideSurveyBtn: 'Hide Survey Form',
    surveySuccessTitle: 'Survey Submitted Successfully!',
    surveySuccessDesc: 'Thank you! Your response is 100% anonymous and has been saved to the database. We appreciate your valuable voice.',
    submitAnotherBtn: 'Submit Another Feedback',
    qGender: 'Gender',
    qGrade: 'Grade',
    qFrequency: 'How often do you play sports on the school soccer pitch?',
    qTimeSlots: 'During which time slots do you usually use the pitch? (Select all)',
    qNeutral: '"Our school soccer pitch is a welcoming and gender-neutral environment."',
    qBarriers: 'What is the main barrier preventing you from playing after school? (Select all)',
    qSuggestions: 'Do you have any suggestions to make the pitch more inclusive?',
    optMale: 'Male',
    optFemale: 'Female',
    optOther: 'Prefer not to say',
    optG10: 'Grade 10',
    optG11: 'Grade 11',
    optG12: 'Grade 12',
    optDaily: 'Daily',
    optFewTimes: '2-3 times a week',
    optRarely: 'Rarely',
    optNever: 'Never',
    slotLunch: 'Lunch break',
    slotAfter: 'After-school hours',
    slotPe: 'PE classes',
    slotNever: 'Never use the pitch',
    barrierInterest: 'Lack of interest',
    barrierDominated: 'Pitch dominated by male groups',
    barrierJudged: 'Feeling judged / self-conscious',
    barrierCoed: 'Lack of co-ed activities',
    surveyNote: 'Note: Names are never collected. Your response is 100% anonymous & secure.',
    submitSurveyBtn: 'Submit Survey',
    placeholderSuggestions: 'What changes would spark bigger steps for you? Share here anonymously...',
    indicatorImpact: 'Impact & Observations',
    communityInsights: 'Our Community Insights',
    insightsDesc: 'Empirical data collected from our school pitch and preliminary peer feedback.',
    realityCheck: 'The Reality Check',
    fieldGap: 'Field Participation Gender Gap',
    lunchBreakPart: 'Lunch Break Participation',
    afterSchoolPart: 'After-School Participation',
    lunchAvg: 'Average 2 Females out of 7 Total Players',
    afterAvg: 'Average 1 Female out of 10 Total Players',
    conclusionLabel: 'Conclusion:',
    conclusionText: 'As competitiveness and group density intensify after school, the implicit psychological exclusion barrier for female students sharply increases.',
    samplingWeekly: 'Week of Active Field Sampling',
    storiesPublished: 'Real Peer Stories Published',
    privacyFeedback: 'Anonymous Feedback Privacy',
    actionPlanTitle: 'Pitch Equity Action Plan',
    actionPlanSub: 'Our Next Actionable Steps',
    actionMixedTitle: 'Mixed-Gender Hours:',
    actionMixedDesc: 'Introducing structured weekly co-ed matches to reduce high-competitive intimidation.',
    actionBookingTitle: 'Transparent Booking Slots:',
    actionBookingDesc: 'Moving away from "first-come, first-dominated" to fair scheduling allocations.',
    actionAllyTitle: 'Active Ally Playbook:',
    actionAllyDesc: 'Training student leaders to vocalize inclusion rules and welcome newcomers onto the pitch.',
    ratioGoal: 'Goal: 40% Female Pitch Ratio',
    deadline: 'By Next Term',
    communityHub: 'Community Hub',
    storiesTitle: 'Stories & Tips',
    hubLead: '"It\'s not just about soccer, it\'s about stories. Bravely taking the first step is cooler than scoring a goal."',
    beginnerCorner: 'Beginner\'s Corner',
    beginnerTitle: 'Football Beginners: Confidence Tips',
    beginnerDesc: '"You don\'t need to be a pro, you just need a desire to run. Let rules no longer be an obstacle."',
    begTip1: 'Don\'t worry about the score; focus on the flow of the game.',
    begTip2: 'Low-intensity means fewer accidents and more space to learn.',
    studentCount: '5+ more student stories',
    readFullBtn: 'Read full interviews',
    aboutTitle: 'About the Project',
    teamCredits: 'The Team Credits',
    roleJoshua: 'Build & Navigation',
    roleJack: 'Content Specialist',
    roleKye: 'UI Copywriting',
    roleOliver: 'Design & Logo',
    adminAccess: 'Admin Access',
    logout: 'Logout',
    ownerLogin: 'Owner Login',
    googleLogin: 'Login with Google to view anonymous survey submissions & metrics.',
    backToHub: 'Back to Hub',
    studentVoices: 'Student Voices',
    voicesTitle: 'Student Stories',
    voicesSubtitle: 'Voices from the pitch — hearing from those who are helping redefine our sports culture.',
    returnHome: 'Return Home',
    stronglyDisagree: 'Strongly Disagree',
    stronglyAgree: 'Strongly Agree',
    metrics: 'Campaign Metrics',
    totalReplies: 'Total Replies',
    avgInclusivity: 'Avg Inclusivity',
    genderDist: 'Gender Distribution',
    rawSubmissions: 'Raw Survey Submissions',
    noResponses: 'No survey responses yet.',
    alertRequired: 'Please fill in all required fields (Gender, Grade, Frequency, and Inclusivity rating).',
    alertSuccess: 'Thank you for your feedback!',
    alertFailure: 'Submission failed. Make sure Firebase is set up.',
    liveFeed: 'Live Student Voices',
    equityIndexLabel: 'Pitch Equity Index (Calculated from survey)',
    totalVoicesLabel: 'Total Voices Anonymously Captured',
    lunchVsAfternoonLabel: 'Lunch vs After-School Female Ratio',
  },
  zh: {
    navbarBrand: '共存球场',
    studentInitiative: '学生发起的自主倡议项目',
    heroHeading: '包容每个人的球场',
    heroTagline: '每一粒进球，都值得被大声庆祝。\n我们致力于打造一个低阻碍的男女混合共存球场，消除“竞技表现压力”。',
    exploreMovement: '加入共存行动',
    motivation: '行动初衷',
    whyHeading: '为什么发起“共存球场”？',
    whyPara1: '在我们学校的足球场上，运动场地资源的使用存在着明显的性别失衡。由10多名男女同学独立记录的实地观察报告指出：虽然球场中圈常年被超高强度的男子足球对抗赛霸占，但女同学们往往被挡在了边界线外，沦为场边观望者。',
    whyPara2: '这不仅仅事关场地划分，更是建立温暖社交氛围的必然选择。很多女生对过于激烈的肢体碰撞、或与精通控球的男生一起比赛存有天然的拘谨与心理障碍。',
    whyQuote: '这一空间和心理上的排斥不仅无形中剥夺了女生参与高品质日常运动的均等机会，也固化了“竞技体育由男生独霸”的陈旧成见。',
    communityReport: '社区观察报告',
    witnesses: '10+ 位同伴合力见证',
    ourMission: '我们的使命',
    missionQuote: '“每一粒进球都值得被喝彩。我们真诚地致力于打造一个面向全体男女孩的平等绿茵场地，消除非理性的竞技对抗，让每个人都能在这里尽情享受运动与健康的原初脉搏。”',
    keyMeasures: '核心规则举措',
    solutionTitle: '共存球场，我们的解决方案。',
    noContactPlay: '“非接触式”轻量比赛',
    noContactDesc: '通过严格避免高强度的避震身体对抗甚至冲撞，我们将足球重新定义为技术传学与跑位配合。这从根本上打消了男女选手等不同体型群体的心理焦虑。',
    confidenceFirst: '信心至上（新手专属）',
    confidenceDesc: '我们特别开辟了“新手专属角”和技巧训练包，确保学校操场不再是少部分“精英选手的专场”，而是鼓励大家共同成长的全民绿茵基地。',
    tip1: '享受控球和流转的乐趣，而非焦虑输赢。',
    tip2: '较小对抗性意味着更安全的避震和无限的学习信心。',
    equitableAccess: '场地分配平权',
    equitableDesc: '我们的长远目标是终结历史上 80/20 的男女空间垄断。通过推行科学公平、温和有序的多方合作模式，将球场的核心舞台交还给全体同学。',
    currentParticipation: '当前校内球场日常男女占比情况',
    femaleLabel: '女生日常仅占 (20%)',
    maleLabel: '男生主导霸占 (80%)',
    respectQuote: '“严格恪守无肢体碰撞的足球规则，非但没有降低竞技感，反而大大锤炼了我们的精准脚法和团队配合意识。”',
    equityCampaign: '绿茵包容平权行动',
    surveyTitle: '学校足球场包容度问卷调查',
    surveyDesc: '协助我们消除校内体育的隐性鸿沟，为男女同学营造更有感、更平等的健康共荣氛围。期待听到您的 100% 匿名反馈与建言。',
    takeSurveyBtn: '填写包容度问卷',
    hideSurveyBtn: '收起并隐藏问卷',
    surveySuccessTitle: '问卷已经提交成功！',
    surveySuccessDesc: '万分感谢您的支持！您的反馈信息为极致 100% 独立匿名，并已被妥善收集。每一份直白的心声对我们制定后续平权举措都至关重要。',
    submitAnotherBtn: '再次提交反馈',
    qGender: '您的性别',
    qGrade: '所在年级',
    qFrequency: '你平时在学校绿茵场地开展足球/体育活动的频率？',
    qTimeSlots: '在以下哪些日常或课余时段，你会选择玩足球或到操场活动？（可多选）',
    qNeutral: '“我发自内心地感到我们学校的足球场是一个充满包容性且性别中立、平等的运动场所。”',
    qBarriers: '你感觉阻碍你在放学等黄金时段前往足球场活动的最大主观/客观瓶颈是什么？（可多选）',
    qSuggestions: '您对操场的良性多元化发展，有任何充满创设性的好建议或悄悄话吗？',
    optMale: '男同学',
    optFemale: '女同学',
    optOther: '选项保密',
    optG10: '高一 (十年级)',
    optG11: '高二 (十一年级)',
    optG12: '高三 (十二年级)',
    optDaily: '几乎每天都运动',
    optFewTimes: '每周两到三次',
    optRarely: '极少涉足',
    optNever: '根本没有过',
    slotLunch: '午休空闲档期',
    slotAfter: '放学后及课外活动时间',
    slotPe: '主课体育课上',
    slotNever: '几乎从不进入球场玩',
    barrierInterest: '课外时间对足球没足够兴趣',
    barrierDominated: '场地被高强度的男生阵营霸占，无可适从',
    barrierJudged: '在场上害怕犯错或被旁人品头论足、感到难为情',
    barrierCoed: '学校缺少有组织的男女共荣性趣味赛',
    surveyNote: '安全提示：问卷不留任何身份特征、名字或微信号，您的所有作答受到保密处理。',
    submitSurveyBtn: '确认无误，提交问卷',
    placeholderSuggestions: '在这里写下任何能够打动您、让您更乐见其成的调整……例如设置特定男女生混合时段，亦或是引入轻量教练指导等。',
    indicatorImpact: '数据实地测定',
    communityInsights: '我们的校园实地调研',
    insightsDesc: '我们在校内足球场实地观察、取样统计以及向数十位同班及外班同窗求证获得的统计结果。',
    realityCheck: '校园事实核查',
    fieldGap: '绿茵场实际男女参与率的巨大阶梯',
    lunchBreakPart: '午休黄金时段参与比率',
    afterSchoolPart: '课余放学高强度档参与比率',
    lunchAvg: '估测：每平均 7 位踏入场内活动的队员中，女同学仅有约 2 名',
    afterAvg: '估测：每平均 10 位踏入场内活动的队员中，女同学仅有约 1 名',
    conclusionLabel: '事实性结论：',
    conclusionText: '随着放学后绿茵比赛的竞技激烈程度和身体冲撞烈度呈指数攀升，女生由于自我安全警觉防线而不敢踏入该区域的屏障变得空前之大。',
    samplingWeekly: '持续一周的高频定点采样观察',
    storiesPublished: '收录并展呈的校友现场访谈记录',
    privacyFeedback: '100% 独立、无记名加密保护',
    actionPlanTitle: '操场平权公平行动纲领',
    actionPlanSub: '我们正付诸实践的积极改善步骤',
    actionMixedTitle: '1. 混合性别趣味日：',
    actionMixedDesc: '开设具有社演属性的男女趣味混合 soft matches 比赛，以此打消由于传统激战对新手群体产生的刻板恐惧。',
    actionBookingTitle: '2. 更具包容性的弹性时段：',
    actionBookingDesc: '破除“霸区文化”，与体育工作组协定，按周开辟透明平等的共享机制，使有基础练习诉求的人群获得预留席位。',
    actionAllyTitle: '3. 培育校园‘平权盟友’：',
    actionAllyDesc: '在校足球队、活跃男生中发起“盟友行动”，引导其扮演和乐欢迎者、教练助手的包容角色，多一声传球鼓励。',
    ratioGoal: '预期目标：实现女性常态化参与提至 40%',
    deadline: '于下学期末达成',
    communityHub: '故事与经验分享',
    storiesTitle: '同伴心声 & 新手分享',
    hubLead: '“这不仅是战术演练，更是一连串感同感知的心理成长。在场上试着接一记传球，其力量绝对不输于一脚远射。”',
    beginnerCorner: '新手避难所 / 行动指南',
    beginnerTitle: '致运动初学者：重建自信的技巧',
    beginnerDesc: '“你不必成为所谓的‘职业大咖’，只需要拥有一颗想感受奔跑自由的心。绿茵场绝非少数精英学生的特权。”',
    begTip1: '彻底忘却记分牌上的攀比，全神贯注于技术动作在空间的灵动衔接。',
    begTip2: '较低的冲撞环境可以大幅杜绝伤痛意外，让学踢球的初始过程极其友爱。',
    studentCount: '多篇真实的初学者和边缘群体的内心独白',
    readFullBtn: '进入访谈大厅阅读全部记录',
    aboutTitle: '关于“共存球场”计划',
    teamCredits: '特此感谢联合创发起人',
    roleJoshua: '程序架构设计与动态导航',
    roleJack: '校园素材提炼与校园深度求证',
    roleKye: '外联事务与文案公关撰写',
    roleOliver: 'LOGO 与品牌视觉传达策划',
    adminAccess: '校内管理员审核看板',
    logout: '注销管理权限',
    ownerLogin: '项目拥有者登录验证',
    googleLogin: '请通过授权验证 Google 账号安全登录，以审查保密的实时提交明细与实况统计系数。',
    backToHub: '返回故事大厅',
    studentVoices: '同窗见证',
    voicesTitle: '校园声音 & 故事大厅',
    voicesSubtitle: '足球不仅是汗水交织，更是温暖的相助。倾听那些通过新场规重拾绿茵信心的女同学们与新手的坦诚独白。',
    returnHome: '返回主版块',
    stronglyDisagree: '极不赞同',
    stronglyAgree: '完全支持',
    metrics: '反馈测力仪指标统计',
    totalReplies: '回收问卷总数',
    avgInclusivity: '综合包容平等分',
    genderDist: '性别样本比例构成',
    rawSubmissions: '后台无记名答卷明细',
    noResponses: '当前尚无有效的无记名答卷上传。',
    alertRequired: '请完整填写必选项（您的性别、年级、运动频次及包容度评分）以提交。',
    alertSuccess: '真心感谢！您的宝贵问卷已安全传输至匿名数据库！',
    alertFailure: '抱歉，传输遭遇了阻碍。请验证 Firebase 配置是否已顺畅部署。',
    liveFeed: '实时同窗反馈',
    equityIndexLabel: '绿茵公平指数 (基于实地数据计算)',
    totalVoicesLabel: '匿名收集的同辈真实心声',
    lunchVsAfternoonLabel: '午休对比放学后的女性上场比率',
  }
};

const interviewsEn = [
  {
    name: "Ricky Xu",
    role: "Year 10 Student",
    quote: "I used to stay on the sidelines because I felt I wasn't 'good enough'. This pitch changed that vibe."
  },
  {
    name: "Oscar R.",
    role: "Year 10 Student",
    quote: "The 'performance pressure' is real. Having a space where it's okay to just 'be a beginner' is so refreshing and inclusive."
  },
  {
    name: "Oliver C.",
    role: "Year 10 Student",
    quote: "I love soccer, but sometimes high-intensity matches feel more like a battle. Co-exist Pitch lets us focus on the joy of the game."
  },
  {
    name: "Joshua Z.",
    role: "Year 10 Student",
    quote: "Respecting the 'No-Contact' rule has actually made me a better technical player. It's about skill, not just strength."
  },
  {
    name: "Leo R.",
    role: "Year 10 Student",
    quote: "It's about belonging. I don't have to apologize for missing a pass here. We're all here to learn and co-exist."
  },
  {
    name: "Kevin G.",
    role: "Year 10 Student",
    quote: "Changing the culture of the pitch starts with small rules. 'No-contact' opens the game up to so many more people."
  }
];

const interviewsZh = [
  {
    name: "Ricky Xu",
    role: "高一 (十年级) 学生",
    quote: "以前我总是习惯站在场边看人家踢，因为心里会觉得自己‘技术不够好、动作笨拙’。这个低对抗共存球场彻底重塑了这里的气氛，让我也能加入尽情体验奔跑了！"
  },
  {
    name: "Oscar R.",
    role: "高一 (十年级) 学生",
    quote: "‘竞技表现压力’对我们每个人都是巨大且显而易见的。能在操场上拥有一处可以被体面包容的、对‘新手小白’零歧视的区域，对大家来说真的非常贴心温暖！"
  },
  {
    name: "Oliver C.",
    role: "高一 (十年级) 学生",
    quote: "我发自内心地热爱足球运动，但有时火药味浓烈的高强度冲撞会让欢声笑语变得像厮杀。共存球场计划让我们把目光重新倾注回了运动最天然单纯的快乐中。"
  },
  {
    name: "Joshua Z.",
    role: "高一 (十年级) 学生",
    quote: "在场上践行并严苛地遵守‘不允许产生危险身体撞击’的新规则，反而极大地发掘和磨砺了我的过人与配合技巧。这让技术成为了主轴，而非野蛮冲顶。"
  },
  {
    name: "Leo R.",
    role: "高一 (十年级) 学生",
    quote: "这是一种前所未有的纯粹归属感。在这里，当我传歪、甚至脚底拌蒜错失大单刀时，我心里完全不用慌慌张张、充满自责地跟所有伙伴低头致歉，因为大家都知道这是一场快乐旅程。"
  },
  {
    name: "Kevin G.",
    role: "高一 (十年级) 学生",
    quote: "扭转甚至解构以往少部分人强硬主导绿茵场的傲慢氛围，就得从一两条赛场规矩发起蜕变。‘无身体恶意接触’的倡导，让这项球类运动向不计其数原先自危的普通男女同辈敞开了怀抱。"
  }
];

// --- Logo Component ---
const Logo = ({ className = "" }: { className?: string }) => (
  <img 
    src={logoUrl} 
    alt="The Co-exist Pitch Logo" 
    className={`${className} object-contain`}
  />
);

const Navbar = ({ 
  activeSection, 
  setActiveSection, 
  lang, 
  setLang 
}: { 
  activeSection: string, 
  setActiveSection: (s: string) => void,
  lang: 'en' | 'zh',
  setLang: (l: 'en' | 'zh') => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navText = {
    en: {
      home: 'Home',
      why: 'Why',
      mission: 'Mission',
      solutions: 'Solutions',
      insights: 'Insights',
      hub: 'Hub',
      feedback: 'Feedback',
      about: 'About',
      brand: 'Co-exist Pitch'
    },
    zh: {
      home: '首页',
      why: '初衷',
      mission: '使命',
      solutions: '解决方案',
      insights: '数据分析',
      hub: '同伴心声',
      feedback: '问卷调查',
      about: '关于',
      brand: '共存球场'
    }
  };

  const navItems = [
    { id: 'home', label: navText[lang].home },
    { id: 'why', label: navText[lang].why },
    { id: 'mission', label: navText[lang].mission },
    { id: 'solutions', label: navText[lang].solutions },
    { id: 'insights', label: navText[lang].insights },
    { id: 'hub', label: navText[lang].hub },
    { id: 'feedback', label: navText[lang].feedback },
    { id: 'about', label: navText[lang].about }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveSection('home')}>
          <Logo className="w-12 h-12" />
          <span className="font-bold text-xl tracking-tight text-emerald-900 hidden sm:inline">{navText[lang].brand}</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`text-sm font-semibold transition-all ${
                activeSection === item.id ? 'text-emerald-600 font-extrabold' : 'text-zinc-500 hover:text-emerald-600 hover:scale-[1.02]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Language Toggle and Hamburg Menu */}
        <div className="flex items-center gap-4">
          <div className="flex bg-zinc-100/80 rounded-full p-0.5 border border-zinc-200/50 shadow-inner">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1 text-[10px] font-black rounded-full transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-emerald-650 text-white shadow-xs'
                  : 'text-zinc-550 hover:text-zinc-850'
              }`}
              style={lang === 'en' ? { backgroundColor: '#1b4332' } : {}}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('zh')}
              className={`px-3 py-1 text-[10px] font-black rounded-full transition-all cursor-pointer ${
                lang === 'zh'
                  ? 'bg-emerald-650 text-white shadow-xs'
                  : 'text-zinc-550 hover:text-zinc-850'
              }`}
              style={lang === 'zh' ? { backgroundColor: '#1b4332' } : {}}
            >
              中文
            </button>
          </div>

          <button className="lg:hidden p-2 text-zinc-500 hover:text-zinc-800" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-b border-zinc-200 overflow-hidden shadow-lg"
          >
            <div className="flex flex-col p-6 gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsOpen(false);
                  }}
                  className={`text-left text-lg font-medium transition-colors ${
                    activeSection === item.id ? 'text-emerald-600 font-extrabold animate-pulse' : 'text-zinc-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionContainer = ({ id, children, className = "" }: { id: string, children: React.ReactNode, className?: string }) => (
  <section id={id} className={`py-24 px-6 ${className}`}>
    <div className="max-w-5xl mx-auto">
      {children}
    </div>
  </section>
);

export default function App() {
  const [lang, setLang] = useState<'en' | 'zh'>(() => {
    return (localStorage.getItem('coexist-lang') as 'en' | 'zh') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('coexist-lang', lang);
  }, [lang]);

  const [activeSection, setActiveSection] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);

  const [currentTickerIdx, setCurrentTickerIdx] = useState(0);

  const tickerVoicesEn = interviewsEn.map(
    (item) => `${item.role}: "${item.quote}"`
  );

  const tickerVoicesZh = interviewsZh.map(
    (item) => `${item.role}：“${item.quote}”`
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTickerIdx((prev) => (prev + 1) % interviewsEn.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Survey Form States
  const [gender, setGender] = useState('');
  const [grade, setGrade] = useState('');
  const [playFrequency, setPlayFrequency] = useState('');
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [neutralRating, setNeutralRating] = useState<number | null>(null);
  const [barriers, setBarriers] = useState<string[]>([]);
  const [additionalFeedback, setAdditionalFeedback] = useState('');

  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await signIn();
    } catch (error: any) {
      console.error(error);
      setAuthError(error.message || 'Failed to sign in');
    }
  };

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubFeedbacks = subscribeToFeedbacks((data) => {
        setFeedbacks(data);
      });
      const unsubSurveys = subscribeToSurveys((data) => {
        setSurveys(data);
      });
      return () => {
        unsubFeedbacks();
        unsubSurveys();
      };
    }
  }, [user]);

  const handleToggleTimeSlot = (slot: string) => {
    if (timeSlots.includes(slot)) {
      setTimeSlots(timeSlots.filter(s => s !== slot));
    } else {
      setTimeSlots([...timeSlots, slot]);
    }
  };

  const handleToggleBarrier = (barrier: string) => {
    if (barriers.includes(barrier)) {
      setBarriers(barriers.filter(b => b !== barrier));
    } else {
      setBarriers([...barriers, barrier]);
    }
  };

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gender || !grade || !playFrequency || neutralRating === null) {
      alert(T[lang].alertRequired);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitSurvey({
        gender,
        grade,
        playFrequency,
        timeSlots,
        neutralRating,
        barriers,
        additionalFeedback
      });
      
      alert(T[lang].alertSuccess);
      
      setFeedbackSuccess(true);
      
      // Reset Form State
      setGender('');
      setGrade('');
      setPlayFrequency('');
      setTimeSlots([]);
      setNeutralRating(null);
      setBarriers([]);
      setAdditionalFeedback('');
      setTimeout(() => setFeedbackSuccess(false), 5000);
    } catch (error) {
      console.error(error);
      alert(T[lang].alertFailure);
    } finally {
      setIsSubmitting(false);
    }
  };

  const interviews = lang === 'en' ? interviewsEn : interviewsZh;

  // Scroll to section when activeSection changes (if triggered by nav)
  useEffect(() => {
    if (activeSection !== 'interviews') {
      const el = document.getElementById(activeSection);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSection]);

  if (activeSection === 'interviews') {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden pt-16">
        <Navbar activeSection="hub" setActiveSection={setActiveSection} lang={lang} setLang={setLang} />
        
        <SectionContainer id="interviews-gallery" className="min-h-screen">
          <div className="mb-16">
            <button 
              onClick={() => setActiveSection('hub')}
              className="group flex items-center gap-2 text-zinc-400 hover:text-emerald-600 transition-colors mb-8 text-sm font-semibold cursor-pointer"
            >
              <Zap className="w-4 h-4 rotate-180" /> {T[lang].backToHub}
            </button>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">{T[lang].voicesTitle}</h1>
            <p className="text-xl text-zinc-500 max-w-2xl">{T[lang].voicesSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {interviews.map((item, idx) => (
              <motion.div 
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 bg-white border border-emerald-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-500"
              >
                <Quote className="w-10 h-10 text-emerald-400 mb-6" />
                <p className="text-xl text-zinc-800 mb-10 font-medium leading-relaxed italic">"{item.quote}"</p>
                <div className="flex items-center gap-4">
                   <img 
                    src={humanImg} 
                    alt="Avatar"
                    className="w-12 h-12 rounded-full flex-none object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="font-bold text-lg text-zinc-900">{item.name}</p>
                    <p className="text-sm text-zinc-400">{item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionContainer>

        {/* Footer for Interview Page */}
        <div className="bg-zinc-900 py-24 px-6 text-white rounded-t-[4rem]">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Logo className="w-12 h-12" />
              <span className="font-bold tracking-tight text-lg uppercase">{T[lang].navbarBrand}</span>
            </div>
            <button 
              onClick={() => setActiveSection('home')}
              className="px-8 py-3 bg-[#1b4332] hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] rounded-full font-bold transition-all cursor-pointer"
            >
              {T[lang].returnHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} lang={lang} setLang={setLang} />

      {/* --- HOME PAGE --- */}
      <section id="home" className="relative min-h-screen flex flex-col justify-between items-center overflow-hidden bg-emerald-950 pt-28 pb-16">
        <video 
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
          autoPlay muted loop playsInline
          src="https://videos.pexels.com/video-files/3268841/3268841-hd_1920_1080_25fps.mp4"
        />
        <div className="absolute inset-0 bg-linear-to-b from-emerald-950/50 via-transparent to-zinc-50" />
        
        {/* --- LIVE STUDENT VOICE TICKER --- */}
        <div className="w-full max-w-7xl mx-auto px-6 relative z-10 mb-8 shrink-0">
          <div className="bg-zinc-900/90 border border-zinc-800/80 rounded-2xl sm:rounded-full px-4 py-3 sm:px-5 sm:py-2.5 shadow-xl flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 backdrop-blur-md">
            <div className="flex items-center gap-1.5 shrink-0 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <span className="text-[10px] font-black text-emerald-400 tracking-wider uppercase font-mono">{T[lang].liveFeed}</span>
            </div>
            
            <div className="flex-1 overflow-hidden min-h-6 relative flex items-center w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTickerIdx}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full text-zinc-300 text-xs sm:text-sm font-semibold tracking-wide whitespace-normal leading-relaxed py-0.5"
                >
                  {lang === 'en' ? tickerVoicesEn[currentTickerIdx] : tickerVoicesZh[currentTickerIdx]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* --- HERO CONTENT --- */}
        <div className="relative z-10 text-center px-6 my-auto max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-widest uppercase rounded-full mb-6 backdrop-blur-sm border border-emerald-500/20 animate-pulse"
          >
            {T[lang].studentInitiative}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter"
          >
            {T[lang].heroHeading}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-emerald-100/80 font-light max-w-2xl mx-auto leading-relaxed space-y-2"
          >
            {T[lang].heroTagline.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </motion.div>
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => setActiveSection('hub')}
            className="mt-8 group flex items-center gap-2 mx-auto text-emerald-400 font-bold hover:text-emerald-300 transition-colors cursor-pointer"
          >
            {T[lang].exploreMovement} <ChevronDown className="group-hover:translate-y-1 transition-transform" />
          </motion.button>
        </div>

        {/* --- 3 DATA CALLOUT BLOCKS BANNER --- */}
        <div className="w-full max-w-7xl mx-auto px-6 mt-12 relative z-10 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Block 1 */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between backdrop-blur-md text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-black tracking-widest text-emerald-400 font-mono uppercase bg-emerald-500/10 px-2 py-0.5 rounded-md">Index</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              </div>
              <p className="text-4xl md:text-5xl font-black text-white font-sans tracking-tight mb-2">84%</p>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold uppercase tracking-wider leading-relaxed">{T[lang].equityIndexLabel}</p>
            </motion.div>

            {/* Block 2 */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between backdrop-blur-md text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-black tracking-widest text-emerald-400 font-mono uppercase bg-emerald-500/10 px-2 py-0.5 rounded-md">Voices</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              </div>
              <p className="text-4xl md:text-5xl font-black text-white font-sans tracking-tight mb-2">126</p>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold uppercase tracking-wider leading-relaxed">{T[lang].totalVoicesLabel}</p>
            </motion.div>

            {/* Block 3 */}
            <motion.div 
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between backdrop-blur-md text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-black tracking-widest text-emerald-400 font-mono uppercase bg-emerald-500/10 px-2 py-0.5 rounded-md">Metrics</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl md:text-4xl font-black text-white font-sans tracking-tight">28.6%</span>
                <span className="text-zinc-500 text-xs font-bold uppercase font-mono">vs</span>
                <span className="text-2xl md:text-3xl font-black text-zinc-300 font-sans tracking-tight">10.0%</span>
              </div>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold uppercase tracking-wider leading-relaxed">{T[lang].lunchVsAfternoonLabel}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <SectionContainer id="why" className="bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
                {T[lang].motivation}
              </span>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
                {lang === 'en' ? (
                  <>Why <span className="text-zinc-900 font-serif italic">"Co-exist Pitch"</span>?</>
                ) : (
                  <>为什么发起<span className="text-zinc-900 font-serif italic">“共存球场”</span>？</>
                )}
              </h2>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-6 text-xl text-zinc-600 leading-relaxed font-light"
            >
              <p>
                {lang === 'en' ? (
                  <>On our school soccer pitch, there is a clear <span className="text-emerald-600 font-bold">gender imbalance</span> in resource utilization. Observations, independently confirmed by <span className="text-zinc-900 font-bold">ten of my fellow students</span>, show that while the center is dominated by high-intensity male matches, female students are often relegated to the sidelines.</>
                ) : (
                  <>在我们学校的足球场上，核心运动场地资源的使用存在着明显的<span className="text-emerald-600 font-bold">性别层级失衡</span>。由<span className="text-zinc-900 font-bold">10多位男女同学</span>独立参与现场记述和交叉求证的调研揭示，当球场中央常年被高强度的精尖男生对抗赛霸占时，女生往往被不可避免地边缘化到场外底线边甚至充当旁观者。</>
                )}
              </p>
              <p>
                {lang === 'en' ? (
                  <>This is not just about space; it is about <span className="text-emerald-600 font-bold italic">social comfort</span>. Many girls feel shy or self-conscious about accidental physical contact and the "performance pressure" of playing with experienced boys.</>
                ) : (
                  <>这绝不仅是运动范围大小的事，更是全校同辈<span className="text-emerald-600 font-bold italic font-serif">社交安全感与舒适圈</span>的筑造。极多女同学会因为高强度争抢带来的频繁肢体碰擦，乃至与资深男生并肩作战而无形中伴生的“巨大技战术自省与竞技期望压抑”感到腼腆、局促甚至自我怀疑。</>
                )}
              </p>
              <p className="text-zinc-400 text-lg border-l-2 border-emerald-100 pl-6 italic">
                {T[lang].whyQuote}
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
             {/* Decorative blob */}
             <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-50" />
             
             <div className="relative group flex flex-col gap-4">
                {/* Main Large Image */}
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-200 group-hover:scale-[1.02] transition-transform duration-700">
                  <img 
                    src={fieldImg} 
                    alt="The School Pitch Main View" 
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-emerald-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
 
                {/* Staggered Second Image */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="relative rounded-3xl overflow-hidden shadow-xl border border-zinc-200 group-hover:translate-x-2 transition-transform duration-700">
                      <img 
                        src={field2Img} 
                        alt="The School Pitch Alternative View" 
                        className="w-full aspect-square object-cover"
                      />
                   </div>
                   
                   {/* Stats badge integrated into the layout */}
                   <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-[2rem] shadow-xl shadow-emerald-900/10 border border-emerald-50 border-t-emerald-200 flex flex-col justify-center items-center text-center gap-3 transition-transform duration-700 group-hover:-translate-x-2"
                  >
                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white rotate-3">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-emerald-600 tracking-widest mb-0.5">{T[lang].communityReport}</p>
                        <p className="text-xl font-black text-zinc-900 tracking-tighter">{T[lang].witnesses}</p>
                    </div>
                  </motion.div>
                </div>
             </div>
          </motion.div>
        </div>
      </SectionContainer>

      {/* Mission Statement */}
      <SectionContainer id="mission" className="bg-white border-y border-zinc-200 text-center">
        <div className="max-w-3xl mx-auto">
          <Heart className="w-10 h-10 text-rose-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">{T[lang].ourMission}</h2>
          <p className="text-2xl text-zinc-650 font-medium italic leading-relaxed" style={{ color: '#111827' }}>
            {T[lang].missionQuote}
          </p>
        </div>
      </SectionContainer>

      {/* --- THE CO-EXIST SOLUTION (Measures) --- */}
      <SectionContainer id="solutions" className="bg-emerald-950 text-white rounded-[4rem] my-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900/20 skew-x-12 translate-x-32" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <Zap className="w-6 h-6 text-emerald-400 fill-emerald-400" />
            <span className="text-emerald-400 font-black uppercase tracking-widest text-sm">{T[lang].keyMeasures}</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-16 leading-[1.1]">
            {lang === 'en' ? (
              <>Our <span className="text-emerald-400 font-serif italic">Solution</span> for<br /> a Better Pitch.</>
            ) : (
              <>共存球场，我们的<span className="text-emerald-400 font-serif italic font-sans not-italic">解决方案</span>。</>
            )}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rule 1: No-Contact */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="p-8 bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/20 rounded-[2.5rem] group hover:bg-emerald-800/50 transition-colors"
            >
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8 rotate-3 group-hover:rotate-6 transition-transform">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{T[lang].noContactPlay}</h3>
              <p className="text-emerald-100/60 leading-relaxed">
                {lang === 'en' ? (
                  <>By removing high-intensity physical contact, we shift the focus to <strong>technical skill and spacing</strong>. This eliminates the intimidation factor for students of all genders and sizes.</>
                ) : (
                  <>通过倡导防肢体冲撞的<strong>轻量化安全法则</strong>，我们将竞技重心转移至精细传接与团队空间跑位，从而彻底打消原先对新手和女生的刻板压迫感。</>
                )}
              </p>
            </motion.div>

            {/* Rule 2: Beginner Friendly */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="p-8 bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/20 rounded-[2.5rem] group hover:bg-emerald-800/50 transition-colors"
            >
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8 -rotate-3 group-hover:rotate-0 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{T[lang].confidenceFirst}</h3>
              <p className="text-emerald-100/60 leading-relaxed mb-6">
                {lang === 'en' ? (
                  <>We've established a "Beginner's Corner" to provide confidence tips, ensuring that <strong>the pitch is a place for learning</strong>, not just for elite performance.</>
                ) : (
                  <>通过开辟<strong>“自信初练角”</strong>并提供体贴的技术贴士，确保绿茵场永远是一座可以探索和相互鼓励的学习场所，而非冰冷的数据秀场。</>
                )}
              </p>
              <div className="space-y-3">
                <div className="flex gap-3 items-center text-sm bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/10">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">1</div>
                  {T[lang].tip1}
                </div>
                <div className="flex gap-3 items-center text-sm bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/10">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">2</div>
                  {T[lang].tip2}
                </div>
              </div>
            </motion.div>

            {/* Rule 3: Visual Equity */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="p-8 bg-white text-zinc-900 rounded-[2.5rem] shadow-2xl"
            >
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-8">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{T[lang].equitableAccess}</h3>
              <p className="text-zinc-500 leading-relaxed mb-8">
                {lang === 'en' ? (
                  <>Our goal is to rebalance the <strong>80/20 occupancy ratio</strong>. By creating a regulated mixed-gender space, we ensure every student gets a fair turn at the center.</>
                ) : (
                  <>我们的短期与长期目标是重塑历来 <strong>80/20 的男女空间使用差距</strong>。通过设置科学可控的男女混合时段，让所有同学体面地共享中心位置。</>
                )}
              </p>
              
              <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4">{T[lang].currentParticipation}</p>
                <div className="h-3 w-full bg-zinc-200 rounded-full flex overflow-hidden">
                  <div className="bg-emerald-500 w-[20%]" />
                  <div className="border-l-2 border-white w-[1px]" />
                  <div className="bg-zinc-300 w-[80%]" />
                </div>
                <div className="flex justify-between mt-3">
                  <span className="text-xs font-bold text-emerald-600">{T[lang].femaleLabel}</span>
                  <span className="text-xs font-bold text-zinc-400">{T[lang].maleLabel}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action for Solution */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="mt-16 p-10 bg-linear-to-r from-emerald-500 to-emerald-600 bg-emerald-600 rounded-[3rem] text-center"
          >
            <h4 className="text-3xl font-bold">{T[lang].respectQuote}</h4>
          </motion.div>
        </div>
      </SectionContainer>

      {/* --- INCLUSIVITY SURVEY --- */}
      <section id="feedback" className="bg-emerald-50 py-24 px-6 overflow-hidden relative border-y border-zinc-200">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-200/50 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-200/50 rounded-full blur-2xl" />

        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-200/50 mb-4 shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-emerald-600" /> {T[lang].equityCampaign}
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 mb-4 text-center">
              {T[lang].surveyTitle}
            </h2>
            <p className="text-emerald-800/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-center">
              {T[lang].surveyDesc}
            </p>
          </div>

          {/* Toggle Button */}
          <div className="mb-4 z-10">
            <button 
              type="button"
              onClick={() => setShowSurvey(!showSurvey)}
              className="px-8 py-4 bg-[#1b4332] hover:bg-[#122e22] text-white rounded-2xl font-black text-base tracking-wide flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-950/20 cursor-pointer border border-emerald-500/20"
            >
              {showSurvey ? T[lang].hideSurveyBtn : T[lang].takeSurveyBtn}
              <motion.span
                animate={{ rotate: showSurvey ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-block"
              >
                <ChevronDown className="w-5 h-5 text-emerald-300" />
              </motion.span>
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showSurvey && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full overflow-hidden"
              >
                <div className="w-full bg-white p-6 sm:p-12 rounded-[2.5rem] shadow-2xl shadow-emerald-950/5 border border-zinc-100 mt-6">
                  {feedbackSuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16"
                    >
                      <div className="w-20 h-20 bg-emerald-100 text-[#1b4332] rounded-full flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-100/55">
                        <ShieldCheck className="w-10 h-10" />
                      </div>
                      <h3 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">{T[lang].surveySuccessTitle}</h3>
                      <p className="text-zinc-500 max-w-md mx-auto leading-relaxed">
                        {T[lang].surveySuccessDesc}
                      </p>
                      <button 
                        type="button"
                        onClick={() => setFeedbackSuccess(false)}
                        className="mt-8 px-6 py-3 bg-zinc-100 font-bold text-zinc-700 rounded-2xl hover:bg-emerald-50 hover:text-[#1b4332] transition-all border border-zinc-200 cursor-pointer"
                      >
                        {T[lang].submitAnotherBtn}
                      </button>
                    </motion.div>
                  ) : (
                    <form className="space-y-10" onSubmit={handleSurveySubmit}>
                      
                      {/* Q1: Gender */}
                      <div className="space-y-4">
                        <label className="text-base font-bold text-zinc-800 flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md bg-emerald-100 text-[#1b4332] font-extrabold text-xs flex items-center justify-center">1</span>
                          {T[lang].qGender}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { key: 'Male', label: T[lang].optMale },
                            { key: 'Female', label: T[lang].optFemale },
                            { key: 'Prefer not to say', label: T[lang].optOther }
                          ].map(opt => (
                            <button 
                              key={opt.key} 
                              type="button" 
                              onClick={() => setGender(opt.key)}
                              className={`p-4 rounded-2xl border text-sm font-semibold transition-all text-left flex items-center gap-3 cursor-pointer ${
                                gender === opt.key 
                                  ? 'border-emerald-500 bg-emerald-50 text-[#1b4332] shadow-sm shadow-emerald-500/10' 
                                  : 'border-zinc-200 hover:border-emerald-300 bg-white text-zinc-600 hover:bg-zinc-50/50'
                              }`}
                            >
                              <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                                gender === opt.key ? 'border-[#1b4332] bg-[#1b4332]' : 'border-zinc-300 bg-white'
                              }`}>
                                {gender === opt.key && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Q2: Grade */}
                      <div className="space-y-4">
                        <label className="text-base font-bold text-zinc-805 flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md bg-emerald-100 text-[#1b4332] font-extrabold text-xs flex items-center justify-center">2</span>
                          {T[lang].qGrade}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            { key: 'Grade 10', label: T[lang].optG10 },
                            { key: 'Grade 11', label: T[lang].optG11 },
                            { key: 'Grade 12', label: T[lang].optG12 }
                          ].map(opt => (
                            <button 
                              key={opt.key} 
                              type="button" 
                              onClick={() => setGrade(opt.key)}
                              className={`p-4 rounded-2xl border text-sm font-semibold transition-all text-left flex items-center gap-3 cursor-pointer ${
                                grade === opt.key 
                                  ? 'border-emerald-500 bg-emerald-50 text-[#1b4332] shadow-sm shadow-emerald-500/10' 
                                  : 'border-zinc-200 hover:border-emerald-300 bg-white text-zinc-600 hover:bg-zinc-50/50'
                              }`}
                            >
                              <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                                grade === opt.key ? 'border-[#1b4332] bg-[#1b4332]' : 'border-zinc-300 bg-white'
                              }`}>
                                {grade === opt.key && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Q3: Play Frequency */}
                      <div className="space-y-4">
                        <label className="text-base font-bold text-zinc-800 flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md bg-emerald-100 text-[#1b4332] font-extrabold text-xs flex items-center justify-center">3</span>
                          {T[lang].qFrequency}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { key: 'Daily', label: T[lang].optDaily },
                            { key: '2-3 times a week', label: T[lang].optFewTimes },
                            { key: 'Rarely', label: T[lang].optRarely },
                            { key: 'Never', label: T[lang].optNever }
                          ].map(opt => (
                            <button 
                              key={opt.key} 
                              type="button" 
                              onClick={() => setPlayFrequency(opt.key)}
                              className={`p-4 rounded-2xl border text-sm font-semibold transition-all text-left flex items-center gap-3 cursor-pointer ${
                                playFrequency === opt.key 
                                  ? 'border-emerald-500 bg-emerald-50 text-[#1b4332] shadow-sm shadow-emerald-500/10' 
                                  : 'border-zinc-200 hover:border-emerald-300 bg-white text-zinc-600 hover:bg-zinc-50/50'
                              }`}
                            >
                              <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${
                                playFrequency === opt.key ? 'border-[#1b4332] bg-[#1b4332]' : 'border-zinc-300 bg-white'
                              }`}>
                                {playFrequency === opt.key && <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                              </div>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Q4: Use Time slots */}
                      <div className="space-y-4">
                        <label className="text-base font-bold text-zinc-800 flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md bg-emerald-100 text-[#1b4332] font-extrabold text-xs flex items-center justify-center">4</span>
                          {T[lang].qTimeSlots}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { key: 'Lunch break', label: T[lang].slotLunch },
                            { key: 'After-school hours', label: T[lang].slotAfter },
                            { key: 'PE classes', label: T[lang].slotPe },
                            { key: 'Never', label: T[lang].slotNever }
                          ].map(opt => {
                            const isChecked = timeSlots.includes(opt.key);
                            return (
                              <button 
                                key={opt.key} 
                                type="button" 
                                onClick={() => handleToggleTimeSlot(opt.key)}
                                className={`p-4 rounded-2xl border text-sm font-semibold transition-all text-left flex items-center gap-3 cursor-pointer ${
                                  isChecked 
                                    ? 'border-emerald-500 bg-emerald-50 text-[#1b4332] shadow-sm shadow-emerald-500/10' 
                                    : 'border-zinc-200 hover:border-emerald-300 bg-white text-zinc-600 hover:bg-zinc-50/50'
                                }`}
                              >
                                <div className={`w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center ${
                                  isChecked ? 'border-[#1b4332] bg-[#1b4332] text-white' : 'border-zinc-300 bg-white'
                                }`}>
                                  {isChecked && (
                                    <svg className="w-3 h-3 fill-none stroke-current stroke-[3]" viewBox="0 0 24 24">
                                      <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                  )}
                                </div>
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Q5: Scale Rating */}
                      <div className="space-y-4">
                        <label className="text-base font-bold text-zinc-850 flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md bg-emerald-100 text-[#1b4332] font-extrabold text-xs flex items-center justify-center">5</span>
                          {T[lang].qNeutral}
                        </label>
                        <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-200/60 font-semibold">
                          <div className="flex gap-2 sm:gap-4 justify-between">
                            {[1, 2, 3, 4, 5].map(num => (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setNeutralRating(num)}
                                className={`flex-1 aspect-square rounded-2xl border font-bold text-base sm:text-lg transition-all flex flex-col justify-center items-center cursor-pointer ${
                                  neutralRating === num
                                    ? 'bg-[#1b4332] border-[#1b4332] text-white shadow-md shadow-emerald-900/20 scale-[1.03]'
                                    : 'bg-white border-zinc-200 hover:border-emerald-400 text-zinc-700 hover:bg-emerald-50/20'
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider mt-4">
                            <span>1 - {T[lang].stronglyDisagree}</span>
                            <span>5 - {T[lang].stronglyAgree}</span>
                          </div>
                        </div>
                      </div>

                      {/* Q6: Barriers */}
                      <div className="space-y-4">
                        <label className="text-base font-bold text-zinc-805 flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md bg-emerald-100 text-[#1b4332] font-extrabold text-xs flex items-center justify-center">6</span>
                          {T[lang].qBarriers}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { key: 'Lack of interest', label: T[lang].barrierInterest },
                            { key: 'Pitch dominated by male groups', label: T[lang].barrierDominated },
                            { key: 'Feeling judged/self-conscious', label: T[lang].barrierJudged },
                            { key: 'Lack of co-ed activities', label: T[lang].barrierCoed }
                          ].map(opt => {
                            const isChecked = barriers.includes(opt.key);
                            return (
                              <button 
                                key={opt.key} 
                                type="button" 
                                onClick={() => handleToggleBarrier(opt.key)}
                                className={`p-4 rounded-2xl border text-sm font-semibold transition-all text-left flex items-center gap-3 cursor-pointer ${
                                  isChecked 
                                    ? 'border-emerald-500 bg-emerald-50 text-[#1b4332] shadow-sm shadow-emerald-500/10' 
                                    : 'border-zinc-200 hover:border-emerald-300 bg-white text-zinc-600 hover:bg-zinc-50/50'
                                }`}
                              >
                                <div className={`w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center ${
                                  isChecked ? 'border-[#1b4332] bg-[#1b4332] text-white' : 'border-zinc-300 bg-white'
                                }`}>
                                  {isChecked && (
                                    <svg className="w-3 h-3 fill-none stroke-current stroke-[3]" viewBox="0 0 24 24">
                                      <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                  )}
                                </div>
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Q7: Suggestions open text block */}
                      <div className="space-y-4">
                        <label className="text-base font-bold text-zinc-800 flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md bg-emerald-100 text-[#1b4332] font-extrabold text-xs flex items-center justify-center">7</span>
                          {T[lang].qSuggestions}
                        </label>
                        <textarea 
                          value={additionalFeedback}
                          onChange={(e) => setAdditionalFeedback(e.target.value)}
                          className="w-full h-32 p-4 rounded-2xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none text-zinc-700 text-sm leading-relaxed"
                          placeholder={T[lang].placeholderSuggestions}
                        ></textarea>
                      </div>

                      {/* Submit button container */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6 border-t border-zinc-100">
                        <div className="flex items-center gap-2 text-zinc-400 text-xs italic font-semibold">
                          <ShieldCheck className="w-4 h-4 text-[#1b4332]" />
                          {T[lang].surveyNote}
                        </div>
                        <button 
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-[#1b4332] text-white px-8 py-4 px-8 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-[#122e22] transition-colors disabled:opacity-50 shadow-md shadow-emerald-500/15 cursor-pointer md:w-auto w-full"
                        >
                          {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          {T[lang].submitSurveyBtn}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* --- IMPACT & DATA DASHBOARD --- */}
      <section id="insights" className="py-24 px-6 bg-white border-y border-zinc-200">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-[#1b4332] text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4">
              {T[lang].indicatorImpact}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight mb-4">
              {T[lang].communityInsights}
            </h2>
            <p className="text-zinc-505 text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: '#718096' }}>
              {T[lang].insightsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* Left Column: Gender Gap Visualization */}
            <div className="lg:col-span-7 bg-zinc-50/80 rounded-[2.5rem] border border-zinc-100 p-8 sm:p-10 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300">
              <div className="space-y-8">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">{T[lang].realityCheck}</span>
                  <h3 className="text-2xl font-bold text-zinc-900 mt-1 mb-6">{T[lang].fieldGap}</h3>
                </div>

                <div className="space-y-6">
                  {/* Lunch Break Card */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end text-sm">
                      <span className="font-bold text-zinc-805" style={{ color: '#2d3748' }}>{T[lang].lunchBreakPart}</span>
                      <span className="font-black text-emerald-700">28.6%</span>
                    </div>
                    {/* Visual Bar */}
                    <div className="h-6 w-full bg-zinc-200/70 rounded-full overflow-hidden p-1 border border-zinc-100">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '28.6%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="h-full rounded-full min-w-[20px] transition-all duration-300 relative"
                        style={{ backgroundColor: '#1b4332' }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500 font-semibold pl-1">
                      {T[lang].lunchAvg}
                    </p>
                  </div>

                  {/* After-School Card */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end text-sm">
                      <span className="font-bold text-zinc-805" style={{ color: '#2d3748' }}>{T[lang].afterSchoolPart}</span>
                      <span className="font-black text-emerald-700">10.0%</span>
                    </div>
                    {/* Visual Bar */}
                    <div className="h-6 w-full bg-zinc-200/70 rounded-full overflow-hidden p-1 border border-zinc-100">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '10%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                        className="h-full rounded-full min-w-[20px] transition-all duration-300 relative"
                        style={{ backgroundColor: '#1b4332' }}
                      />
                    </div>
                    <p className="text-xs text-zinc-400 font-medium pl-1">
                      {T[lang].afterAvg}
                    </p>
                  </div>
                </div>
              </div>

              {/* Analytical Insight Paragraph */}
              <div className="mt-8 pt-6 border-t border-zinc-202">
                <p className="text-sm text-zinc-650 leading-relaxed font-light" style={{ color: '#2d3748' }}>
                  <strong className="font-bold" style={{ color: '#1b4332' }}>{T[lang].conclusionLabel}</strong> {T[lang].conclusionText}
                </p>
              </div>
            </div>

            {/* Right Column: Stat Boxes & Testimonial */}
            <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
              {/* Grid of 3 Stat Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                {/* Stat 1 */}
                <motion.div 
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white border border-zinc-200 rounded-[2rem] p-6 text-center shadow-xs hover:border-[#1e4620]/40 hover:shadow-lg hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col justify-center items-center"
                >
                  <p className="text-4xl font-black mb-1 font-sans" style={{ color: '#1b4332' }}>1</p>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight leading-tight">{T[lang].samplingWeekly}</p>
                </motion.div>

                {/* Stat 2 */}
                <motion.div 
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white border border-zinc-200 rounded-[2rem] p-6 text-center shadow-xs hover:border-[#1e4620]/40 hover:shadow-lg hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col justify-center items-center"
                >
                  <p className="text-4xl font-black mb-1 font-sans" style={{ color: '#1b4332' }}>3+</p>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight leading-tight">{T[lang].storiesPublished}</p>
                </motion.div>

                {/* Stat 3 */}
                <motion.div 
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-white border border-zinc-200 rounded-[2rem] p-6 text-center shadow-xs hover:border-[#1e4620]/40 hover:shadow-lg hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col justify-center items-center"
                >
                  <p className="text-4xl font-black mb-1 font-sans" style={{ color: '#1b4332' }}>100%</p>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight leading-tight">{T[lang].privacyFeedback}</p>
                </motion.div>
              </div>

              {/* Pitch Equity Action Plan Card */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="text-white rounded-[2.5rem] p-8 relative overflow-hidden flex-1 flex flex-col justify-between hover:shadow-xl hover:shadow-[#1b4332]/10 transition-all duration-300 border border-emerald-900/40"
                style={{ backgroundColor: '#1b4332' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800/30 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-800/40 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black tracking-tight text-white">{T[lang].actionPlanTitle}</h4>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest font-mono">{T[lang].actionPlanSub}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 my-6">
                    {/* Item 1 */}
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </div>
                      <p className="text-xs text-emerald-100 leading-relaxed">
                        <strong className="font-bold text-white block">{T[lang].actionMixedTitle}</strong>{T[lang].actionMixedDesc}
                      </p>
                    </div>

                    {/* Item 2 */}
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </div>
                      <p className="text-xs text-emerald-100 leading-relaxed">
                        <strong className="font-bold text-white block">{T[lang].actionBookingTitle}</strong>{T[lang].actionBookingDesc}
                      </p>
                    </div>

                    {/* Item 3 */}
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </div>
                      <p className="text-xs text-emerald-100 leading-relaxed">
                        <strong className="font-bold text-white block">{T[lang].actionAllyTitle}</strong>{T[lang].actionAllyDesc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-emerald-800/40 pt-4 flex items-center justify-between text-[11px] text-emerald-300">
                  <span className="font-semibold">{T[lang].ratioGoal}</span>
                  <span className="font-mono text-emerald-400">{T[lang].deadline}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- COMMUNITY HUB --- */}
      <SectionContainer id="hub">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-emerald-600 font-mono text-sm tracking-widest uppercase mb-2 block">{T[lang].communityHub}</span>
            <h2 className="text-5xl font-bold tracking-tight">{T[lang].storiesTitle}</h2>
          </div>
          <p className="text-zinc-500 max-w-sm">
            {T[lang].hubLead}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Quote 1 */}
          <div className="p-8 bg-white border border-zinc-200 rounded-3xl hover:border-emerald-200 transition-colors">
            <Quote className="w-8 h-8 text-emerald-300 mb-4" />
            <p className="text-lg text-zinc-700 mb-6 font-medium">"{lang === 'en' ? interviewsEn[0].quote : interviewsZh[0].quote}"</p>
            <div className="flex items-center gap-3">
              <img 
                src={humanImg} 
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="font-bold text-sm text-zinc-900">{lang === 'en' ? interviewsEn[0].name : interviewsZh[0].name}</p>
                <p className="text-xs text-zinc-400">{lang === 'en' ? interviewsEn[0].role : interviewsZh[0].role}</p>
              </div>
            </div>
          </div>
          
          {/* Beginner Corner */}
          <div className="lg:col-span-2 p-8 bg-emerald-900 text-white rounded-3xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-6 text-emerald-400">
                <Zap className="w-5 h-5 fill-emerald-400" />
                <span className="text-sm font-bold tracking-widest uppercase">{T[lang].beginnerCorner}</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">{T[lang].beginnerTitle}</h3>
              <p className="text-emerald-100/70 mb-8 max-w-md">{T[lang].beginnerDesc}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-auto">
                <div className="flex gap-4">
                  <div className="w-8 h-8 flex-none bg-emerald-700 rounded-lg flex items-center justify-center font-bold">1</div>
                  <p className="text-sm">{T[lang].begTip1}</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 flex-none bg-emerald-700 rounded-lg flex items-center justify-center font-bold">2</div>
                  <p className="text-sm">{T[lang].begTip2}</p>
                </div>
              </div>
            </div>
            <BookOpen className="absolute -bottom-10 -right-10 w-64 h-64 text-emerald-800 opacity-20 pointer-events-none" />
          </div>

          {/* More stories link */}
          <div className="p-8 bg-zinc-100 rounded-[2.5rem] flex items-center justify-center text-center border-2 border-dashed border-zinc-200">
            <div>
              <p className="text-zinc-400 text-sm mb-4">{T[lang].studentCount}</p>
              <button 
                onClick={() => setActiveSection('interviews')}
                className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors text-lg"
              >
                {T[lang].readFullBtn}
              </button>
            </div>
          </div>
        </div>
      </SectionContainer>



      {/* --- ABOUT --- */}
      <SectionContainer id="about" className="bg-zinc-900 text-white rounded-t-[4rem]">
        <div className="py-12">
          <h2 className="text-4xl font-bold mb-12 text-center">About the Project</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="p-8 bg-zinc-800 rounded-3xl border border-zinc-700">
              <h3 className="font-bold text-emerald-400 mb-6 uppercase tracking-widest text-xs">The Team Credits</h3>
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <p className="text-white font-bold">Joshua</p>
                  <p className="text-zinc-500 text-xs">Build & Navigation</p>
                </div>
                <div>
                  <p className="text-white font-bold">Jack</p>
                  <p className="text-zinc-500 text-xs">Content Specialist</p>
                </div>
                <div>
                  <p className="text-white font-bold">Kye</p>
                  <p className="text-zinc-500 text-xs">UI Copywriting</p>
                </div>
                <div>
                  <p className="text-white font-bold">Oliver</p>
                  <p className="text-zinc-500 text-xs">Design & Logo</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-zinc-800/50 rounded-3xl border border-zinc-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-zinc-400 uppercase tracking-widest text-xs">Admin Access</h3>
                {user ? (
                  <button onClick={() => signOut(auth!)} className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1">
                    <LogOut className="w-3 h-3" /> Logout
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={handleSignIn} className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Owner Login
                    </button>
                    {authError && (
                      <p className="text-[10px] text-rose-400 text-right max-w-[200px] leading-tight">
                        {authError}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {user ? (() => {
                const totalCount = surveys.length;
                const ratingSum = surveys.reduce((acc, curr) => acc + (curr.neutralRating || 0), 0);
                const avgRating = totalCount > 0 ? (ratingSum / totalCount).toFixed(1) : '0';
                
                const maleCount = surveys.filter(s => s.gender === 'Male').length;
                const femaleCount = surveys.filter(s => s.gender === 'Female').length;
                const otherCount = surveys.filter(s => s.gender === 'Prefer not to say').length;

                return (
                  <div className="space-y-6 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                    {/* Live campaign stats */}
                    <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-700/60 space-y-3">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider font-mono">Campaign Metrics</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-zinc-850 rounded-xl border border-zinc-700/50">
                          <p className="text-[10px] text-zinc-500 font-medium">Total Replies</p>
                          <p className="text-2xl font-black text-white">{totalCount}</p>
                        </div>
                        <div className="p-3 bg-zinc-850 rounded-xl border border-zinc-700/50">
                          <p className="text-[10px] text-zinc-500 font-medium">Avg Inclusivity</p>
                          <p className="text-2xl font-black text-emerald-450" style={{ color: '#34d399' }}>{avgRating} <span className="text-xs text-zinc-400">/ 5</span></p>
                        </div>
                      </div>

                      {totalCount > 0 && (
                        <div className="space-y-2 pt-2 border-t border-zinc-800">
                          <p className="text-[10px] text-zinc-500 font-medium">Gender Distribution</p>
                          <div className="flex justify-between text-[9px] text-zinc-450 font-bold" style={{ color: '#a1a1aa' }}>
                            <span>Male: {maleCount}</span>
                            <span>Female: {femaleCount}</span>
                            <span>Other: {otherCount}</span>
                          </div>
                          <div className="h-2 w-full bg-zinc-800 rounded-full flex overflow-hidden">
                            <div className="h-full" style={{ width: `${(maleCount / totalCount) * 100}%`, backgroundColor: '#38bdf8' }} />
                            <div className="h-full" style={{ width: `${(femaleCount / totalCount) * 100}%`, backgroundColor: '#34d399' }} />
                            <div className="h-full" style={{ width: `${(otherCount / totalCount) * 100}%`, backgroundColor: '#fbbf24' }} />
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-zinc-450 font-bold">Raw Survey Submissions ({totalCount}):</p>
                    {totalCount === 0 ? (
                      <p className="text-xs text-zinc-500 italic">No survey responses yet.</p>
                    ) : (
                      surveys.map((s, i) => (
                        <div key={s.id || i} className="p-4 bg-zinc-900 rounded-2xl border border-zinc-700/80 space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-extrabold text-emerald-400">{s.gender} • {s.grade}</span>
                            <span className="text-zinc-500">
                              {s.createdAt?.toDate ? s.createdAt.toDate().toLocaleDateString() : 'Just now'}
                            </span>
                          </div>
                          
                          <div className="text-xs text-zinc-400 space-y-1">
                            <p>⚽ <strong className="text-zinc-300 font-semibold">Play Frequency:</strong> {s.playFrequency}</p>
                            {s.timeSlots && s.timeSlots.length > 0 && (
                              <p>🕒 <strong className="text-zinc-300 font-semibold">Slots:</strong> {s.timeSlots.join(', ')}</p>
                            )}
                            <p>⭐ <strong className="text-zinc-300 font-semibold">Neutral Rating:</strong> {s.neutralRating} / 5</p>
                            {s.barriers && s.barriers.length > 0 && (
                              <p>⚠️ <strong className="text-zinc-300 font-semibold">Barriers:</strong> {s.barriers.join(', ')}</p>
                            )}
                          </div>

                          {s.additionalFeedback && (
                            <div className="mt-2 pt-2 border-t border-zinc-800/80">
                              <p className="text-xs text-zinc-300 italic leading-relaxed">
                                "{s.additionalFeedback}"
                              </p>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                );
              })() : (
                <p className="text-sm text-zinc-600">Login with Google to view anonymous survey submissions & metrics.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo className="w-16 h-16" />
            <span className="font-bold tracking-tight text-lg text-white">THE CO-EXIST PITCH</span>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
