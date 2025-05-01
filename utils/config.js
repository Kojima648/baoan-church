// utils/config.js

const BASE_CDN_URL = "https://static.klee.ink";

export const Config = {
  music: {
    // 获取歌单列表
    sheetListUrl: `${BASE_CDN_URL}/config/music/type-0/sheet_list.json`,
    // 获取具体歌单详情
    getSheetDetailUrl: function (sheetId) {
      return `${BASE_CDN_URL}/config/music/type-0/sheet_detail/sheet_${sheetId}.json`
    }
  },

  festival: {
    // 获取某个月份的瞻礼单，比如 '2028-06'
    getFestivalListUrl: function (yearMonth) {
      return `${BASE_CDN_URL}/config/festival-list/${yearMonth}.json`
    },
	
    // ✅ 教会全年节日总览（分类整理）
    fullFestivalConfigUrl: `${BASE_CDN_URL}/config/miscellaneous-table/festival_config.json`,
	
	// ✅ 新增：节日详情内容列表（走 scode 匹配）
	fullFestivalDetailUrl: `${BASE_CDN_URL}/config/miscellaneous-table/festival_articles.json`,
	
	// ✅ 教会节日图集专属路径
	festivalImageBaseUrl: `${BASE_CDN_URL}/content/images/festival`
	
  },

  // 静态图片资源根目录
  imagesBaseUrl: `${BASE_CDN_URL}/images/`,

  // API接口基地址
  apiBaseUrl: "https://api.klee.ink",
  
  // index页面下面的版权，走配置
  footer: {
    url: `${BASE_CDN_URL}/config/miscellaneous-table/footer.json`
  }

};
