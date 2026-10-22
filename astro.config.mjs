// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  // 部署後改成正式網址，例如 https://docs.moonland.ai
  site: 'https://docs.moonland.ai',
  integrations: [
    starlight({
      title: 'moonland.ai 說明中心',
      description: 'moonland.ai 官方使用教學：圖片生成、影片生成、交談、實驗室與團隊管理。',
      logo: { src: './src/assets/logo.svg', replacesTitle: false },
      defaultLocale: 'root',
      locales: {
        root: { label: '繁體中文', lang: 'zh-TW' },
      },
      social: [
        { icon: 'email', label: 'E-mail', href: 'mailto:support@moonshine.ai' },
        { icon: 'external', label: 'LINE 社群', href: 'https://lin.ee/PpA769D' },
      ],
      customCss: ['./src/styles/custom.css'],
      components: {
        // 文章標題下方顯示難度、適用模型、閱讀時間
        PageTitle: './src/components/PageTitle.astro',
        // 標題左邊加一顆按鈕，桌機版可收合整個左側目錄
        SiteTitle: './src/components/SiteTitle.astro',
      },
      lastUpdated: true,
      pagination: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      sidebar: [
        { label: '快速入門', collapsed: true, autogenerate: { directory: 'getting-started' } },
        {
          label: '功能教學',
          items: [
            { label: '圖片生成', collapsed: true, autogenerate: { directory: 'image' } },
            { label: '影片生成', collapsed: true, autogenerate: { directory: 'video' } },
            { label: '交談', collapsed: true, autogenerate: { directory: 'chat' } },
            { label: '實驗室', collapsed: true, autogenerate: { directory: 'lab' } },
            { label: '登月幣工具', collapsed: true, autogenerate: { directory: 'credit-tools' } },
            { label: '其他工具', collapsed: true, autogenerate: { directory: 'other-tools' } },
            { label: '社群藝廊', collapsed: true, autogenerate: { directory: 'gallery' } },
          ],
        },
        { label: '模型總覽', collapsed: true, autogenerate: { directory: 'models' } },
        { label: '帳號與團隊', collapsed: true, autogenerate: { directory: 'account' } },
        {
          label: '支援',
          items: [
            { label: '常見問題', slug: 'faq' },
            { label: '更新日誌', slug: 'changelog' },
            { label: '聯絡我們', slug: 'contact' },
            { label: '價目表', link: 'https://moonland.ai/pricing?direct', attrs: { target: '_blank' } },
          ],
        },
      ],
    }),
  ],
});
