const fs = require('fs');

const files = ['src/components/LandingPortal.tsx', 'src/components/Navbar.tsx'];

const translations = {
  'Home': '主页',
  'Solutions': '解决方案',
  'Packages': '套餐',
  'Hardware Store': '硬件商店',
  'Services': '服务',
  'AI Planner': 'AI规划器',
  'Support': '支持',
  'Cross-Border Supply': '跨境供应',
  'Compliance': '合规',
  'Community Impact': '社区影响',
  'Tech Field Ops': '现场技术',
  'Admin / Inventory': '管理/库存',
  'My Dashboard': '我的仪表板',
  'About': '关于我们',
  'Request Quote': '请求报价',
  'Portal Entry': '门户入口',
  'Request Custom Quote': '请求定制报价',

  'Explore Public Site': '探索公共网站',
  'Select Portal Entry': '选择门户入口',
  'Welcome to ': '欢迎来到 ',
  ' Platform': ' 平台',
  
  'Please select your portal to continue. You can log in to the Customer Portal or access the Admin Control Tower.': '请选择您的门户以继续。您可以登录客户门户或访问管理控制塔。',
  'Admin Option': '管理员选项',
  'Manage products, pricing, SEO keywords, update order statuses, and maintain regulatory records securely.': '安全地管理产品、定价、SEO关键字，更新订单状态，并维护监管记录。',
  'Admin Secret Key Required': '需要管理员密钥',
  'Entering the admin portal requires an authorized secret key.': '进入管理员门户需要授权的密钥。',
  'Enter Admin Portal': '进入管理员门户',
  'Customer Option': '客户选项',
  'Log in or sign up to purchase broadband packages, track hardware orders, and use the Smart Network Planner.': '登录或注册以购买宽带套餐、跟踪硬件订单，并使用智能网络规划器。',
  'Secure Customer Account': '安全客户帐户',
  'Sign up with your email, name, and phone number for immediate verified access.': '使用您的电子邮件、姓名和电话号码注册即可获得即时验证访问权限。',
  'Login': '登录',
  'Sign Up': '注册'
};

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Insert the helper function `t` right after the component declaration
  const tFunction = `\n  const t = (en: string, bn: string, zh: string) => language === 'ZH' ? zh : language === 'BN' ? bn : en;\n`;
  
  if (file === 'src/components/LandingPortal.tsx') {
    content = content.replace(/(const \[selectedPortal, setSelectedPortal\] = useState.*?;\n)/, `$1${tFunction}`);
  } else if (file === 'src/components/Navbar.tsx') {
    content = content.replace(/(const \[mobileMenuOpen, setMobileMenuOpen\] = useState.*?;\n)/, `$1${tFunction}`);
  }

  // Regex to find `language === 'EN' ? 'EN_STR' : 'BN_STR'`
  const regex = /language === 'EN'\s*\?\s*('([^']+)'|"([^"]+)")\s*:\s*('([^']+)'|"([^"]+)")/g;
  
  content = content.replace(regex, (match, g1, enStr1, enStr2, g4, bnStr1, bnStr2) => {
    const en = enStr1 || enStr2;
    const bn = bnStr1 || bnStr2;
    const zh = translations[en] || en; // default to English if not translated
    
    // Properly escape quotes
    const enArg = `'${en.replace(/'/g, "\\'")}'`;
    const bnArg = `'${bn.replace(/'/g, "\\'")}'`;
    const zhArg = `'${zh.replace(/'/g, "\\'")}'`;

    return `t(${enArg}, ${bnArg}, ${zhArg})`;
  });

  fs.writeFileSync(file, content);
}
