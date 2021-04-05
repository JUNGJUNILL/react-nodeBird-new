//웹펙을 바꾸기 위한 파일
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
  
  module.exports = withBundleAnalyzer({
    compress: true, //배포할 파일들을 gzip으로 압축해준는 장치 
    webpack(config, { webpack }) {
      const prod = process.env.NODE_ENV === 'production';
      return {
        ...config,
        mode: prod ? 'production' : 'development',
        devtool: prod ? 'hidden-source-map' : 'eval',
        plugins: [
          ...config.plugins,
          new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/), //monent 한국어만 되게끔 하기 위한 웹팩 설정
        ],
      };
    },
  });