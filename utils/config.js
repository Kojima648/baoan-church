// utils/config.js

const BASE_CDN_URL = "https://static.klee.ink";

export const Config = {
	// ✅ 音乐模块配置
	music: {
		sheetListUrl: `${BASE_CDN_URL}/config/music/type-0/sheet_list.json`,
		getSheetDetailUrl(sheetId) {
			return `${BASE_CDN_URL}/config/music/type-0/sheet_detail/sheet_${sheetId}.json`;
		}
	},

	// ✅ 节日相关配置
	festival: {
		getFestivalListUrl(yearMonth) {
			return `${BASE_CDN_URL}/config/festival-list/${yearMonth}.json`;
		},
		fullFestivalConfigUrl: `${BASE_CDN_URL}/config/miscellaneous-table/festival_config.json`,
		fullFestivalDetailUrl: `${BASE_CDN_URL}/config/miscellaneous-table/festival_articles.json`,
		festivalImageBaseUrl: `${BASE_CDN_URL}/content/images/festival`
	},

	// ✅ 普通电子书（非天主教专属）配置
	books: {
		listUrl: `${BASE_CDN_URL}/config/index/e-book/common_books.json`
	},

	// ✅ 天主教专属书籍配置
	catholicBooks: {
		listUrl: `${BASE_CDN_URL}/config/index/catholic-books/list/books_list.json`,

		// ✅ 拼接 markdown 正文文件路径（新版）
		getMarkdownUrl(path) {
			return `${BASE_CDN_URL}/config/index/catholic-books${path}`;
		}
	},

	// ✅ 每日圣言配置
	dailyScripture: {
		configUrl: `${BASE_CDN_URL}/config/daily-scripture/daily-scripture-config.json`,

		// ✅ 若每日圣言将来配图，可集中在这个目录下
		imageBaseUrl: `${BASE_CDN_URL}/config/daily-scripture/assets/backgrounds/`,
	},

	// ✅ 圣经模块配置（思高圣经）
	bible: {
		// 目录树结构（用于构建书卷结构）
		catalogUrl: `${BASE_CDN_URL}/content/documents/bible-html/catalog.json`,

		// 扁平索引结构（用于搜索章节）
		indexUrl: `${BASE_CDN_URL}/content/documents/bible-html/index.json`,

		// 圣经HTML正文基准路径，用于拼接具体章节文件路径
		contentBaseUrl: `${BASE_CDN_URL}/content/documents/bible-html/`,

		// ✅ 拼接具体章节HTML文件路径（如：新约/福音/路加福音/路加福音 第1章.html）
		getHtmlChapterUrl(relativePath) {
			return `${BASE_CDN_URL}/content/documents/bible-html/${relativePath}`;
		}
	},



	// ✅ 图片资源基准路径
	imagesBaseUrl: `${BASE_CDN_URL}/images/`,

	// ✅ API 请求基础地址
	apiBaseUrl: "https://api.klee.ink",

	// ✅ 页脚链接配置
	footer: {
		url: `${BASE_CDN_URL}/config/miscellaneous-table/footer.json`
	},

	// ✅ 通用静态资源路径拼接函数
	resolveStaticUrl(path) {
		return path.startsWith("http") ?
			path :
			`${BASE_CDN_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
	},

};