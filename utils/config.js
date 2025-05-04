// utils/config.js

const BASE_CDN_URL = "https://static.klee.ink";

export const Config = {
  music: {
    sheetListUrl: `${BASE_CDN_URL}/config/music/type-0/sheet_list.json`,
    getSheetDetailUrl: function (sheetId) {
      return `${BASE_CDN_URL}/config/music/type-0/sheet_detail/sheet_${sheetId}.json`;
    }
  },

  festival: {
    getFestivalListUrl: function (yearMonth) {
      return `${BASE_CDN_URL}/config/festival-list/${yearMonth}.json`;
    },
    fullFestivalConfigUrl: `${BASE_CDN_URL}/config/miscellaneous-table/festival_config.json`,
    fullFestivalDetailUrl: `${BASE_CDN_URL}/config/miscellaneous-table/festival_articles.json`,
    festivalImageBaseUrl: `${BASE_CDN_URL}/content/images/festival`
  },

  books: {
    // ✅ 常用书籍 JSON 列表
    listUrl: `${BASE_CDN_URL}/config/index/e-book/common_books.json`,
    coverBaseUrl: `${BASE_CDN_URL}/`
  },

  catholicBooks: {
    // ✅ 首页书籍列表
    listUrl: `${BASE_CDN_URL}/catholic-books/list/books_list.json`,
    // ✅ 获取单本书章节 index
    getBookIndexUrl: function (bookId) {
      return `${BASE_CDN_URL}/catholic-books/index/${bookId}_index.json`;
    },
    // ✅ 获取某一章节 Markdown 正文路径（注意：最终路径从 index.json 中取更合理）
    getMarkdownUrl: function (bookId, fileName) {
      return `${BASE_CDN_URL}/catholic-books/markdown/${bookId}/${fileName}`;
    },
    // ✅ 获取封面图（可选）
    getCoverUrl: function (bookId) {
      return `${BASE_CDN_URL}/catholic-books/cover/${bookId}.jpg`;
    }
  },

  imagesBaseUrl: `${BASE_CDN_URL}/images/`,

  apiBaseUrl: "https://api.klee.ink",

  footer: {
    url: `${BASE_CDN_URL}/config/miscellaneous-table/footer.json`
  }
};
